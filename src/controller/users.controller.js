import { config } from "../config/config.js"
import { sendUserDeletionEmail } from "../email.js"
import { cartsServices } from "../services/carts.service.js"
import { userService } from "../services/users.service.js"
import { createHash, validatePassword } from "../utils.js"

export default class UsersController {
    static getAllUsers = async (req, res) => {
        try {
            await userService.getAllUsers()
            res.setHeader('Content-Type', 'application/json')
            res.status(201).json('Devuelve todos los usuarios')
        } catch (err) {
            req.logger.fatal(`Error desde 'users', en 'getAllUser'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json('Error al obtener todos los usuarios')
        }
    }

    static getUser = async (req, res) => {
        try {
            const { userId } = req.params
            await userService.createCartForUser(userId)
            res.setHeader('Content-Type', 'application/json')
            res.status(201).json('Carrito creado y asociado al usuario')
        } catch (err) {
            req.logger.fatal(`Error desde 'users', en 'getUser'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json('Error al crear el carrito')
        }
    }

    static createUser = async (req, res) => {
        try {
            const { first_name, last_name, age, email, password, role } = req.body;
            const newUser = await usersManager.createUser({ first_name, last_name, age, email, password, role });
            
            await cartsServices.createCartForUser(newUser._id);
            
            res.status(201).json({ message: 'Usuario creado y carrito asignado', user: newUser });
        } catch (error) {
            req.logger.fatal(`Error desde 'users', en 'createUser'. El error: ${err}`)
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
            req.logger.fatal(`Error desde 'users', en 'getUserWithCart'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json('Error al obtener el usuario con carrito')
        }
    }

    // passport.config
    static registerUser = async (req, username, password, done) => {
        try {
            const { first_name } = req.body;
            if (!first_name) {
                return done(null, false);
            }
            let exist = await userService.getUserEmail(username)

            if (exist) {
                req.logger.error(`El usuario: '${exist}' ya existe`)
                return done(null, false);
            }
            password = createHash(password);
            let newUser = await userService.createUser({ first_name, email: username, password })
            await cartsServices.createCartForUser(newUser._id)
            return done(null, newUser);
        } catch (err) {
            req.logger.fatal(`Error desde 'users', en 'registerUser'. El error: ${err}`)
            return done(err);
        }
    }

    static loginUser = async ( username, password, done ) => {
        try {
            let existUser = await userService.getUserEmail(username)
            
            if (!existUser) {
                return done(null, false)
            }
            // login admin
            const eCoder = config.EUS_AD
            const psw = config.PA_AD
            if (username === eCoder && password === psw) {
                existUser.role = 'admin'
            }
            
            if (!validatePassword(existUser, password)) {
                return done(null, false)
            }
            return done(null, existUser)
        } catch (err) {
            req.logger.fatal(`Error desde 'users', en 'loginUser'. El error: ${err}`)
            return done(err)
        }
    }
    static loginWithGithub = async function( accessToken, refreshToken, profile, done ) {
        try {
            let first_name = profile._json.name
            let email = profile._json.email

            let existUser = await userService.getUserEmail(email)
            
            if (!existUser) {
                let newUser = await userService.createUser({first_name, email, profileGitHub: profile})
                req.logger.info(`Newuser github: ${newUser}`)
                await cartsServices.createCartForUser(newUser._id)
            }
            return done(null, existUser)
        } catch (err) {
            req.logger.fatal(`Error desde 'users', en 'loginWithGithub'. El error: ${err}`)
            return done(err)
        }
    }
    static deserializeUser = async (id, done) => {
        try {
            let user = await userService.getUserId(id)
            return done(null, user)
        } catch (err) {
            req.logger.fatal(`Error desde 'users', en 'deserializeUser'. El error: ${err}`)
            return done(err)
        }
    }
    static notActiveUsers = async () => {
        try {
            const daysBefore = 0.00347 // para pruebas cambia a 0.00347 para 5 minutos, original 2
            const dateLimit = new Date()
            dateLimit.setDate(dateLimit.getDate() - daysBefore)

            const result = await userService.notActiveUsers()
            console.log('Resultado de los user eliminados: (RESULT):', result)
            if (result.deletedCount > 0) {
                for (const user of result.deletedUsers) {
                    console.log('user emai:', user.email)
                    console.log('user first name:', user.first_name)
                    await sendUserDeletionEmail(user.email, user.first_name)
                }
                res.status(200).json({ message: `${result.deletedCount} usuarios eliminados por inactividad.` });
            } else {
                res.status(200).json({ message: 'No se encontraron usuarios inactivos.' });
            }
        } catch (error) {
            req.logger.fatal(`Error desde 'users', en 'notActiveUsers'. El error: ${err}`)
            res.status(500).json({ message: 'Error al eliminar usuarios inactivos.', error });
        }
    }
}