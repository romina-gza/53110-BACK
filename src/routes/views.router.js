import { Router } from "express";
import { router as allProducts } from './allProducts.router.js'

import __dirname from "../utils.js"
import ProductManager from "../dao/productManager.js"
import path from "path"
let pathFile = path.join(__dirname, ".", "data", "products.json")
const list = new ProductManager(pathFile)

export const router = Router()

router.get('/', allProducts)

router.get("/realtimeproducts", async (req, res) => {
    let productos = await list.getProducts()
    res.status(200).render("realTimeProducts", { productos })
})

router.get('/chat', (req, res)=>{
    res.status(200).render( "chat")
})

router.post("/realtimeproducts", async (req, res) => {
    console.log('es req.body: ',req.body)
    let { title, description } = req.body
    console.log('es req.body TITLE DESC: ', title, description)
    let productos = await list.getProducts()
    // req.io.emit('nuevoProducto', req.body) 
    
    /* res.status(200).redirect("realTimeProducts", {  }) */
})