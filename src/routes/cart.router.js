import { Router } from "express";
import CartManager from "../dao/db/cart-manager-db.js"
import CartModel from "../dao/models/cart.model.js";
const router = Router();
const cartManager = new CartManager();

//1) Creamos un nuevo carrito: 

router.post("/", async (req, res) => {
	try {
		const nuevoCarrito = await cartManager.crearCarrito();
		res.json(nuevoCarrito);
	} catch (error) {
		res.status(500).send("Error del servidor");
	}
})

//2) La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

router.get("/:cid", async (req, res) => {
	const carritoID = req.params.cid;

	try {
		const carritoBuscado = await CartModel.findById(carritoID).populate('products.product');
		if (!carritoBuscado) {
			return res.status(404).json({ error: "Carrito no encontrado" })
		};
		return res.json(carritoBuscado.products)
	} catch (error) {
		res.status(500).send("Error del servidor");
	}
})

//3) Agregar productos a distintos carritos: 

router.post("/:cid/product/:pid", async (req, res) => {
	const carritoId = req.params.cid;
	const productoId = req.params.pid;
	const quantity = req.body.quantity || 1;

	try {
		const carritoActualizado = await cartManager.agregarProductoAlCarrito(carritoId, productoId, quantity);
		res.json(carritoActualizado.products);
	} catch (error) {
		res.status(500).send("Error al ingresar un producto al carrito");
	}
})

// Vaciar el carrito
router.delete("/:cid", async (req, res) => {
	const cartId = req.params.cid;

	try {
		const cart = await cartManager.emptyCart(cartId);
		res.json({ message: "Carrito vaciado correctamente" });
	} catch (error) {
		console.error(`Error intentando vaciar el carrito con ID: ${cartId}`, error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Eliminar un producto específico del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;

	try {
		const ItemCartDelete = await cartManager.deleteItem(productId, cartId);

		if (!ItemCartDelete) {
			return res.status(404).json({ error: "Producto no encontrado en el carrito" });
		}

		res.json({ message: "Producto eliminado del carrito correctamente" });
	} catch (error) {
		console.error("Error eliminando el producto del carrito", error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/product/:pid", async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	const { quantity } = req.body;

	// Verifica que la cantidad sea válida
	if (!quantity || quantity < 1) {
		return res.status(400).json({ error: "Cantidad inválida" });
	}

	try {
		const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);

		if (!updatedCart) {
			return res.status(404).json({ error: "Carrito o producto no encontrado" });
		}

		res.json(updatedCart.products);
	} catch (error) {
		console.error("Error actualizando la cantidad del producto en el carrito", error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Actualizar el carrito con un array de productos
router.put("/:cid", async (req, res) => {
	const cartId = req.params.cid;
	const newProducts = req.body.products;

	// Verifica que el array de productos sea válido
	if (!Array.isArray(newProducts)) {
		return res.status(400).json({ error: "Array de productos inválido" });
	}

	try {
		const cart = await CartModel.findById(cartId);

		if (!cart) {
			return res.status(404).json({ error: "Carrito no encontrado" });
		}

		cart.products = newProducts;
		await cart.save();

		res.json(cart);
	} catch (error) {
		console.error("Error actualizando el carrito", error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});


export default router;