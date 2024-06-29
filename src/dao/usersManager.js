// antiguo manager
import { usersModel } from "./model/users.model.js"
import { cartsModel } from "./model/carts.model.js"

export class UsersManager {
    constructor () { }
    async createUser(user) {
        let newUser = await usersModel.create(user)
        return newUser.toJSON()
    }
    async getBy(filter) {
        return await usersModel.findOne(filter).lean()
    }

    // Función para crear un carrito y asociarlo a un usuario
    async createCartForUser(userId) {
        try {
            const cart = new cartsModel({
                products: [], 
                totalPrice: 0
            })
            await cart.save()
            const user = await usersModel.findById(userId)
            user.cart = cart._id
            await user.save()
            console.log('Carrito creado y asociado al usuario:', user);
        } catch (err) {
            console.error('Error al crear el carrito para el usuario:', err);
        }
    }

    // Función para obtener un usuario con su carrito
    async getUserWithCart(userId) {
        try {
            const user = await usersModel.findById(userId).populate('cart');
            console.log('Usuario con carrito:', user);
            return user
        } catch (err) {
            console.error('Error al obtener el usuario con carrito:', err)
        }
    } 

}