import { Router } from "express"
import path from "path"

import __dirname from "../utils.js"
import ProductManager from "../dao/productManager.js"


export const router = Router()

let pathFile = path.join(__dirname, ".", "data", "products.json")

const listProducts = new ProductManager()

router.get('/', async (req, res) => {
    let { skip, limit } = req.query
    let products = await listProducts.getProducts()    
    
    if ( skip > 0 ) products = products.slice(skip)
    
    if ( limit > 0 ) products = products.slice(0,limit)

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json( products ) 
})

router.get('/:pid', async (req, res) => {
    let pid = Number(req.params.pid)
    if (isNaN(pid)) {
        return res.status(400).json({"message": "El id debe ser un número"})
    }
    let products = await listProducts.getProducts()
    
    let findProducts = products.find(obj => obj.id == pid)

    if ( findProducts ) {
        console.log(products)
        products = findProducts
    } else {
        console.log(products, '...' , findProducts)
        products = `no existe id: ${pid}.`

        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json( products )
    }    

//    console.log( typeof pid , pid, typeof products)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json( products )
})

// POST
router.post('/', async (req, res) => {
    let { title, description, thumbnails, price, stock, code, status, category } = req.body
    // no logro hacer que funcione status.trim() para que no tome "status": ""
    status = status !==  undefined || '' ? status : true
    // no repetir code
    let list = await listProducts.getProducts()

    let codeRepeat = list.find(c => c.code == code)

    if (codeRepeat) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json( { "message" : "El codido ya existe. Intenta otro codigo." } )
    }    
     // campos obligatorios 
    if ( !title || !description || !thumbnails || !price || !stock || !code || !category ) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json( { "message": 'todos los campos con "*" deben ser completados.' } )
    }  
    await listProducts.addProducts( title, description, thumbnails, price, stock, code, status, category )  
    
    res.setHeader('Content-Type', 'application/json')
    res.status(201).json( { title, description, thumbnails, price, stock, code, status, category } )
})
// PUT actualizar los campos
router.put('/:pid', async (req, res) => {
    /* let pid = Number(req.params.pid)
    
    if (isNaN(pid)) {
        return res.status(400).json({"message": "El id debe ser un número"})
    } */
    try {    
        const { pid } = req.params
        await listProducts.updateProducts(pid, req.body)
        
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json( { "message": "solcitud exitosa!" } )
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        console.log('ERROR...-> ',err)
        res.status(404).json( { "message":" Hubo un error" } )
    
    }
})

//DELETE - eliminar producto
router.delete('/:pid', async (req,res) => {
    /* let pid = Number(req.params.pid)
    let list = await listProducts.getProducts()

    // verifica que sea numero
    if (isNaN(pid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({"message": "El id debe ser un número"})
    }
    
    // busca id si no existe devuelve mensaje
    let notFound= list.find(obj => obj.id === pid)
    if (!notFound) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({"message": "El id no existe"})

    }

    await list.deleteProducts(pid)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json( { "message": "solcitud exitosa!" } ) */
    try {
        return await listProducts.deleteProducts(pid)
    } catch (err) {
        return err
    }
}

// 

)