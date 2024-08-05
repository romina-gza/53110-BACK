import { productsModel } from "./model/products.model.js";
import { usersModel } from "./model/users.model.js";
export class ProductsMongoDAO {
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
    
    async getProductsBy (filter) {
        try {
            return await productsModel.findOne(filter)
        } catch (err) {
            return err
        }
    }
    async updateProducts (id, newProducts) {
        try {
            return await productsModel.findByIdAndUpdate(id, newProducts, {new: true})
        } catch (err) {
            return err
        }
    }
    async deleteProducts (id) {
        try {
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