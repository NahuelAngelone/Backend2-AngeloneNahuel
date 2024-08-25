import CartModel from "../models/cart.model.js";

class CartManager {

	// Método para crear un carrito nuevo
	async crearCarrito() {
		try {
			// Crea una instancia de un nuevo carrito con un arreglo vacío de productos
			const nuevoCarrito = new CartModel({ products: [] });
			// Guarda el nuevo carrito en la base de datos
			await nuevoCarrito.save();
			return nuevoCarrito;
		} catch (error) {
			// Registra cualquier error que ocurra al crear el carrito
			console.log("Error al crear carrito:", error);
			throw error;
		}
	}

	// Método para obtener un carrito por su ID
	async getCarritoById(carritoId) {
		try {
			// Busca el carrito en la base de datos usando su ID
			const carritoBuscado = await CartModel.findById(carritoId);

			if (!carritoBuscado) {
				// Lanza un error si el carrito no se encuentra
				throw new Error("No existe un carrito con ese ID");
			}
			return carritoBuscado;
		} catch (error) {
			// Registra el error y lo vuelve a lanzar
			console.log("Error al obtener el carrito por ID:", error);
			throw error;
		}
	}

	// Método para agregar un producto al carrito
	async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
		try {
			// Obtiene el carrito usando su ID
			const carrito = await this.getCarritoById(carritoId);

			// Busca si el producto ya existe en el carrito
			const existeProducto = carrito.products.find(p => p.product.toString() === productoId);

			if (existeProducto) {
				// Si el producto ya está en el carrito, incrementa la cantidad
				existeProducto.quantity += quantity;
			} else {
				// Si el producto no está en el carrito, lo agrega con la cantidad especificada
				carrito.products.push({ product: productoId, quantity });
			}

			// Marca el campo "products" como modificado para guardar los cambios
			carrito.markModified("products");
			// Guarda el carrito actualizado en la base de datos
			await carrito.save();
			return carrito;
		} catch (error) {
			// Registra el error y lo vuelve a lanzar
			console.log("Error al agregar producto:", error);
			throw error;
		}
	}

	// Método para eliminar un artículo del carrito
	async deleteItem(itemId, cartId) {
		try {
			// Busca el carrito usando su ID
			const cart = await CartModel.findById(cartId);

			if (!cart) {
				// Lanza un error si el carrito no se encuentra
				throw new Error('Carrito no encontrado');
			}

			// Encuentra el índice del artículo en el carrito
			const index = cart.products.findIndex(item => item._id.toString() === itemId.toString());

			if (index !== -1) {
				// Elimina el artículo del carrito si se encuentra
				cart.products.splice(index, 1);
				await cart.save(); // Guarda el carrito actualizado
				console.log('Artículo eliminado del carrito');
			} else {
				// Informa si el artículo no se encuentra en el carrito
				console.log('Artículo no encontrado en el carrito');
			}
		} catch (error) {
			// Registra el error y lo vuelve a lanzar
			console.error('Error al eliminar el artículo:', error);
			throw error;
		}
	}

	// Método para actualizar la cantidad de un producto en el carrito
	async updateProductQuantity(cartId, productId, quantity) {
		try {
			// Busca el carrito y actualiza la cantidad del producto específico
			const cart = await CartModel.findOneAndUpdate(
				{ _id: cartId, "products.product": productId },
				{ $set: { "products.$.quantity": quantity } },
				{ new: true }
			).populate('products.product');

			if (!cart) {
				// Lanza un error si el producto no se encuentra en el carrito
				console.log('Producto no encontrado en el carrito');
				throw new Error('Producto no encontrado en el carrito');
			}

			console.log('Cantidad del producto actualizada');
			return cart; // Devuelve el carrito actualizado
		} catch (error) {
			// Registra el error y lo vuelve a lanzar
			console.log("Error al actualizar la cantidad del producto", error);
			throw error;
		}
	}

	// Método para vaciar el carrito
	async emptyCart(cartId) {
		try {
			// Encuentra el carrito por ID y lo vacía
			await CartModel.findByIdAndUpdate(
				cartId,
				{ $set: { products: [] } },
				{ new: true } // Devuelve el documento actualizado
			);
			console.log('Carrito vaciado exitosamente');
		} catch (error) {
			// Registra el error y lo vuelve a lanzar
			console.log("Error al vaciar el carrito", error);
			throw error;
		}
	}

}


export default CartManager; 