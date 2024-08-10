import { sendEmail } from "../email.js"
import { cartsServices } from "../services/carts.service.js"
import { productsServices } from "../services/products.service.js"
import { userService } from "../services/users.service.js"

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
            let cid = req.params.cid

            let data = await cartsServices.getCartsById(cid)
                if (!data || data.name == "CastError") {
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
            
            const { quantity } = req.body
            const {cid}  = req.params 
            const {pid} = req.params 

            // Verifica q pid exista en la base de datos
            const productExists = await productsServices.getProductsById(pid)
            if (!productExists) {
                return res.status(404).json({ message: `Producto con id ${pid} no encontrado` })
            }

            // Verificar si pid no fue enviado en req.params
            if (!pid) {
                return res.status(400).json({ message: `Producto id no proporcionado en la solicitud` })
            }
            
            const updatedCart = await cartsServices.addToCart(cid, pid, quantity)
            let cartCTP = await cartsServices.calculateTotalPrice(cid)

            const cartDetails = {
                cartId: updatedCart._id,
                products: updatedCart.products,
                totalPrice: cartCTP
            }
    
            // Enviar la respuesta con los detalles del carrito
            res.status(200).json({
                message: 'Carrito actualizado con éxito',
                cart: cartDetails
            })
        } catch (err) {
            req.logger.fatal(`Error en 'Carts' al momento de 'addToCart'. El error: ${err}`)
            res.status(500).send(err)
        }
    }

    static deleteProduct = async ( req, res ) => {
        try {
            let { cid, pid } = req.params
            await cartsServices.deleteProduct(cid, pid)
            await cartsServices.calculateTotalPrice(cid)
            
            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: `Producto: ${pid} eliminado del carrito: ${cid}` })
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

            if (!quantity) {
                return res.status(400).json({ message: "Quantity is required" })
            }
            await cartsServices.updateQuantity(cid,pid, quantity)
            
            await cartsServices.calculateTotalPrice(cid)


            res.setHeader('Content-Type','application/json')
            res.status(201).json({ message: 'Producto actualizado del carrito:', cid })
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
            const { cid } = req.params
            // Buscar al usuario por el cart ID (cid) usando el userService
            const user = await userService.getUserByCid(cid)
            if (user instanceof Error || !user) {
                return res.status(404).json({ message: 'Usuario no encontrado para el carrito proporcionado.' })
            }
    
            // Obtener el correo electrónico del usuario y otros datos necesarios
            const userEmail = user.email
            const userName = user.first_name
    
            // Calcular el precio total del carrito
            const totalAmount = await cartsServices.calculateTotalPrice(cid)
    
            // Procesar la compra
            let resp = await cartsServices.processPurchase(cid, totalAmount, userEmail)
    
            // Obtener el ticket generado y los productos no procesados
            let yourTicket = resp.createdNewTicket
            let notProcessed = resp.productsNotProcessed
    
            // Log de información
            req.logger.info(`Este es su ticket: ${yourTicket}`)
    
            // Enviar un correo electrónico con el ticket
            await sendEmail(userEmail, userName, yourTicket._id, yourTicket.purchase_datetime)
    
            // Responder con la información del ticket y productos no procesados
            res.status(201).json({
                message: 'Ticket creado para el carrito',
                cartId: cid,
                yourTicket,
                notProcessed
            })
        } catch (err) {
            req.logger.fatal(`Error en 'Carts' al momento de 'processPurchase'. El error: ${err}`)
            res.status(500).json({ message: 'Error interno del servidor', error: err.message })
        }
    }
    
}