import { Router } from "express"
import ProductsController from "../controller/products.controller.js"
import __dirname from "../utils.js"


export const router = Router()

router.get('/', ProductsController.getAllProducts)

router.get('/:pid', ProductsController.getProductsId)

// POST
router.post('/', ProductsController.createProducts)
// PUT actualizar los campos
router.put('/:pid', ProductsController.updateProductById)

//DELETE - eliminar producto
router.delete('/:pid', ProductsController.deleteProductById)