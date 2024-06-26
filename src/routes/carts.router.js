import { Router } from "express"
import CartsController from "../controller/carts.controller.js"
import cartIdMiddleware from "../middleware/cart.js"

export const router = Router()

router.use(cartIdMiddleware)
router.post('/', CartsController.createCart)
// listar productos de cid
router.get('/:cid', CartsController.getCartById)
// agrega al cid el pid y la cantidad 
// problemas cuando no encuentra el pid, no detiene el algoritmo.
router.post('/:cid/product/:pid', CartsController.addToCart) 
// elimina del carrito el pid seleccionado ❌
router.delete('/:cid/products/:pid', CartsController.deleteProduct)
// PUT 
router.put('/:cid', CartsController.updateACart)
// Put - actualizar solo la cantidad por req.body
router.put('/:cid/product/:pid', CartsController.updateQuantity)
// Delete - eliminar todos los productos del carrito
router.delete('/:cid', CartsController.deleteAllProducts)