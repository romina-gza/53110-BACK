// antiguo manager de carts
import fs from 'fs'

import { cartsModel } from './model/carts.model.js'
import { productsModel } from './model/products.model.js'
/* cada objeto representa un producto en el array de products */
export class CartsFsDAO {
    constructor(  ){
        /* this.path = file */
    }
// ---> POR QUE TENIA PRODUCTS ?
    async createCart(products) {
        try {
            //let listCarts = await this.getCarts()

            // id autogenerado
            /* let id = 1
            let lengthListCarts = listCarts.length    
            if (lengthListCarts > 0 ) id = listCarts[lengthListCarts - 1].id + 1 */
            //array de productos

           // let saveProduct = { id, product: [ /* ...product */ ] }
            //listCarts.push(saveProduct) 

            //guardar producto
            // await fs.promises.writeFile(this.path,JSON.stringify(listCarts, null, 4))
            return await cartsModel.create(products)
        } catch (err) {
            return err
        }
    }
    
    async getCarts () {
        try {
            /* let data = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(data) */
            return await cartsModel.find().populate(
                "products.productId"
            )
        } catch (err) {
            //return []
            return err
        }
    }

    async getcartsById(id) {
        try {
            const cart = await cartsModel.findOne({ _id: id }).lean().select('products').populate('products.productId');
            return cart.products;
        } catch (err) {
            return err;
        }
    }
    

    async addToCart(cid, pid, quantity) {
        try {
            //let filterIDCart = await this.getcartsById(cid)
            // buscar por indice
            /* let listCarts = await this.getCarts()
            let indexId = listCarts.findById(obj => obj.id == cid.id)
            console.log('index id cartManagr ', indexId)
            //actualizar
            listCarts[indexId].product = pid
            await fs.promises.writeFile(this.path,JSON.stringify(listCarts, null, 4)) */
            

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

            /* const updatedCart = await cartsModel.findByIdAndUpdate(cid, {
                $push: { products: { productId: pid , quantity} }
            })
            return updatedCart */
        } catch (err) {
            return err
        }
    } 

    async updateACart(cid, newProducts) {
        try {
            return await cartsModel.updateOne(
                { _id: cid },
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
                { _id: cid },
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
                { _id: cid },
                { $set: { products: [] } }, 
                { new: true}
            )
        } catch (err) {
            return err
        }
    }
}


