import { Router } from "express"
import CartsController from "../controller/carts.controller.js"

export const router = Router()

router.post('/', CartsController.createCart)
// listar productos de cid
router.get('/:cid', CartsController.getCartById)
// agrega al cid el pid y la cantidad 
router.post('/:cid/product/:pid',CartsController.addToCart) 
// elimina del carrito el pid seleccionado ❌
router.delete('/:cid/products/:pid', CartsController.deleteProduct)
// PUT actualiza carrito usar array en body.
router.put('/:cid', CartsController.updateACart)
// Put - actualizar solo la cantidad por req.body
router.put('/:cid/product/:pid', CartsController.updateQuantity)
// Delete - eliminar todos los productos del carrito
router.delete('/:cid', CartsController.deleteAllProducts)

router.post('/:cid/purchase', CartsController.processPurchase)
