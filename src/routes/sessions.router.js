import { Router } from "express"
import passport from "passport"
import { auth } from "../middleware/auth.js"

export const sessionsRouter = Router()

sessionsRouter.get('/registerError', (req, res)=> {
    return res.status(400).redirect('/register?err=Error%20al%20momento%20de%20registrarse')
})
sessionsRouter.post('/register', 
    passport.authenticate('register', 
    {failureRedirect: '/api/sessions/registerError'} ),
    (req, res)=> {
    console.log('user req:', req.user)
    return res.redirect('/login')
})
/* sessionsRouter.post('/register', 
    passport.authenticate('register', 
    {failureRedirect: '/api/sessions/registerError'} ),
    (req, res)=> {
    console.log('user req:', req.user)
    return res.redirect('/login')
}) */
sessionsRouter.get('/loginError', (req, res)=> {
    //return res.status(400).json({err: 'Error al momento de logearse'})
    return res.status(400).redirect('/login?err=Error%20al%20momento%20de%20logearse')
})

sessionsRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/loginError' }), async (req, res)=> {
    
    let existUser = req.user
    delete existUser.password
    req.session.existUser = existUser
    try {
        res.setHeader('Content-Type', 'application/text')
        /* return res.status(200).json({message: `Login correcto`, existUser}) */
        return res.redirect('http://localhost:8080/products')
    } catch (err) {
        console.log('el eerror:', err)
        console.log('mensaje de error:', err.message)
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
    //res.status(200).json({ message: "Logout exitoso" })
    return res.redirect('http://localhost:8080/login')

})

// con github
sessionsRouter.get('/github', passport.authenticate('github', {}), (req, res)=> {})
sessionsRouter.get('/sessionsGithub', passport.authenticate('github', {failureRedirect: '/api/sessions/errorFromGithub'}), (req, res) => {
    req.session.existUser = req.user
//    console.log('req. user github: ', req.user)
    res.setHeader('Content-Type', 'application/json')
    /* return res.status(200).json({
        payload: 'login correcto',
        user: req.user
    }) */
    return res.redirect('/products')
})
sessionsRouter.get('/errorFromGithub', (req, res)=> {
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({
        err: 'Error en el servidor, por favor intente nuevamente.',
        detail: 'Falló la autenticación con Github'
    })
})

sessionsRouter.get('/current', auth, (req, res) => {
    try {
        let user = req.session.existUser
        res.status(200).render("current", { user })
    } catch (err) {
        return err
    }
})