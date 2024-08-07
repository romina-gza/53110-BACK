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
    return res.redirect('/login')
})

sessionsRouter.get('/loginError', (req, res)=> {
    return res.status(400).redirect('/login?err=Error%20al%20momento%20de%20logearse')
})

sessionsRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/loginError' }), async (req, res)=> {
    
    let existUser = req.user
    delete existUser.password
    req.session.existUser = existUser
    try {
        req.logger.info(`message from /login: ID del user${existUser._id}`)
        res.setHeader('Content-Type', 'application/text')
        return res.redirect('http://localhost:8080/products')
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({error: `Error en el servidor. Error: ${err.message}`})
    }
})

sessionsRouter.get("/logout", (req, res) => {
    req.session.destroy(e => {
            if ( e ) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(500).json({
                    error: "Error inesperado. Intente más tarde",
                    detail: `${e.message}`
                }
            )
        }
    })
    res.setHeader('Content-Type', 'application/text')
    logger.info("Logout exitoso")
    return res.redirect('http://localhost:8080/login')

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