import { Router } from 'express'
import UsersController from '../controller/users.controller.js'
import { accessMiddleware } from '../middleware/access.js'
import { upload } from '../utils.js'
import { auth } from '../middleware/auth.js'


export const router = Router()

// Ruta para devolver todos los usuarios
router.get('/', UsersController.getAllUsers)

// Ruta para limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días
router.delete('/delete', UsersController.notActiveUsers)

// Ruta para crear un carrito y asociarlo a un usuario
router.post('/:userId/cart', UsersController.getUser)

// Ruta para obtener un usuario con su carrito
router.get('/:userId', UsersController.getUserWithCart)

// Ruta para actualizar role de usuario
router.put('/:cid', UsersController.updateUserRole)

// Ruta para eliminar usuario 
router.delete('/:cid', UsersController.deleteUserById)

// multer + premium
router.put('/premium/:uid', UsersController.updateUserRoleToPremium);

// premium + multer
router.post('/:uid/documents', upload.array('documents'), UsersController.uploadDocuments)