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

    async getUserWithCart (userId) { 
        return await usersModel.findById(userId).populate('cart')
    }
    async notActiveUsers () {
        return await usersModel.deleteMany({ last_connection: { $lt: dateLimit } })
    }
}