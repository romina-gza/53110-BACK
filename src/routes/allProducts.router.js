import { Router } from "express";
import path from "path"


import __dirname from "../utils.js"
import ProductManager from "../dao/productManager.js"


export const router = Router()
let pathFile = path.join(__dirname, ".", "data", "products.json")
const list = new ProductManager(pathFile)


router.get('/', async (req,res)=> {
    /* res.setHeader('Content-Type', 'text/plain')
    res.status(200).send('<h1>Hello world</h1>') */
    let product = await list.getProducts()
    res.status(200).render('home', {product})
})
