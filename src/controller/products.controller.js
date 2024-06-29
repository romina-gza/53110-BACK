import { productsServices } from "../services/products.service.js"
export default class ProductsController {

    static getAllProducts = async (req, res) => {
        try {
            let { skip, limit } = req.query
            //let products = await listProducts.getProducts()    
            let products = await productsServices.getAllProducts()
            if ( skip > 0 ) products = products.slice(skip)
            
            if ( limit > 0 ) products = products.slice(0,limit)
        
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json( products ) 
        } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json( { "message":" Hubo un error" } )        
        }
    }

    static getProductsId = async (req, res) => {
        try {
            let pid = Number(req.params.pid)
            if (isNaN(pid)) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({"message": "El id debe ser un número"})
            }
            //let products = await listProducts.getProducts()
            let products = await productsServices.getAllProducts()

            let findProducts = products.find(obj => obj.id == pid)
        
            if ( findProducts ) {
                console.log('TODOS LOS PRODUCTOS: ',products)
                products = findProducts
            } else {
                products = `no existe id: ${pid}.`        
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json( products )
            }    
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json( products )
        } catch (err) {
                res.setHeader('Content-Type', 'application/json')
                res.status(500).json( { "message":" Hubo un error" } )
        }
    }
    // post
    // problema con status? REVISAR - NOTA
    static createProducts = async (req, res) => {
        try {
            let { title, description, thumbnails, price, stock, status, category } = req.body
            // no logro hacer que funcione status.trim() para que no tome "status": ""
                //status = status !==  undefined || '' ? status : true
            
            // Obtien el último código y generauno nuevo
            let lastCode = await productsServices.getLastProductCode();
            let code = lastCode + 1;
            // campos obligatorios 
            if ( !title || !description || !thumbnails || !price || !stock || !category ) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json( { "message": 'todos los campos con "*" deben ser completados.' } )
            }  
 /*            if (!thumbnails || thumbnails.trim() === '') {
                thumbnails = ["https://craftypixels.com/placeholder-image/250x200/7030f0/2d1b52&text=250x200"];
            } else {
                thumbnails = [thumbnails];
            } */
            const newProduct = {
                title, 
                description, 
                thumbnails: [thumbnails], 
                price, stock, code, 
                status: status.trim() !== undefined ? status : true, 
                category 
            }
            let createdProduct = await productsServices.createProducts(newProduct)
            // Emitir evento de WebSocket con el nuevo producto
            req.io.emit('nuevoProducto', createdProduct);
            res.setHeader('Content-Type', 'application/json')
            res.status(201).json( newProduct )
        } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json( { "message":" Hubo un error" } )
        }
    } 

    static updateProductById = async (req, res) => {
        /* let pid = Number(req.params.pid)    
        if (isNaN(pid)) {
            return res.status(400).json({"message": "El id debe ser un número"})
        } */
        try {
            const { pid } = req.params
            //await listProducts.updateProducts(pid, req.body)
            await productsServices.updateProducts(pid, req.body)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json( { "message": "solcitud exitosa!" } )
        } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json( { "message":" Hubo un error" } )
        }
    }
    static deleteProductById = async (req, res) => {
        try {
            let pid = Number(req.params.pid)
            // verifica que sea numero
            if (isNaN(pid)) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({"message": "El id debe ser un número"})
            }
            /* 
            // cuando listProducts era el manager
            let list = await listProducts.getProducts()
            // busca id si no existe devuelve mensaje
            let notFound= list.find(obj => obj.id === pid)
            if (!notFound) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({"message": "El id no existe"})
            }
            await list.deleteProducts(pid)
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json( { "message": "solcitud exitosa!" } ) */
            //return await listProducts.deleteProducts(pid)
            return await productsServices.deleteProductById(pid)
        } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json( { "message":" Hubo un error" } )
        }
    }
}