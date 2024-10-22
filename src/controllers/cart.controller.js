import cartService from "../services/cart.service.js";

class CartController {

	async create(req, res) {
		try {
			const newCart = await cartService.createCart();
			res.status(201).json(newCart);
		} catch (error) {
			res.status(500).send("Error interno del servidor");
		}
	}

	async getCart(req, res) {
		const { cid } = req.params;
		try {
			const cart = await cartService.getCartById(cid);
			if (!cart) return res.status(404).send("Carrito no encontrado");
			res.json(cart);
		} catch (error) {
			res.status(500).send("Error interno del servidor");
		}
	}

	async addProductToCart(req, res) {
		const { cid, pid } = req.params; // Obtener el ID del carrito y del producto
		const { quantity = 1 } = req.body; // Obtener la cantidad del cuerpo de la solicitud
	
		try {
			const cart = await cartService.getCartById(cid); // Obtener el carrito por ID
			if (!cart) return res.status(404).send("Carrito no encontrado"); // Manejar carrito no encontrado
	
			const existingProduct = cart.products.find(item => item.product.toString() === pid); // Verificar si el producto ya está en el carrito
			if (existingProduct) {
				existingProduct.quantity += quantity; // Si existe, aumentar la cantidad
			} else {
				cart.products.push({ product: pid, quantity }); // Si no existe, agregar al carrito
			}
			
			await cartService.updateCart(cid, cart); // Actualizar el carrito
			res.json(cart); // Devolver el carrito actualizado
		} catch (error) {
			console.error("Error al agregar producto al carrito:", error.message); // Log del error
			res.status(500).send("Error interno del servidor"); // Responder con error
		}
	}
	async purchaseCart(req, res) {
		const cartId = req.params.cid;
		try {
			const result = await TicketService.purchaseCart(cartId);
			res.json({
				message: "Compra realizada con éxito",
				ticket: result.ticket,
				productosNoDisponibles: result.productosNoDisponibles
			});
		} catch (error) {
			res.status(500).json({ error: "Error al procesar la compra: " + error.message });
		}
	}

}

export default CartController; 