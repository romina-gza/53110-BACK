import { DAO } from "../dao/factory.js"

class CartsServices {
    constructor (dao) {
        this.CartsServices = dao 
    }
    async createCart () {
        try {
            return await this.CartsServices.createCart()            
        } catch (err) {
            return err
        }
    }
    async getCarts () {
        try {
            return await this.CartsServices.getCarts()
        } catch (err) {
            return err
        }
    } 
    async getCartsById (id) {
        try {
            const cart = await this.CartsServices.getCartsById({ _id: id })
            return cart
        } catch (err) {
            return err
        }
    }
    async addToCart (cid, pid, quantity) {
        try {
            return await this.CartsServices.addToCart(cid, pid, quantity)
        } catch (err) {
            return err
        }
    }
    async updateACart (cid, newProducts) {
        try {
            return await this.CartsServices.updateACart({ _id: cid }, newProducts)
        } catch (err) {
            return err
        }
    }
    async updateQuantity (cid, pid, quantity) {
        try {
            return await this.CartsServices.updateQuantity(cid, pid, quantity)
        } catch (err) {
            return err
        }
    }
    async deleteProduct (cid, pid) {
        try {
            return await this.CartsServices.deleteProduct(cid, pid )
        } catch (err) {
            return err
        }
    }
    async deleteAllProducts (cid) {
        try {
            return await this.CartsServices.deleteAllProducts({ _id: cid })
        } catch (err) {
            return err
        }
    }
    async createCartForUser (userId) {
        try {
            return await this.CartsServices.createCartForUser(userId)
        } catch (err) {
            return err
        }
    }

    async calculateTotalPrice (cid) {
        try {
            return await this.CartsServices.calculateTotalPrice( cid )
        } catch (err) {
            return err
        }
    }

    async processPurchase ( cid, totalAmount, purcharser ) {
        try {
            return await this.CartsServices.processPurchase( cid, totalAmount, purcharser )
        } catch (err) {
            return err
        }
    }
}
export const cartsServices = new CartsServices( new DAO.CartsDAO )