import { Router } from "express"
import path from "path"
import __dirname from "../utils.js"

import CartsManager from "../dao/cartsManager.js"
import ProductManager from "../dao/productManager.js"

export const router = Router()
// carts instance
let route = path.join(__dirname,'.', 'data', 'carts.json')
let carts = new CartsManager()

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
        res.setHeader('Content-Type','application/json')
        res.status(500).json({ message: 'Error interno del servidor' })
    }
})
// listar productos de cid
router.get('/:cid', async ( req, res ) => {
    try {
         //let cid = Number(req.params.cid)
    let cid = req.params.cid
    // if (isNaN(cid)) res.status(400).json({"message": "El id debe ser un número"})
    
    let data = await carts.getcartsById(cid)

    if (!data){
        res.setHeader('Content-Type','application/json')
        return res.status(400).json( { "message" : `El id: ${cid} no existe.`} )
    }
        res.setHeader('Content-Type','application/json')
        res.status(200).json( data )
    } catch (err) {
        res.setHeader('Content-Type','application/json')
        res.status(500).json({ message: 'Error interno del servidor'})
    }
})
// agrega al cid el pid y la cantidad 
// problemas cuando no encuentra el pid, no detiene el algoritmo.
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.query
        console.log("quantity params: ", quantity)
        // Verificar si el producto existe en la base de datos
        const product = await products.getProductsById(pid)
        console.log('product: ', product)
        if (!product) {
            res.setHeader('Content-Type','application/json')
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        // Verificar si el carrito existe
        const cart = await carts.getcartsById(cid)
        if (!cart) {
            res.setHeader('Content-Type','application/json')
            return res.status(404).json({ message: 'Carrito no encontrado' })
        }
        // Agregar el producto al carrito
        await carts.addToCart(cid, pid, quantity)
        res.setHeader('Content-Type','application/json')
        res.status(201).json({ message: 'Producto agregado al carrito:', cid })
    } catch (err) {
        console.error('Error al agregar producto al carrito:', err)
        res.setHeader('Content-Type','application/json')
        res.status(500).json({ message: 'Error interno del servidor' })
    } 
}) 
// elimina del carrito el pid seleccionado ❌
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        let { cid, pid } = req.params
        await carts.deleteProduct(cid, pid)
        res.setHeader('Content-Type','application/json')
        res.status(201).json({ message: 'Producto eliminado del carrito:', cid })
    } catch (err) {
        res.setHeader('Content-Type','application/json')
        res.status(500).json({ message: 'Error interno del servidor' })
    }
})
// PUT - no entiendo- 2°EDOF 46p,ppt.
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const newProducts = req.body
        await carts.updateACart(cid, newProducts)

        res.setHeader('Content-Type','application/json')
        res.status(201).json({ message: 'Carrito actualizado:', cid })
    } catch (err) {
        console.error('Error al actualizar productos al carrito:', err)
        res.setHeader('Content-Type','application/json')
        res.status(500).json({ message: 'Error interno del servidor' })
    }
})
// Put - actualizar solo la cantidad por req.body
router.put('/:cid/product/:pid', async (req, res) => { 
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        await carts.updateQuantity( cid, pid, quantity )

        res.setHeader('Content-Type','application/json')
        res.status(201).json({ message: 'Productos actualizado del carrito:', cid })
    } catch (err) {
        res.setHeader('Content-Type','application/json')
        res.status(500).json({ message: 'Error interno del servidor' })
    }
})
// Delete - eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        await carts.deleteAllProducts(cid)
        res.setHeader('Content-Type','application/json')
        res.status(201).json({ message: 'Productos eliminados del carrito:', cid })
    } catch (err) {
        res.setHeader('Content-Type','application/json')
        res.status(500).json({ message: 'Error interno del servidor' })
    }
})