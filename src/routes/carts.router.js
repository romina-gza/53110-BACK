import { Router } from "express"
import path from "path"
import __dirname from "../utils.js"

import CartsManager from "../dao/cartsManager.js"
import ProductManager from "../dao/productManager.js"

export const router = Router()
// carts instance
let route = path.join(__dirname,'.', 'data', 'carts.json')
let carts = new CartsManager(route)

//products instance
let pathFile = path.join(__dirname, ".", "data", "products.json")
const products = new ProductManager()

router.post('/', async ( req, res ) => {
    try {
        
        let newCart = await carts.createCart()
        console.log("newcart", newCart)
        res.setHeader('Content-Type','application/json')
        res.status(201).json( {payload: newCart} )
    } catch (err) {
        return err
    }
    
})

router.get('/:cid', async ( req, res ) => {
    let cid = Number(req.params.cid)

    if (isNaN(cid)) res.status(400).json({"message": "El id debe ser un número"})
    
    let data = await carts.getcartsById(cid)

    if (!data){
        res.setHeader('Content-Type','application/json')
        return res.status(400).json( { "message" : `El id: ${cid} no existe.`} )
    }
    res.setHeader('Content-Type','application/json')
    res.status(200).json( data )
    
})

|router.post('/:cid/product/:pid', async (req, res) => {
    let cid = Number(req.params.cid)
    let pid = Number(req.params.pid)
    
    // verifica que id sea numero
    if (isNaN(cid)) res.status(400).json({"message": "El id debe ser un número"})
    if (isNaN(pid)) res.status(400).json({"message": "El id debe ser un número"})
    
    // verifica que productID y cartId exista
    let productId = await products.getProductsById(pid)
    console.log('product id es: ',productId)
    if (!productId) res.status(400).json( {'message': `El id: ${pid} no existe.` } )

    let cartId = await carts.getcartsById(cid)
    console.log('cart id es: ',cartId)
    if (!cartId) res.status(400).json( {'message': `El id: ${cid} no existe.` } )
    
    // agrega al carrito??
    let addToCart = await carts.addToCart(cid, productId.id)
    console.log('add to cart:', addToCart)
    
    res.setHeader('Content-Type','application/json')
    res.status(200).json( addToCart )
}) 