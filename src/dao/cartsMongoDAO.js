import { cartsModel } from "./model/carts.model.js"
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
            return cart.products;
        } catch (err) {
            return err
        }
    }
    async addToCart (cid, pid, quantity) {
        try {
        // Verificar si el producto ya existe en el carrito
            const existingProduct = await cartsModel.findOneAndUpdate(
                { _id: cid, 'products.productId': pid }, // Filtro: busca el carrito con el id y el producto con el productId
                { $inc: { 'products.$.quantity': quantity } }, // Incrementa la cantidad del producto existente
                { new: true } // Devuelve el carrito actualizado
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
        const cart = new cartsModel({
            products: [], 
            totalPrice: 0
        })
        await cart.save()
        const user = await usersModel.findById(userId)
        user.cart = cart._id
        await user.save()
    }
}