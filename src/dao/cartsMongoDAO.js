import { cartsModel } from "./model/carts.model.js"
import { ticketModel } from "./model/ticket.model.js"
import { usersModel } from "./model/users.model.js"
import mongoose from "mongoose"


export class CartsMongoDAO {
    async createCart (products) {
        try {
            return await cartsModel.create(products)
        } catch (err) {
            return err
        }
    }

    async getCarts () {
        try {
            return await cartsModel.find().populate(
                "products.productId"
            )
        } catch (err) {
            return err
        }
    }
    async getCartsById (id) {
        try {
            const cart = await cartsModel.findOne(id).lean().select('products').populate('products.productId')
            return cart.products
        } catch (err) {
            return err
        }
    }

    async addToCart (cid, pid, quantity) {
        try {
            // Asegurarte de que `pid` sea un ObjectId
            const objectIdProduct = new mongoose.Types.ObjectId(pid)
    
            const existingProduct = await cartsModel.findOneAndUpdate(
                { _id: cid, 'products.productId': objectIdProduct },
                { $inc: { 'products.$.quantity': quantity } },
                { new: true }
            )
    
            if (!existingProduct) {
                const updatedCart = await cartsModel.findByIdAndUpdate(
                    cid,
                    {
                        $push: {
                            products: {
                                productId: objectIdProduct,
                                quantity: quantity
                            }
                        }
                    },
                    { new: true }
                )
    
                return updatedCart
            }
    
            return existingProduct
        } catch (err) {
            console.error(`Error al agregar al carrito: ${err.message}`)
            return err
        }
    }
    

    async updateACart (cid, newProducts) {
        try {

            return await cartsModel.updateOne(
                cid,
                { $set: { products: newProducts } }, 
                { new: true}
            )
        } catch (err) {
            return err
        }
    }

    async updateQuantity(cid, pid, quantity){
        try {
            return await cartsModel.findOneAndUpdate(
                { _id: cid, "products.productId": pid },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            )
        } catch (err) {
            return err
        }
    }
    async deleteProduct(cid, pid) {
        try {
            const cartId = cid
            const prodId = pid 
            let result = await cartsModel.findOneAndUpdate(
                { _id: cartId},
                { $pull: { products: { productId: prodId} } },
                { new: true }
                )
            return result
        } catch (err) {
            return err
        }
    }
    async deleteAllProducts (cid) {
        try {
            return await cartsModel.updateOne(
                cid,
                { $set: { products: [] } }, 
                { new: true}
            )
        } catch (err) {
            return err
        }
    }
    async createCartForUser(userId) {
        try {
            const cart = new cartsModel({
                products: [], 
                totalPrice: 0
            })
            await cart.save()
            const user = await usersModel.findById(userId)
            user.cart = cart._id
            return await user.save()            
        } catch (err) {
            return err
        }
    }

    async calculateTotalPrice(cartId) {
        try {
            const cart = await cartsModel.findById(cartId).populate('products.productId')
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`)
            }
    
            let totalPrice = 0
    
            for (const item of cart.products) {
                if (!item.productId) {
                    throw new Error(`Producto no encontrado para el item con id ${item._id}`)
                }
    
                const productPrice = item.productId.price || 0
                const productQuantity = item.quantity || 1
                
                totalPrice += productPrice * productQuantity
            }
    
            // Actualiza el precio total del carrito en la base de datos
            cart.totalPrice = totalPrice
            await cart.save()
    
            return totalPrice
        } catch (err) {
            console.error(`Error al calcular el precio total: ${err.message}`)
            throw err
        }
    }
    
    
    // Ticket
    async getLastTicketCode() {
        try {
            const lastTicketCode = await ticketModel.findOne({}).sort({ code: -1 }).exec()
            return lastTicketCode ? lastTicketCode.code : 0
        } catch (err) {
            return err
        }
    }
    async createTicket ( amount, purcharser ) {
        try {
            // Obtiene el último código y genera uno nuevo
            let lastCode = await this.getLastTicketCode()

            let code = lastCode + 1

            const newTicket = new ticketModel({
            amount,
            purcharser,
            code
            })

            return await newTicket.save()
        } catch (err) {
            return err
        }
    }


    // Proceso de compra
    async processPurchase (cid, totalAmount, purcharser) {
        try {
            const cart = await cartsModel.findById(cid).populate('products.productId')

            let productsNotProcessed = []
            
            for (const item of cart.products) {
                const product = item.productId
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity
                    totalAmount += product.price * item.quantity
                    await product.save()
                } else {
                    productsNotProcessed.push(product._id)
                }
            }
            
            // Limpiar el cart
            cart.products = cart.products.filter(item => productsNotProcessed.includes(item.productId._id))
            await cart.save()

            const createdNewTicket = await this.createTicket( totalAmount, purcharser )
            
            const responseAll = {
                createdNewTicket,
                productsNotProcessed
            }
            return responseAll
        } catch (err) {
            return err
        }
    }
}