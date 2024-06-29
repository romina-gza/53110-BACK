import { Router } from "express";
import { productsModel } from "../dao/model/products.model.js";
import __dirname from "../utils.js"
import ProductManager from "../dao/productManager.js"
import path from "path"

import CartsManager from "../dao/cartsManager.js";
import { auth } from "../middleware/auth.js";
import { productsServices } from "../services/products.service.js";
import ProductsController from "../controller/products.controller.js";
import cartIdMiddleware from "../middleware/cart.js";
import { cartsServices } from "../services/carts.service.js";

let pathFile = path.join(__dirname, ".", "data", "products.json")
const list = new ProductManager(pathFile)
const carts = new CartsManager() 
export const router = Router()

router.get('/', async (req,res)=> {
    try {
        let user = req.session.existUser
        //console.log("user d: ", user)
        let { limit, page, category, sortOption } = req.query
        let sort = { price: 1 }
        // Precio ascendente o descendente
        if (sortOption === "a") {
            sort = { price: 1 };
        } else if (sortOption === "d") {
            sort = { price: -1 };
        } else {
            sortOption = 'a'
        }

        let categoryQuery = {};
        if (category) {
            const existingCategory = await productsModel.distinct('category', { category })
            if (!existingCategory || existingCategory.length === 0) {
                return res.status(404).send(`La categoría '${category}' no existe`)
            }
            categoryQuery = { category }
        }

        let {
            docs: products,
            prevPage, nextPage,
            hasPrevPage, hasNextPage,
            totalPages
        } = await productsModel.paginate(categoryQuery, { limit: limit ?? 5, page: page ?? 1, sort: sort, lean: true })

        const queryParams = new URLSearchParams({ limit: limit ?? 5, sortOption })

        if (category) {
            queryParams.append('category', category)
        }


        res.setHeader("Content-Type", "text/html")
        res.status(200).render('home', {
            status: "success",
            payload: products,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page ?? 1,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage ? `http://localhost:8080?page=${nextPage}&${queryParams.toString()}` : null ,
            nextLink: hasNextPage ? `http://localhost:8080?page=${nextPage}&${queryParams.toString()}` : null,
            totalPages: `http://localhost:8080?page=${totalPages}&${queryParams.toString()}`
            })
    } catch (err) {
        res.setHeader('Content-Type','application/json')
        res.status(500).json({ message: 'Error interno del servidor'})
    }
})

router.get("/realtimeproducts", async (req, res) => {
    let product = await productsServices.getAllProducts() //await list.getProducts()
    res.status(200).render("realTimeProducts", {product} )
})

/* router.post("/realtimeproducts", async (req, res) => {
    console.log('es req.body: ',req.body)
    let { title, description, price, thumbnails, stock } = req.body
    let saveProduct = {
        title, description, price, thumbnails, stock
    }
    //  
    try {
//        await productsServices.createProducts(saveProduct)
        req.io.emit('nuevoProducto', saveProduct)
        //res.status(200).redirect('/realtimeproducts')
    } catch (error) {
        console.error('Error al crear producto:', error)
        res.status(500).send('Error al crear producto')
    }
})  
 */
router.post("/realtimeproducts", ProductsController.createProducts)  


router.get('/chat', (req, res)=>{
    res.status(200).render( "chat")
})

router.get("/products", auth, async (req, res) => {
    try {
        let user = req.session.existUser;
        //console.log("user d: ", user)
        let { limit, page, category, sortOption } = req.query;
        let sort = { price: 1 }
        // Precio ascendente o descendente
        if (sortOption === "a") {
            sort = { price: 1 };
        } else if (sortOption === "d") {
            sort = { price: -1 };
        } else {
            sortOption = 'a'
        }

        let categoryQuery = {};
        if (category) {
            const existingCategory = await productsModel.distinct('category', { category });
            if (!existingCategory || existingCategory.length === 0) {
                return res.status(404).send(`La categoría '${category}' no existe`);
            }
            categoryQuery = { category };
        }

        let {
            docs: products,
            prevPage, nextPage,
            hasPrevPage, hasNextPage,
            totalPages
        } = await productsModel.paginate(categoryQuery, { limit: limit ?? 5, page: page ?? 1, sort: sort, lean: true });

        const queryParams = new URLSearchParams({ limit: limit ?? 5, sortOption });

        if (category) {
            queryParams.append('category', category);
        }

        res.setHeader("Content-Type", "text/html");
        res.status(200).render('products', {
            user: user,
            status: "success",
            payload: products,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page ?? 1,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage ? `http://localhost:8080/products?page=${prevPage}&${queryParams.toString()}` : null,
            nextLink: hasNextPage ? `http://localhost:8080/products?page=${nextPage}&${queryParams.toString()}` : null,
            totalPages: `http://localhost:8080/products?page=${totalPages}&${queryParams.toString()}`
        })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ message: 'Error interno del servidor' });
    }
})

/* router.get("/products/product/:pid", async (req, res) => {
    try {
        let { pid } = req.params
        console.log('pid ', pid)
    } catch (err) {
        
    }
})
 */
/* router.get("/carts/:cid", async (req, res)=> {
    try {
        let {cid} = req.params

        let products = await carts.getcartsById(cid);
        console.log('products de carts 🫥🫥🫥 ', products)
        if (!products) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: `El id: ${cid} no existe.` });
        }
        res.setHeader("Content-Type", "text/html");
        res.status(200).render('cart', {products});
    } catch (err) {
        //res.setHeader("Content-Type", "text/html");
        res.status(500).json({ message: "Error interno del servidor" })
    }
}) */
    router.get("/carts/:cid", async (req, res) => {
        try {
            let { cid } = req.params;
            //let products = await cartsDao.getCartsById(cid);
            let products = await cartsServices.getCartsById(cid) 
            if (!products) {
                res.setHeader("Content-Type", "application/json");
                return res.status(400).json({ message: `El id: ${cid} no existe.` });
            }
            const userCartId = req.session.existUser.cart
            //const userCartId = req.cartId.toString();
            console.log('user cartid toString - views:', userCartId)
            res.setHeader("Content-Type", "text/html");
            res.status(200).render('cart', {
                products,
                userCartId 
            });
        } catch (err) {
            res.status(500).json({ message: "Error interno del servidor" });
        }
    })
router.get("/register", (req, res) => {
    res.status(200).render("register", { err: req.query.err })
})

router.get("/login", (req, res) => {
    //res.status(200).render("login")
    res.status(200).render("login", { err: req.query.err })
})

router.get("/logout", (req, res) => {
    res.redirect('/api/sessions/logout')
})

router.get("/profile", auth, (req, res) => {
    let user = req.session.existUser
    res.status(200).render("profile", { user })
})

