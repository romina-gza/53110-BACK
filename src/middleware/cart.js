import { userService } from '../services/users.service.js'

/* const cartIdMiddleware = async (req, res, next) => {
    try {
        const userId = req.user._id
        //console.log('req user id: ', userId)
        //console.log('req user: ', req.user)
        //console.log('req session existUser', req.session.existUser)
        const user = await userService.getUserWithCart(userId)
        if (!user || !user.cart) {
            return res.status(404).send('Cart not found')
        }
        req.cartId = user.cart._id
        next();
    } catch (err) {
        res.status(500).send(err);
    }
};

export default cartIdMiddleware */
// middlewares/cartIdMiddleware.js
const cartIdMiddleware = (req, res, next) => {
    try {
/*         const userId = req.session.existUser._id;
        const cartId = req.session.existUser.cart
        console.log('user de mdwr de cart:', userId)
        if (!user || !user.cart) {
            console.log('Cart not found')
            //return res.status(404).send('Cart not found');
        }
        req.cartId = user.cart; 
        next(); */
        const user = req.session.existUser;
        if (user) {
            req.cartId = user.cart;
            console.log('Si tiene sesion el i cart es: ', user.cart)
        } else {
            console.log('no inició sesion')
        }
        next();
    } catch (err) {
        console.log('el error desde cart middleware: ',err)
        //res.status(500).send(err);
    }
};

export default cartIdMiddleware;

