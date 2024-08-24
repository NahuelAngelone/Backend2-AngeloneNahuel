import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const router = Router();
const manager = new ProductManager()

router.get("/", async (req, res) => {
	let limit = req.query.limit;
	try {
		const arrayProductos = await manager.getProducts();

		if (limit) {
			res.send(arrayProductos.slice(0, limit));
		} else {
			res.send(arrayProductos);
		}
	} catch (error) {
		res.status(500).send("Error interno del servidor");
	}
})


//ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos. 

router.get("/:pid", async (req, res) => {
	let id = req.params.pid;
	try {
		const producto = await manager.getProductById(id);

		if (!producto) {
			res.send("No se encuentra el producto deseado");
		} else {
			res.send({ producto });
		}
	} catch (error) {
		console.log("error al buscar ese id")
	}
})

//La ruta raíz POST / deberá agregar un nuevo producto

router.post("/", async (req, res) => {
	const nuevoProducto = req.body;
	try {
		await manager.addProduct(nuevoProducto);
		res.status(201).send({ message: "Producto agregado exitosamente" });
	} catch (error) {
		res.status(500).send({ status: "error", message: error.message });
	}
})

// DELETE /products/:pid - Eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
	const id = req.params.pid;
	try {
		await manager.deleteProduct(id);
		res.send({ message: "Producto eliminado exitosamente" });
	} catch (error) {
		res.status(500).send({ status: "error", message: error.message });
	}
});

// PUT /products/:pid - Actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
	let id = req.params.pid;
	const productoActualizado = req.body;

	try {
		await manager.updateProduct(id, productoActualizado);
		res.send({ message: "Producto actualizado exitosamente" });
	} catch (error) {
		res.status(500).send({ status: "error", message: error.message });
	}
});

export default router;