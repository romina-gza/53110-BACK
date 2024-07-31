import { logger } from "../utils.js"

// autenticar usuario - Login
export const auth = (req, res, next) => {
    if (!req.session.existUser) {
        logger.error('aúnn no estas logueado 🫤')
        res.setHeader('Content-Type','application/json')
        return res.redirect('/login')
    }
    next()
}


