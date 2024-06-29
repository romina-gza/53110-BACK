import { Router } from 'express'
import UsersController from '../controller/users.controller.js'

const router = Router()
// Ruta para crear un carrito y asociarlo a un usuario
router.post('/:userId/cart', UsersController.getUser)

// Ruta para obtener un usuario con su carrito
router.get('/:userId', UsersController.getUserWithCart)