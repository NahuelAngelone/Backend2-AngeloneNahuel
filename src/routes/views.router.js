import { Router } from "express";
import ProductManager from "../controller/product-manager.js";

const manager = new ProductManager("./src/data/products.json");
const router = Router();


router.get("/products", async (req, res) => {
	const productos = await manager.getProducts()

    res.render('index', {productos});
})

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts")
})

export default router;