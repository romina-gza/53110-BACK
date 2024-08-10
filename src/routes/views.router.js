import { Router } from "express";
import { productsModel } from "../dao/model/products.model.js";
import __dirname from "../utils.js"

import { auth } from "../middleware/auth.js";
import { productsServices } from "../services/products.service.js";
import { cartsServices } from "../services/carts.service.js";
import { UserDTO } from "../dto/users.dto.js";
import { accessMiddleware } from "../middleware/access.js";
import UsersController from "../controller/users.controller.js";
import { userService } from "../services/users.service.js";


export const router = Router()

router.get('/', async (req,res)=> {
    try {
        let user = req.session.existUser
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
            user: user,
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

router.get("/realtimeproducts", accessMiddleware(["admin","premium"]),async (req, res) => {
    let user = req.session.existUser
    let product = await productsServices.getAllProducts()
    res.status(200).render("realTimeProducts", {user, product} )
})

router.delete('/delete', UsersController.notActiveUsers)

router.get('/chat', auth, accessMiddleware(['user']), (req, res)=>{
    let user = req.session.existUser
    let userName = user.first_name
    res.status(200).render( "chat", {user, userName})
})

router.get("/products", auth, async (req, res) => {
    try {
        let user = req.session.existUser;
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

router.get("/cart", async (req, res)=> {
    try {
        const user = req.session.existUser
        const cid = req.session.existUser.cart

        let totalPrice = await cartsServices.calculateTotalPrice(cid)
        let products = await cartsServices.getCartsById(cid) 

        res.status(200).render("cart", { user, products, totalPrice })
    } catch (err) {
        res.status(500).send("Error al obtener el carrito, debes estar logueado para poder agregar productos 😊.");
    }
})
router.get("/register", (req, res) => {

    res.status(200).render("register", { err: req.query.err })
})

router.get("/login", (req, res) => {
    res.status(200).render("login", { err: req.query.err })
})

router.get("/logout", (req, res) => {
    res.redirect('/api/sessions/logout')
})

router.get("/profile", auth, (req, res) => {
    let user = req.session.existUser
    res.status(200).render("profile", { user })
})

router.get("/current", auth, (req, res) => {
    let user = req.session.existUser
    let returnUser = new UserDTO(user)
    res.status(200).render("current", { returnUser })
})

router.get('/loggerTest', (req, res) => {
    req.logger.debug('prueba logger de Debug log')
    req.logger.http('prueba logger de HTTP log')
    req.logger.info('prueba logger de Info log')
    req.logger.warning('prueba logger de Warning log')
    req.logger.error('prueba logger de Error log')
    req.logger.fatal('prueba logger de Fatal log')

    res.status(200).render('home')
})

router.get('/adminManageUsers', accessMiddleware(['admin']), async (req, res) => {
    let users = await userService.getAllUsers()
    let user = req.session.existUser
    
    res.status(200).render('adminManageUsers', { users, user });
});

router.get('/uploadDocuments', accessMiddleware(['user']), async (req, res) => {
    let user = req.session.existUser
    let userId = req.params.uid || req.session.existUser._id
    res.status(200).render('uploadDocuments', { user, userId })
})