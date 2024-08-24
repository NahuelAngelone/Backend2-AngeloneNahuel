import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const manager = new ProductManager();
const router = Router();


router.get("/products", async (req, res) => {
	const productos = await manager.getProducts()

    res.render('index', {productos});
})

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts")
})

export default router;