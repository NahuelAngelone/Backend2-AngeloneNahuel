import ProductModel from "../models/product.model.js";


class ProductManager {
	async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
		try {
			const existeCodigo = await ProductModel.findOne({ code: code });

			if (existeCodigo) {
				console.log("codigo repetido")
				return;
			}

			const nuevoProducto = new ProductModel({
				title,
				description,
				price,
				img,
				code,
				stock,
				category,
				status: true,
				thumbnails
			})

			//4) Se guarda. 
			await nuevoProducto.save();

		} catch (error) {
			console.log("error al leer archivo", error);
		}
	}



	async getProducts() {
		try {
			const arrayProductos = await ProductModel.find();
			return arrayProductos;
		} catch (error) {
			console.log("Error al leer el archivo", error);
		}

	}

	async getProductById(id) {
		try {
			const buscado = await ProductModel.findById(id);

			if (!buscado) {
				console.log("producto no encontrado");
				return null;
			} else {
				console.log("Producto encontrado");
				return buscado;
			}
		} catch (error) {
			console.log("Error al buscar por id", error);
		}
	}
	//Método para actualizar productos: 

	async updateProduct(id, productoActualizado) {
		try {
			const updateP = await ProductModel.findByIdAndUpdate(id, productoActualizado)
			if (!updateP) {
				console.log("producto no encontrado")
				return null;
			}
			return updateP;
		} catch (error) {
			console.log("Tenemos un error al actualizar productos");
		}
	}

	async deleteProduct(id) {
		try {
			const deleteP = await ProductModel.findByIdAndDelete(id)
			if (!deleteP) {
				console.log("producto no existe")
				return null;
			}
			return deleteP;
		} catch (error) {
			console.log("Tenemos un error al eliminar productos");
		}
	}
}




export default ProductManager;