import { config } from "../config/config.js"
import { sendUserDeletionEmail } from "../email.js"
import { cartsServices } from "../services/carts.service.js"
import { userService } from "../services/users.service.js"
import { createHash, logger, validatePassword } from "../utils.js"

export default class UsersController {
    static getAllUsers = async (req, res) => {
        try {
            const users = await userService.getAllUsers()
            res.setHeader('Content-Type', 'application/json')
            res.status(201).json({message: 'Todos los usuarios', users})
        } catch (err) {
            logger.fatal(`Error desde 'users', en 'getAllUser'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({message: `Error desde 'users', en 'getAllUser'. El error: ${err}`})
        }
    }

    static getUser = async (req, res) => {
        try {
            const { userId } = req.params
            await userService.createCartForUser(userId)
            res.setHeader('Content-Type', 'application/json')
            res.status(201).json('Carrito creado y asociado al usuario')
        } catch (err) {
            logger.fatal(`Error desde 'users', en 'getUser'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({message:`Error desde 'users', en 'getUser'. El error: ${err}`})
        }
    }

    static createUser = async (req, res) => {
        try {
            const { first_name, last_name, age, email, password, role } = req.body;
            const newUser = await usersManager.createUser({ first_name, last_name, age, email, password, role });
            
            await cartsServices.createCartForUser(newUser._id);
            
            res.status(201).json({ message: 'Usuario creado y carrito asignado', user: newUser });
        } catch (error) {
            logger.fatal(`Error desde 'users', en 'createUser'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ message: `Error desde 'users', en 'createUser'. El error: ${err}` });
        }
    }

    static getUserWithCart = async (req, res) => {
        try {
            const { userId } = req.params
            const user = await userService.getUserWithCart(userId)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({user})
        } catch (err) {
            logger.fatal(`Error desde 'users', en 'getUserWithCart'. El error: ${err}`)
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
                logger.error(`El usuario: '${exist}' ya existe`)
                return done(null, false);
            }
            password = createHash(password);
            let newUser = await userService.createUser({ first_name, email: username, password })
            await cartsServices.createCartForUser(newUser._id)
            return done(null, newUser);
        } catch (err) {
            logger.fatal(`Error desde 'users', en 'registerUser'. El error: ${err}`)
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
            existUser.last_connection = new Date()

            // actualiza ultima conexion del user
            await userService.updateLastConnection(existUser._id);

            return done(null, existUser)
        } catch (err) {
            logger.fatal(`Error desde 'users', en 'loginUser'. El error: ${err}`)
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
                logger.info(`Newuser github: ${newUser}`)
                await cartsServices.createCartForUser(newUser._id)
            }
            return done(null, existUser)
        } catch (err) {
            logger.fatal(`Error desde 'users', en 'loginWithGithub'. El error: ${err}`)
            return done(err)
        }
    }
    static deserializeUser = async (id, done) => {
        try {
            let user = await userService.getUserId(id)
            return done(null, user)
        } catch (err) {
            logger.fatal(`Error desde 'users', en 'deserializeUser'. El error: ${err}`)
            return done(err)
        }
    }

    static notActiveUsers = async (req, res) => {
        try {
            const daysBefore = 0.00347; // Para testeos con 5 minutes - mas eficiente
            const dateLimit = new Date();
            dateLimit.setMinutes(dateLimit.getMinutes() - daysBefore * 24 * 60);
    
            const inactiveUsers = await userService.notActiveUsers(dateLimit);
    
            if (inactiveUsers.length > 0) {
                for (const user of inactiveUsers) {
                    await sendUserDeletionEmail(user.email, user.first_name);
                }
                req.logger(`${inactiveUsers.length} users eliminados debido a inactividad.`)
            } else {
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json({ message: 'No se encontraron usuarios inactivos.' })
            }
        } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ error: 'Error al eliminar ususarios no activos', detalle: err });
        }
    }
    
    static updateUserRole = async (req, res) => {
        try {
            const { cid } = req.params;
            const { newRole } = req.body;
            const existCid = await userService.getUserId(cid)
            if (!existCid) {
                return res.status(400).json({ error: `Usuario no encontrado: ${cid}`});
            }

            if (!['user', 'admin', 'premium'].includes(newRole)) {
                return res.status(404).json({ error: 'Rol inválido. Solo se permiten los roles: user, admin, premium.' });
            }

            const updatedUser = await userService.updateUserRole(cid, newRole);
        
            if (updatedUser) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(200).json({ message: 'Rol actualizado', user: updatedUser });
            } else {
                res.setHeader('Content-Type', 'application/json')
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ error: 'Error al actualizar el rol de usuario', detalle: err });
        }
    }
    
    static deleteUserById = async (req, res) => {
        try {
            const { cid } = req.params
            const existCid = await userService.getUserEmail(cid.email)
            const deletedUser = await userService.deleteUserById(cid);
            
            if (!deletedUser || !existCid) {
                logger.fatal(`usuario inexitente: ${deletedUser}`)
                logger.error(`ID de usuario no encontrado: ${existCid}`)
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            if (deletedUser) {
                return res.status(200).json({ message: 'Usuario eliminado', user: deletedUser });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error al eliminar el usuario', detalle: err });
        }
    }

    static uploadDocuments = async (req, res) => {
        try {
            const { uid } = req.params;
            const existUser = await userService.getUserId(uid)

            // Verificar si el usuario es premium
            if (!uid || !existUser) {
                return res.status(400).json({ message: 'Solo los usuarios registrados y logueados pueden solicitar ser premium.' });
            }
            const files = req.files;
    
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No se subieron documentos.' });
            }
    
            const documents = files.map(file => ({
                name: file.originalname,
                reference: file.path
            }));
    
            let UPD = await userService.updateUserDocuments(uid, documents);
            if (UPD) {
                await userService.updateTopremium(uid)
            }
            req.logger.info('Documentos subidos con exito. Ya eres premium, vuelve a iniciar sesion!')

            res.setHeader('Content-Type', 'application/json')
            res.status(200).redirect('/login');
        } catch (err) {
            res.status(500).json({ error: 'Error al subir documentos', detalle: err });
        }
    }

    static updateUserRoleToPremium = async (req, res) => {
        try {
            const { uid } = req.params;
            // obtiene user by id, pifié en el nombre.
            const user = await userService.getUserId(uid);

            const requiredDocs = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const hasAllDocuments = requiredDocs.every(doc => user.documents.some(d => d.name === doc));
            let UTP= await userService.updateTopremium(uid)
    
            res.status(200).json({ message: 'Usuario actualizado a premium.', newRole : UTP }); 

        } catch (err) {
            res.status(500).json({ error: 'Error al actualizar rol de usuario', detalle: err });
        }
    };
    
}