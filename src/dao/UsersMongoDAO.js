import { logger } from "../utils.js"
import { cartsModel } from "./model/carts.model.js"
import { usersModel } from "./model/users.model.js"

export class UsersMongoDAO {
    async getAll () {
        return await usersModel.find().lean()
    }

    async getBy (filter) {
        try {
            return await usersModel.findOne(filter).lean()            
        } catch (error) {
            return error
        }
    }

    async getByCid (filter) {
        try {
            let respons = await usersModel.findOne(filter)  
            return respons
        } catch (error) {
            return error
        }
    }

    async createUser (user) {
        let newUser = await usersModel.create(user)
        return newUser.toJSON()
    }

    async createCartForUser (userId) {
        try {
            // Crea un nuevo carrito
            const newCart = await cartsModel.create({ products: [], totalPrice: 0 });
            
            // Asocia el carrito al usuario
            await usersModel.findByIdAndUpdate(userId, { cart: newCart._id });
    
            return newCart;
        } catch (error) {
            return error;
        }
    }

    async getUserWithCart (cid) { 
        try {
            return await usersModel.findById(cid).populate('cart.products')            

        } catch (error) {
            return error
        }
    }

    async notActiveUsers(dateLimit) {
        try {
            const usersToDelete = await usersModel.find({ last_connection: { $lt: dateLimit } }).lean();
            await usersModel.deleteMany({ last_connection: { $lt: dateLimit } });
            return usersToDelete;
        } catch (err) {
            return err;
        }
    }
    
    async updateLastConnection(cid) {
        try {
            return await usersModel.findByIdAndUpdate(cid, { last_connection: new Date() });
        } catch (err) {
            return err 
        }        
    }

    async updateUserRole(cid, newRole) {
        try {
            return await usersModel.findByIdAndUpdate( {_id: cid}, { role: newRole }, { new: true }).lean()
        } catch (err) {
            return err
        }
    }
    
    async deleteUserById(cid) {
        try {
            const resultad = await usersModel.findByIdAndDelete(cid).lean();
            return resultad
        } catch (err) {
            logger.error(`Error al eliminar al usuario. Error: ${err}`);
            return err
        }
    }
    
    async updateUserDocuments(uid, documents) {
        try {
            const user = await usersModel.findById(uid);
            user.documents.push(...documents);
            return await user.save();
        } catch (err) {
            return err;
        }
        
    }
    async updateTopremium (uid) {
        try {
            const user = await usersModel.findById(uid)

            user.role = 'premium';
            await user.save();
            return user.role
        } catch (err) {
            return err
        }
    }

}
