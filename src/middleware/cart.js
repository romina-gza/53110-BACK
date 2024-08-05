import { logger } from "../utils.js"

// cartIdMiddleware
const cartIdMiddleware = (req, res, next) => {
    try {
        const user = req.session.existUser
        if (user) {
            req.cartId = user.cart            
        } else {
            logger.info('no inició sesion')
        }
        next()
    } catch (err) {
        logger.error(`el error desde cart middleware: ${err}`)
    }
}

export default cartIdMiddleware

