import { config } from "../config/config.js"
import { cartsServices } from "../services/carts.service.js"
import { userService } from "../services/users.service.js"
import { createHash, validatePassword } from "../utils.js"

export default class UsersController {

    static getUser = async (req, res) => {
        try {
            const { userId } = req.params
            await userService.createCartForUser(userId)
            res.setHeader('Content-Type', 'application/json')
            res.status(201).json('Carrito creado y asociado al usuario')
        } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json('Error al crear el carrito')
        }
    }
    // revisar igual al anterior - posible error todo
    static createUser = async (req, res) => {
        try {
            const { first_name, last_name, age, email, password, role } = req.body;
            const newUser = await usersManager.createUser({ first_name, last_name, age, email, password, role });
            
            await cartsServices.createCartForUser(newUser._id);
            
            res.status(201).json({ message: 'Usuario creado y carrito asignado', user: newUser });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear usuario', error });
        }
    }
    static getUserWithCart = async (req, res) => {
        try {
            const { userId } = req.params
            const user = await userService.getUserWithCart(userId)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(user)
        } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json('Error al obtener el usuario con carrito')
        }
    }

    /* passport.config */
    static registerUser = async (req, username, password, done) => {
        try {
            const { first_name } = req.body;
            if (!first_name) {
                return done(null, false);
            }
            let exist = await userService.getUserEmail(username)
            // let exist = await usersManager.getBy({ email: username });
            console.log('el email del user existe:', exist)
            if (exist) {
                return done(null, false);
            }
            password = createHash(password);
            let newUser = await userService.createUser({ first_name, email: username, password })
            // let newUser = await usersManager.createUser({ first_name, email: username, password });
            console.log('new user controller/user-mongo-dao:', newUser)
            //await cartsManager.createCartForUser(newUser._id);
            await cartsServices.createCartForUser(newUser._id)
            return done(null, newUser);
        } catch (err) {
            console.log('el error de register:', err)
            return done(err);
        }
    }
    static loginUser = async ( username, password, done ) => {
        try {
            let existUser = await userService.getUserEmail(username)
            //let existUser = await usersManager.getBy({email: username})
            
            if (!existUser) {
                return done(null, false)
            }
            // login admin
            const eCoder = config.EUS_AD
            const psw = config.PA_AD
            if (username === eCoder && password === psw) {
                existUser.role = 'admin'
            }
            
            // Verificar la contraseña bcrypt
            if (!validatePassword(existUser, password)) {
                return done(null, false)
            }
            return done(null, existUser)
        } catch (err) {
            return done(err)
        }
    }
    static loginWithGithub = async function( accessToken, refreshToken, profile, done ) {
        try {
           // console.log('profile: ', profile)
            let first_name = profile._json.name
            let email = profile._json.email

            let existUser = await userService.getUserEmail(email)
            //let existUser = await usersManager.getBy({email})
            
            if (!existUser) {
                let newUser = await userService.createUser({first_name, email, profileGitHub: profile})
                console.log('newuser github: ', newUser)
                //await usersManager.createUser({first_name, email, profileGitHub: profile})
                await cartsServices.createCartForUser(newUser._id)
            }
            return done(null, existUser)
        } catch (err) {
            console.log('error github login: ', err)
            return done(err)
        }
    }
    static deserializeUser = async (id, done) => {
        let user = await userService.getUserId(id)
        //let user = await usersManager.getBy({_id: id})
        return done(null, user)
    } 
}