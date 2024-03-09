import { Router } from "express";
import path from "path"

import __dirname from "../utils.js"
import ProductManager from "../manager/productManager.js"

let pathFile = path.join(__dirname, ".", "data", "products.json")
const list = new ProductManager(pathFile)

export const router = Router()

router.get('/', async (req, res)=> {
    let products = await list.getProducts()
    res.status(200).render('realTimeProducts', { products })
})

router.post('/', async (req, res)=> {
    let data = req.body
    console.log('data de post es : ', data)
    let products = await list.addProducts(data)
    console.log('products ', products)

    req.io.emit('nuevoProducto', products)
    res.status(201).render('realTimeProducts', { products })
    
})