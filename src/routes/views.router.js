import { Router } from "express";
import { router as allProducts } from './allProducts.router.js'
import { router as realTimeProducts } from "./realTimeProducts.router.js";

export const router = Router()

router.get('/', allProducts)
router.get('/realTimeProducts', realTimeProducts)