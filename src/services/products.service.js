//import { ProductsMongoDAO as ProductsDAO } from "../dao/ProductsMongoDAO.js"
import { DAO } from "../dao/factory.js"

class ProductsServices {
    constructor (dao) {
        this.ProductsServices = dao
    }
    async createProducts (newProduct) {
        try {
            // newProduct debe ser una variable == {title, description, thumbnails, price, stock, code, status, category} cuando se use.
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
    // NOTA- REVISAR- PROBLEMA - puede ser {newProducts} o newProducts 
    async updateProducts (id, newProducts) {
        try {
            return await this.ProductsServices.updateProducts({_id: id}, {newProducts})
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
//export const productsServices = new ProductsServices(new ProductsDAO)

export const productsServices = new ProductsServices( new DAO.ProductsDAO )