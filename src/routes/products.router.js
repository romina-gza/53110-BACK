import { Router } from "express"
import ProductsController from "../controller/products.controller.js"
import path from "path"
import __dirname from "../utils.js"
import { accessMiddleware } from "../middleware/access.js"


export const router = Router()

// let pathFile = path.join(__dirname, ".", "data", "products.json")

router.get('/', ProductsController.getAllProducts)

router.get('/:pid', ProductsController.getProductsId)

// POST
router.post('/', accessMiddleware(['admin']), ProductsController.createProducts)
// PUT actualizar los campos
router.put('/:pid', accessMiddleware(['admin']), ProductsController.updateProductById)

//DELETE - eliminar producto
router.delete('/:pid', accessMiddleware(['admin']), ProductsController.deleteProductById)