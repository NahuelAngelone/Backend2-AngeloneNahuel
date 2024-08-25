import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const router = express.Router();
const manager = new ProductManager();

// Obtener productos con paginación, ordenamiento y filtrado
router.get("/", async (req, res) => {
	try {
		const { limit = 10, page = 1, sort, query } = req.query;

		// Llama al método getProducts del ProductManager con opciones de paginación, ordenamiento y filtrado
		const products = await manager.getProducts({
			limit: parseInt(limit),
			page: parseInt(page),
			sort,
			query,
		});

		// Responde con los productos y detalles de paginación
		res.json({
			status: 'success',
			payload: products,
			totalPages: products.totalPages,
			prevPage: products.prevPage,
			nextPage: products.nextPage,
			page: products.page,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
			nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
		});

	} catch (error) {
		console.error("Error al obtener productos", error);
		res.status(500).json({
			status: 'error',
			error: "Error interno del servidor"
		});
	}
});

// Obtener un producto específico por ID
router.get("/:pid", async (req, res) => {
	const id = req.params.pid;

	try {
		const product = await manager.getProductById(id);
		if (!product) {
			return res.status(404).json({
				error: "Producto no encontrado"
			});
		}

		res.json(product); // Devuelve el producto encontrado
	} catch (error) {
		console.error("Error al obtener el producto", error);
		res.status(500).json({
			error: "Error interno del servidor"
		});
	}
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
	const newProduct = req.body;

	try {
		await manager.addProduct(newProduct);
		res.status(201).json({
			message: "Producto agregado exitosamente"
		});
	} catch (error) {
		console.error("Error al agregar el producto", error);
		res.status(500).json({
			error: "Error interno del servidor"
		});
	}
});

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
	const id = req.params.pid; // Obtiene el ID del producto de los parámetros de la solicitud
	const updatedProduct = req.body; // Obtiene los datos actualizados del producto del cuerpo de la solicitud

	try {
		await manager.updateProduct(id, updatedProduct);
		res.json({
			message: "Producto actualizado exitosamente"
		});
	} catch (error) {
		console.error("Error al actualizar el producto", error);
		res.status(500).json({
			error: "Error interno del servidor"
		});
	}
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
	const id = req.params.pid;

	try {
		await manager.deleteProduct(id);
		res.json({
			message: "Producto eliminado exitosamente"
		});
	} catch (error) {
		console.error("Error al eliminar el producto", error);
		res.status(500).json({
			error: "Error interno del servidor"
		});
	}
});

export default router; 
