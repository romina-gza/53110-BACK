import { sendEmail } from "../email.js"
import { cartsServices } from "../services/carts.service.js"

export default class CartsController {

    static createCart = async ( req, res ) => {
        try {
            let newCart = await cartsServices.createCart()
            res.setHeader('Content-Type','application/json')
            res.status(201).json( {payload: newCart} )
        } catch (err) {
            req.logger.fatal(`Error en 'Carts' al momento de 'createCart'. El error: ${err}`)
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
    static getCartById = async ( req, res ) => {
        try {
            let cid = Number(req.params.cid)
                if (isNaN(cid)) {
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ message: "El id debe ser un número" })
                }
            let data = await cartsServices.getCartsById(cid)
                if (!data) {
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ message: `El id: ${cid} no existe.` })
                }

            res.setHeader("Content-Type", "application/json")
            res.status(200).json(data)
        } catch (err) {
            req.logger.fatal(`Error en 'Carts' al momento de 'getCartById'. El error: ${err}`)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
    
    static addToCart = async (req, res) => {
        try {
            const { productId, quantity } = req.body
            const cartId = req.cartId
            const updatedCart = await cartsServices.addToCart(cartId, productId, quantity)
            
            await cartsServices.calculateTotalPrice(req.session.existUser.cart)
            res.status(200).json(updatedCart)
        } catch (err) {
            req.logger.fatal(`Error en 'Carts' al momento de 'addToCart'. El error: ${err}`)
            
            res.status(500).send(err)
        }
    }
    static deleteProduct = async ( req, res ) => {
        try {
            let { cid, pid } = req.params
            await cartsServices.deleteProduct(cid, pid)

            await cartsServices.calculateTotalPrice(req.session.existUser.cart)
            
            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: 'Producto eliminado del carrito:', cid })
        } catch (err) {
            req.logger.fatal(`Error en 'Carts' al momento de 'deleteProduct'. El error: ${err}`)
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
            req.logger.fatal(`Error en 'Carts' al momento de 'updateACart'. El error: ${err}`)
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
    static updateQuantity = async ( req, res ) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
            await cartsServices.updateQuantity(cid,pid, quantity)

            await cartsServices.calculateTotalPrice(req.session.existUser.cart)

            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: 'Productos actualizado del carrito:', cid })
        } catch (err) {
            req.logger.fatal(`Error en 'Carts' al momento de 'updateQuantity'. El error: ${err}`)
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
    static deleteAllProducts = async ( req, res ) => {
        try {
            const { cid } = req.params
            await cartsServices.deleteAllProducts(cid)
            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: 'Productos eliminados del carrito:', cid })
        } catch (err) {
            req.logger.fatal(`Error en 'Carts' al momento de 'deleteAllProducts'. El error: ${err}`)
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }

    static processPurchase = async (req, res) => {
        try {
            const cartId = req.cartId
            const totalAmount = await cartsServices.calculateTotalPrice(cartId)

            const userEmail = req.session.existUser.email
            let resp = await cartsServices.processPurchase(cartId, totalAmount, userEmail)
            console.log(' controller RESP: ', resp)
            
            let yourTicket = resp.createdNewTicket
            let notProcessed = resp.productsNotProcessed
            // datos importantes - reutilizar cuando crees la vista ticket.
            req.logger.info(`Este es su ticket: ${yourTicket}`)
            console.log('It is notProcessed', notProcessed)

            await sendEmail(userEmail, req.session.existUser.first_name, yourTicket._id, yourTicket.purchase_datetime)
            
            res.setHeader('Content-Type','application/json')
            res.status(201).json({ 
                message: 'Ticket creado para el carrito:', 
                cartId, 
                yourTicket, 
                notProcessed
            })
        } catch (err) {
            req.logger.fatal(`Error en 'Carts' al momento de 'processPurchase'. El error: ${err}`)
            res.setHeader('Content-Type','application/json')
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}