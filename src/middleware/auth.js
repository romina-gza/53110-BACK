// autenticar usuario - Login
export const auth = (req, res, next) => {
    if (!req.session.existUser) {
        res.setHeader('Content-Type','application/json')
        return res.redirect('/login')
    }
    next()
}


