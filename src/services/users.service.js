//import { UsersMongoDAO as DAO} from "../dao/UsersMongoDAO.js"
import { DAO } from "../dao/factory.js"

class UserService {
    constructor (dao) {
        this.UserService = dao
    }
    async getAllUsers () {
        try {            
            return await this.UserService.getAll() 
        } catch (err) {
            return err
        }
    }
    // Using the "getBy" function
    async getUserEmail (email) {
        try {
            return await this.UserService.getBy({ email })
        } catch (err) {
            return err
        }
    }
    // Using the "getBy" function
    async getUserId (id) {
        try {
            return await this.UserService.getBy({ _id: id })
        } catch (err) {
            return err
        }
    }
    async createUser (user) {
        try {
            return await this.UserService.createUser(user)
        } catch (err) {
            return err
        }
    }
    async getUserWithCart (userId) {
        try {
            return await this.UserService.getUserWithCart(userId)
        } catch (err) {
            return err
        }
    }
}
export const userService = new UserService( new DAO.UsersDAO )