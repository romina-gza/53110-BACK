import { Router } from 'express'
import UsersController from '../controller/users.controller.js'

const router = Router()

// Ruta para devolver todos los usuarios
router.get('/', UsersController.getAllUsers)

// Ruta para limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días
router.delete('/', UsersController.notActiveUsers)

// Ruta para crear un carrito y asociarlo a un usuario
router.post('/:userId/cart', UsersController.getUser)

// Ruta para obtener un usuario con su carrito
router.get('/:userId', UsersController.getUserWithCart)
