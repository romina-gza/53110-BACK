export const accessMiddleware = (requiredRole) => {
    return (req, res, next) => {

        const userRole = req.session.existUser.role
        if (userRole !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: You do not have the right permissions' })
        }

        next()
    }
}