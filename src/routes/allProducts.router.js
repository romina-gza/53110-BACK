import { Router } from "express";
import path from "path"


import __dirname from "../utils.js"
import ProductManager from "../dao/productManager.js"
import { productsModel } from "../dao/model/products.model.js";

export const router = Router()
let pathFile = path.join(__dirname, ".", "data", "products.json")
const list = new ProductManager(pathFile)


router.get('/', async (req,res)=> {
    try {
        let { limit, page, category, sort } = req.query
        // precio ascendente o descendente
        if ( sort === "a" ) {
            sort = { price: -1 }
        } else if ( sort === "d" ) {
            sort = { price: 1 }
        } else {
            sort = { }
        }
    
    if ( !category ) {
    category = { }
    } else {
        // Consulta si la categoría existe en MongoDB
        const existingCategory = await productsModel.distinct('category', { category });
        // Verifica si la categoría existe
        if ( !existingCategory || existingCategory.length === 0 ) {
            return res.status(404).send(`La categoría '${category}' no existe`);
        } 
        category = {category}
    }
    
        let { 
            docs: products,
            prevPage, nextPage, 
            hasPrevPage, hasNextPage, 
            totalPages  
        } = await productsModel.paginate( category , {limit: limit ?? 10, page: page ?? 1, sort: sort , lean: true})
        
        res.setHeader("Content-Type", "text/html")
        res.status(200).render('home', {
                products, 
                prevPage, nextPage, 
                hasPrevPage, hasNextPage, 
                totalPages
            })
    } catch (err) {
        console.log(err)
        return err
    }
})
