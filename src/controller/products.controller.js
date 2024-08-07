import { productsServices } from "../services/products.service.js"
export default class ProductsController {

    static getAllProducts = async (req, res) => {
        try {
            let { skip, limit } = req.query
            let products = await productsServices.getAllProducts()
            
            if (!products) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({"message": `Ups! Hubo un error al obtener los productos.`})
            }

            if ( products.length  === 0 ) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(200).json({"message": "Aún no hay productos aquí."})
            }

            if ( skip > 0 ) products = products.slice(skip)
            
            if ( limit > 0 ) products = products.slice(0,limit)
        
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json( {"message": products} ) 
        } catch (err) {
            req.logger.fatal(`Error desde 'products', en 'getAllProducts'. El error: ${err}`)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json( { "message":" Hubo un error" } )        
        }
    }

    static getProductsId = async (req, res) => {
        try {
            let pid = req.params.pid
            if (!pid) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({"message": "Ingresa un ID"})
            }
            let products = await productsServices.getAllProducts()
            let findProducts = products.find(obj => obj._id == pid)
            if ( findProducts ) {
                products = findProducts
            } else {
                products = `no existe id: ${pid}.`        
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json( products )
            }    
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json( {message: products} )
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
                status: status !== undefined || !status ? status : true, 
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
            //const updateData = req.body;
            //let res = await productsServices.updateProducts(pid, req.body)
            
            const allowedFields = ['title', 'description', 'price', 'stock', 'category', 'thumbnails', 'status', 'code'];
        const requestFields = Object.keys(req.body);

        // Verificar si hay campos no permitidos en la solicitud
        const invalidFields = requestFields.filter(key => !allowedFields.includes(key));

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: "Solicitud contiene campos no permitidos",
                invalidFields
            });
        }
            let resp = await productsServices.updateProducts(pid, req.body)
            
            console.log('PIDDD', pid)
console.log('RESSS', resp)
            //res.setHeader('Content-Type', 'application/json')
            res.status(200).json( { message: `solcitud exitosa! Nuevo producto: ${resp}` } )
        } catch (err) {
            req.logger.fatal(`Error desde 'products', en 'updateProductById'. El error: ${err}`)
            //res.setHeader('Content-Type', 'application/json')
            res.status(500).json( { message: `Hubo un error: ${err}` } )
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