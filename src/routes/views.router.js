import { Router } from "express";
import { productsModel } from "../dao/model/products.model.js";
import __dirname from "../utils.js"
import ProductManager from "../dao/productManager.js"
import path from "path"
let pathFile = path.join(__dirname, ".", "data", "products.json")
const list = new ProductManager(pathFile)

export const router = Router()

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
    } = await productsModel.paginate( category , {limit: limit ?? 3, page: page ?? 1, sort: sort , lean: true})
    console.log("hasnextpage ", hasNextPage)
        console.log("hasprevPage", hasPrevPage)
        res.setHeader("Content-Type", "text/html")
        res.status(200).render('home', {
            status: "success",
            payload: products,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage ? `http://localhost:8080/?page=${prevPage}` : null ,
            nextLink: hasNextPage ? `http://localhost:8080/?page=${nextPage}` : null
            })
    } catch (err) {
        console.log(err)
        return err
    }
})


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