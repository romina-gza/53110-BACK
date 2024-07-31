export const accessMiddleware = ( requiredRole = [] ) => {
    return (req, res, next) => {

        if ( requiredRole.includes('public') ) {
            return next()
        }

        if ( !req.session.existUser || !req.session.existUser.role ) {
            res.setHeader('Content-Type', 'application/json')
            req.logger.error('No existen usuarios autenticados.')
            return res.status(401).json( { err: 'No existen usuarios autenticados.' } )
        }

        if ( !requiredRole.includes( req.session.existUser.role.toLowerCase() ) ) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(403).json( { err: 'No tiene los permisos necesarios para proseguir.' } )
        }

        next()
    }
}