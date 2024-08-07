import { DAO } from "../dao/factory.js"

class ProductsServices {
    constructor (dao) {
        this.ProductsServices = dao
    }
    async createProducts (newProduct) {
        try {
            // Nota: newProduct debe ser una variable == {title, description, thumbnails, price, stock, code, status, category} cuando se use.
            return await this.ProductsServices.createProducts(newProduct)
        } catch (err) {
            return err
        }
    }
    async getAllProducts () {
        try {
            return await this.ProductsServices.getProducts()
        } catch (err) {
            return err
        }
    }
    async getProductsByCategory (category) {
        try {
            return await this.ProductsServices.getProductsBy({category})
        } catch (err) {
            return err
        }
    }
    async getProductsById (id) {
        try {
            return await this.ProductsServices.getProductsBy({_id: id})
        } catch (err) {
            return err
        }
    }
    async updateProducts (id, newProducts) {
        try {
           // return await this.ProductsServices.updateProducts({_id: id}, {newProducts})
            return await this.ProductsServices.updateProducts(id, newProducts)
        
        } catch (err) {
            return err
        }
    }
    async deleteProductById (id) {
        try {
            return await this.ProductsServices.deleteProducts({_id: id})
        } catch (err) {
            return err
        }
    }
    async getLastProductCode() {
        try {
            return await this.ProductsServices.getLastProductCode()
        } catch (err) {
            return err
        }
    }

}

export const productsServices = new ProductsServices( new DAO.ProductsDAO )