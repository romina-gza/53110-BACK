// nota: revisar codigo mas tarde.
import { Router } from 'express'
import { UsersManager } from '../dao/usersManager.js'

const router = Router()
// Ruta para crear un carrito y asociarlo a un usuario
router.post('/:userId/cart', async (req, res) => {
    const { userId } = req.params;
    try {
        await UsersManager.createCartForUser(userId);
        res.status(201).send('Carrito creado y asociado al usuario');
    } catch (error) {
        res.status(500).send('Error al crear el carrito');
    }
})

// Ruta para obtener un usuario con su carrito
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await UsersManager.getUserWithCart(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Error al obtener el usuario con carrito');
    }
})