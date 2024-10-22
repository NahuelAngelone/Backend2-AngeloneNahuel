import TicketRepository from "../repositories/ticket.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import UserRepository from "../repositories/user.repository.js";
import { calcularTotal } from "../utils/util.js"; 

class TicketService {
	async purchaseCart(cartId) {
		const cart = await CartRepository.getCartById(cartId);
		const productosNoDisponibles = [];

		for (const item of cart.products) {
			const product = await ProductRepository.getProductById(item.product);
			if (product && product.stock >= item.quantity) {
				product.stock -= item.quantity;
				await ProductRepository.updateProduct(product._id, { stock: product.stock });
			} else {
				productosNoDisponibles.push(item.product);
			}
		}

		const user = await UserRepository.getUserById(cart.purchaser); 

		const total = calcularTotal(cart.products); 

		const ticketData = {
			code: generateUniqueCode(), 
			amount: total,
			purchaser: user._id 
		};

		const ticket = await TicketRepository.createTicket(ticketData);

		// Eliminar productos no disponibles del carrito
		cart.products = cart.products.filter(item => !productosNoDisponibles.includes(item.product));
		await CartRepository.updateCart(cart._id, cart); 

		return { ticket, productosNoDisponibles };
	}
}

export default new TicketService();