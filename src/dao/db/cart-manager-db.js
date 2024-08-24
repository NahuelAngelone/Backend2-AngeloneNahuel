import CartModel from "../models/cart.model.js";

class CartManager {

	//Metodo para crear un carrito: 

	async crearCarrito() {
		try {
			const nuevoCarrito = new CartModel({ products: [] })
			await nuevoCarrito.save();
			return nuevoCarrito;
		} catch (error) {
			console.log("error al crear carrito")
		}
	}

	async getCarritoById(carritoId) {
		try {
			const carritoBuscado = await CartModel.findById(carritoId)

			if (!carritoBuscado) {
				throw new Error("No existe un carrito con ese id");
			}
			return carritoBuscado;

		} catch (error) {
			console.log("Error al obtener el carrito por id");
			throw error;
		}
	}

	async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
		try {
			const carrito = await this.getCarritoById(carritoId);
			const existeProducto = carrito.products.find(p => p.product.toString() === productoId);
			//De esta forma chequeo si el producto que estoy recibiendo para agregar al carrito ya esta presente en el. Si existe modifico la cantidad, si no existe lo agrego. 

			if (existeProducto) {
				existeProducto.quantity += quantity;
			} else {
				carrito.products.push({ product: productoId, quantity });
			}

			//Como aca modifique el carrito, ahora tengo que guardar en el archivo: 
			carrito.markModified("products");
			await carrito.save();
			return carrito;
		} catch (error) {
			console.log("error al agregar producto: ", error)
		}
	}

}

export default CartManager; 