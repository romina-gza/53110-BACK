import { productsServices } from "../services/products.service.js"
export default class ProductsController {

    static getAllProducts = async (req, res) => {
        try {
            let { skip, limit } = req.query
            let products = await productsServices.getAllProducts()
            if ( skip > 0 ) products = products.slice(skip)
            
            if ( limit > 0 ) products = products.slice(0,limit)
        
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json( products ) 
        } catch (err) {
            req.logger.fatal(`Error desde 'products', en 'getAllProducts'. El error: ${err}`)
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
            let products = await productsServices.getAllProducts()

            let findProducts = products.find(obj => obj.id == pid)
        
            if ( findProducts ) {
                products = findProducts
            } else {
                products = `no existe id: ${pid}.`        
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json( products )
            }    
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json( products )
        } catch (err) {
            req.logger.fatal(`Error desde 'products', en 'getProductsId'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json( { "message":" Hubo un error" } )
        }
    }
    // post
    static createProducts = async (req, res) => {
        let { title, description, thumbnails, price, stock, status, category} = req.body

        try {
            // Obtiene el último código y generauno nuevo
            let lastCode = await productsServices.getLastProductCode();
            let code = lastCode + 1;
            // campos obligatorios 
            if ( !title || !description || !thumbnails || !price || !stock || !category ) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json( { "message": 'todos los campos con "*" deben ser completados.' } )
            }              

            const newProduct = {
                title, 
                description, 
                thumbnails: [thumbnails], 
                price, stock, code, 
                status: status.trim() !== undefined ? status : true, 
                category
            }

            let createdProduct = await productsServices.createProducts(newProduct)
            
            // Emite evento de webSocket con el nuevo producto
            req.io.emit('nuevoProducto', createdProduct);

            res.setHeader('Content-Type', 'application/json')
            res.status(201).json( newProduct )
        } catch (err) {
            req.logger.fatal(`Error desde 'products', en 'createProducts'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json( { "message":" Hubo un error" } )
        }
    } 

    static updateProductById = async (req, res) => {
        try {
            const { pid } = req.params
            await productsServices.updateProducts(pid, req.body)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json( { "message": "solcitud exitosa!" } )
        } catch (err) {
            req.logger.fatal(`Error desde 'products', en 'updateProductById'. El error: ${err}`)
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

            return await productsServices.deleteProductById(pid)
        } catch (err) {
            req.logger.fatal(`Error desde 'products', en 'deleteProductById'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json( { "message":" Hubo un error" } )
        }
    }
}