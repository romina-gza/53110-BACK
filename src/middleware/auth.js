// autenticar usuario - Login
export const auth = (req, res, next) => {
    if (!req.session.existUser) {
        res.setHeader('Content-Type','application/json')
        //console.log('user without authentication.')
        //return res.status(401).json({error: 'Usuario sin autenticar.'})
        return res.redirect(401, '/login')
    }
    next()
}
