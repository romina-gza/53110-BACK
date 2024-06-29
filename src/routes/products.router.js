import { Router } from "express"
import ProductsController from "../controller/products.controller.js"
import path from "path"
import __dirname from "../utils.js"

export const router = Router()

// let pathFile = path.join(__dirname, ".", "data", "products.json")

router.get('/', ProductsController.getAllProducts)

router.get('/:pid', ProductsController.getProductsId)

// POST
router.post('/', ProductsController.createProducts)
// PUT actualizar los campos
router.put('/:pid', ProductsController.updateProductById)

//DELETE - eliminar producto
router.delete('/:pid', ProductsController.deleteProductById)