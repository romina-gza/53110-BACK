import { Router } from "express"
import passport from "passport"
import { UserDTO } from "../dto/users.dto.js"
import { logger } from "../utils.js"

export const sessionsRouter = Router()

sessionsRouter.get('/registerError', (req, res)=> {
    return res.status(400).redirect('/register?err=Error%20al%20momento%20de%20registrarse')
})

sessionsRouter.post('/register', 
    passport.authenticate('register', 
    {failureRedirect: '/api/sessions/registerError'} ),
    (req, res)=> {
        const newUser = req.user
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({message: `Registro exitoso, usuario: ${newUser.email} /n ID de carrito:${newUser.cart.cart}`})
    }
)


sessionsRouter.get('/loginError', (req, res)=> {
    return res.status(400).redirect('/login?err=Error%20al%20momento%20de%20logearse')
})

sessionsRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/loginError' }), async (req, res) => {
    let existUser = req.user

    // Eliminamos la contraseña del objeto del usuario por seguridad
    delete existUser.password

    // Almacenamos el usuario en la sesión
    req.session.existUser = existUser

    try {
        req.logger.info(`message from /login: ID del user ${existUser._id}`)

        // Respondemos con la información del usuario
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
            message: 'Login exitoso',
            userId: existUser._id,
            email: existUser.email,
            cartId: existUser.cart ? existUser.cart : null
        })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({ error: `Error en el servidor. Error: ${err.message}` })
    }
})

sessionsRouter.get("/logout", (req, res) => {
    req.session.destroy(e => {
        if (e) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({
                error: "Error inesperado. Intente más tarde",
                detail: `${e.message}`
            })
        }
        res.setHeader('Content-Type', 'application/json')
        logger.info("Logout exitoso")
        return res.status(200).json({
            message: "Logout exitoso"
        })
    })
})


// con github
sessionsRouter.get('/github', passport.authenticate('github', {}), (req, res)=> {})
sessionsRouter.get('/sessionsGithub', passport.authenticate('github', {failureRedirect: '/api/sessions/errorFromGithub'}), (req, res) => {
    req.session.existUser = req.user
    res.setHeader('Content-Type', 'application/json')

    return res.redirect('/products')
})
sessionsRouter.get('/errorFromGithub', (req, res)=> {
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({
        err: 'Error en el servidor, por favor intente nuevamente.',
        detail: 'Falló la autenticación con Github'
    })
})

sessionsRouter.get('/current', (req, res) => {
    try {
        let user = req.session.existUser
        let returnUser = new UserDTO(user)
        res.status(200).render("current", { user })
    } catch (err) {
        return err
    }
})