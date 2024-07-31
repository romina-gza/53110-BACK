import { cartsModel } from "./model/carts.model.js"
import { ticketModel } from "./model/ticket.model.js"
import { usersModel } from "./model/users.model.js"

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
        // Verificar si el producto ya existe en el carrito
            const existingProduct = await cartsModel.findOneAndUpdate(
                { _id: cid, 'products.productId': pid },
                { $inc: { 'products.$.quantity': quantity } },
                { new: true } 
            )
        // Si el producto no existe en el carrito, lo agrega
            if (!existingProduct) {
                const updatedCart = await cartsModel.findByIdAndUpdate(
                    cid,
                    { $push: { products: { productId: pid, quantity } } })
                return updatedCart
            }
            return existingProduct
        } catch (err) {
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
            return await cartsModel.findOneAndUpdate(
                cid,
                { $pull: { 'products': { productId: pid } } },
                { new: true }
                )
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
            await user.save()            
        } catch (err) {
            return err
        }
    }

    async calculateTotalPrice (cartId) {
        try {
            const cart = await cartsModel.findById(cartId).populate('products.productId')
            if (!cart) {
                throw new Error('Cart not found')
            } 
        
            let totalPrice = 0
        
            for (const item of cart.products) {
                    if (item.quantity <= item.productId.stock) {
                        totalPrice += item.productId.price * item.quantity
                    }
            }
        
            cart.totalPrice = totalPrice
            await cart.save()
            return cart.totalPrice
        } catch (err) {
            return err
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