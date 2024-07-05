// middleware/cartIdMiddleware.js
const cartIdMiddleware = (req, res, next) => {
    try {
        const user = req.session.existUser;
        //const userCartId = user.cart
        if (user) {
            req.cartId = user.cart;
            console.log('Si tiene sesion el id cart es: ', user.cart)
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

