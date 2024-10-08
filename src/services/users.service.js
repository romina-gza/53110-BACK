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
    async getUserEmail (email) {
        try {
            return await this.UserService.getBy({ email })
        } catch (err) {
            return err
        }
    }
    async getUserId (id) {
        try {
            return await this.UserService.getBy({ _id: id })
        } catch (err) {
            return err
        }
    }

    async getUserByCid (cid) {
        try {
            return await this.UserService.getByCid({ cart: cid })
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

    async createCartForUser (userId) {
        try {
            return await this.UserService.createCartForUser(userId)
        } catch (error) {
            return error
        }
    }
    async getUserWithCart (userId) {
        try {
            return await this.UserService.getUserWithCart(userId)
        } catch (err) {
            return err
        }
    }

    async notActiveUsers(dateLimit) {
        try {
            return await this.UserService.notActiveUsers(dateLimit);
        } catch (err) {
            return err
        }
    }
    
    async updateLastConnection (cid) {
        try {
            return await this.UserService.updateLastConnection(cid)
        } catch (err) {
            return err
        }
    }

    async updateUserRole (cid, newRole) {
        try {
            return await this.UserService.updateUserRole(cid, newRole)
        } catch (err) {
            return err
        }
    }
    
    async deleteUserById (cid) {
        try {
            return await this.UserService.deleteUserById(cid)
        } catch (err) {
            return err
        }
    }

    async updateUserDocuments(uid, documents) {
        try {
            return await this.UserService.updateUserDocuments(uid, documents)
        } catch (err) {
            throw err;
        }
    }
    async updateTopremium (uid) {
        try {
        return await this.UserService.updateTopremium(uid)
    } catch (err) {
        return err
    }
    }
}
export const userService = new UserService( new DAO.UsersDAO )