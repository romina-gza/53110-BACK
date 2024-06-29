import { productsModel } from "./model/products.model.js";
export class ProductsMongoDAO {
    /*    async addProducts (title, description, thumbnails, price, stock, code, status, category) {
        try {
            return await productsModel.create({ title, description, thumbnails, price, stock, code, status, category })
        } catch (err) {
            return err
        }
    } */
    async createProducts (newProduct) {
        try {
            return await productsModel.create(newProduct)
        } catch (err) {
            return err
        }
    }
    async getProducts () {
        try {
            return await productsModel.find().lean()
        } catch (err) {
            return err
        }
    }
    // To use the trick findOne(filter)
    async getProductsBy (filter) {
        try {
            return await productsModel.findOne(filter)
        } catch (err) {
            return err
        }
    }
    async updateProducts (id, newProducts) {
        try {
            /* return await productsModel.findByIdAndUpdate({_id: id}, {newProducts}, {new: true}) */
            return await productsModel.findByIdAndUpdate(id, newProducts, {new: true})
        } catch (err) {
            return err
        }
    }
    async deleteProducts (id) {
        try {
            // antes return productsModel.findByIdAndDelete({_id: id})
            return await productsModel.findByIdAndDelete(id)
        } catch (err) {
            return err
        }
    }
    async getLastProductCode() {
        const lastProduct = await productsModel.findOne({}).sort({ code: -1 }).exec();
        return lastProduct ? lastProduct.code : 0;
    }
}