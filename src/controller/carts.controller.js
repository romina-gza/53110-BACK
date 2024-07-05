import { cartsServices } from "../services/carts.service.js"
import { productsServices } from "../services/products.service.js"

export default class CartsController {
    static createCart = async ( req, res ) => {
        try {
            let newCart = await cartsServices.createCart()
            //console.log("newcart", newCart)
            res.setHeader('Content-Type','application/json')
            res.status(201).json( {payload: newCart} )
        } catch (err) {
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
    static getCartById = async ( req, res ) => {
        try {
            let cid = Number(req.params.cid);
            if (isNaN(cid)) {
            res.setHeader("Content-Type", "application/json");
            return res
                .status(400)
                .json({ message: "El id debe ser un número" });
            }
            let data = await cartsServices.getCartsById(cid);
            if (!data) {
            res.setHeader("Content-Type", "application/json");
            return res
                .status(400)
                .json({ message: `El id: ${cid} no existe.` });
            }
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(data);
        } catch (err) {
            res.setHeader("Content-Type", "application/json");
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    // CUESTIONABLE - revisar
    /* static addToCart = async ( req, res ) => {
        try {
            //posible uso de Number()
            // let cid = Number(req.params.cid)
            // if (isNaN(cid)) {
            //     res.setHeader('Content-Type','application/json')
            //     return res.status(400).json({message: "El id debe ser un número"})
            // }
            
            const { cid, pid } = req.params
            const { quantity } = req.query
            console.log("quantity params: ", quantity)
        // Verificar si el producto existe en la base de datos
            const product = await productsServices.getProductsById(pid)
            console.log('product: ', product)
            if (!product) {
                res.setHeader('Content-Type','application/json')
                return res.status(404).json({ message: 'Producto no encontrado' })
            }
        // Verificar si el carrito existe
            const cart = await cartsServices.getCartsById(cid)
            if (!cart) {
                res.setHeader('Content-Type','application/json')
                return res.status(404).json({ message: 'Carrito no encontrado' })
            }
        // Agregar el producto al carrito
            await cartsServices.addToCart(cid, pid, quantity)
            //await carts.addToCart(cid, pid, quantity)
            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: 'Producto agregado al carrito:', cid })
        } catch (err) {
            //console.error('Error al agregar producto al carrito:', err)
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        } 
    } */
    static addToCart = async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const cartId = req.cartId;
            //const cartId = req.session.existUser.cart
            //console.log('cartId eess:', cartId)
            //const updatedCart = await cartsDao.addToCart(cartId, productId, quantity);
            const updatedCart = await cartsServices.addToCart(cartId, productId, quantity)
            res.status(200).json(updatedCart);
        } catch (err) {
            res.status(500).send(err);
        }
    };
    static deleteProduct = async ( req, res ) => {
        try {
            let { cid, pid } = req.params
            await cartsServices.deleteProduct(cid, pid)
            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: 'Producto eliminado del carrito:', cid })
        } catch (err) {
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
    static updateACart = async ( req, res ) => {
        try {
            const { cid } = req.params
            const newProducts = req.body
            await cartsServices.updateACart(cid, newProducts)
            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: 'Carrito actualizado:', cid })
        } catch (err) {
            // console.error('Error al actualizar productos al carrito:', err)
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
    static updateQuantity = async ( req, res ) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
            await cartsServices.updateQuantity(cid,pid, quantity)
            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: 'Productos actualizado del carrito:', cid })
        } catch (err) {
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
    static deleteAllProducts = async ( req, res ) => {
        try {
            const { cid } = req.params
            await carts.deleteAllProducts(cid)
            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: 'Productos eliminados del carrito:', cid })
        } catch (err) {
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}