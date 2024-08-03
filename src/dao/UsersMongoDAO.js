// nuevo manager
import { usersModel } from "./model/users.model.js"

export class UsersMongoDAO {
    async getAll () {
        return await usersModel.find().lean()
    }

    async getBy (filter) {
        return await usersModel.findOne(filter).lean()
    }

    async createUser (user) {
        let newUser = await usersModel.create(user)
        return newUser.toJSON()
    }

    async getUserWithCart (cid) { 
        return await usersModel.findById(cid).populate('cart')
    }

    async notActiveUsers(dateLimit) {
        try {
            console.log('Date limit:', dateLimit);
            const usersToDelete = await usersModel.find({ last_connection: { $lt: dateLimit } }).lean();
            console.log('users to delete:', usersToDelete)
            const result = await usersModel.deleteMany({ last_connection: { $lt: dateLimit } });
            console.log('Users deleted:', result.deletedCount);
            return usersToDelete;
        } catch (err) {
            console.error('Error deleting inactive users:', err);
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
            console.error('Error al actualizar el rol del usario. Error:', err);
            return err
        }
    }
    
    async deleteUserById(cid) {
        try {
            const resultad = await usersModel.findByIdAndDelete(cid).lean();
            console.log('resultad es:', resultad)
            return resultad
        } catch (err) {
            console.error('Error al eliminar al usuario. Error:', err);
            return err
        }
    }
    
    async updateUserDocuments(uid, documents) {
        try {
            const user = await usersModel.findById(uid);
            //if (!user) throw new Error('Usuario no encontrado');
            user.documents.push(...documents);
            return await user.save();
        } catch (err) {
            return err;
        }
    }
}