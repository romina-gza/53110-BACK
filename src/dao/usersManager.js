import { usersModel } from "./model/users.model.js"

export class UsersManager {
    constructor () { }
    async createUser(user) {
        let newUser = await usersModel.create(user)
        return newUser.toJSON()
    }
    async getBy(filter) {
        return await usersModel.findOne(filter).lean()
    }
}