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



	async getProducts({ limit = 10, page = 1, sort, query } = {}) {
		try {
			// Calcula el número de documentos a omitir (skip) en base a la página actual y el límite
			const skip = (page - 1) * limit;

			// Configura las opciones de búsqueda según el parámetro 'query' (si existe)
			let queryOptions = {};
			if (query) {
				queryOptions = { category: query };
			}

			// Configura las opciones de ordenamiento según el parámetro 'sort' (si existe)
			const sortOptions = {};
			if (sort) {
				if (sort === 'asc' || sort === 'desc') {
					sortOptions.price = sort === 'asc' ? 1 : -1;
				}
			}

			// Obtiene los productos según las opciones de búsqueda, ordenamiento, omisión y límite
			const products = await ProductModel
				.find(queryOptions)
				.sort(sortOptions)
				.skip(skip)
				.limit(limit);

			// Cuenta el número total de productos que cumplen con las opciones de búsqueda
			const totalProducts = await ProductModel.countDocuments(queryOptions);

			// Calcula el total de páginas basado en el número total de productos y el límite
			const totalPages = Math.ceil(totalProducts / limit);
			// Determina si hay una página anterior y si hay una página siguiente
			const hasPrevPage = page > 1;
			const hasNextPage = page < totalPages;

			// Devuelve un objeto con los productos, información de paginación y enlaces para la paginación
			return {
				docs: products,
				totalPages,
				prevPage: hasPrevPage ? page - 1 : null,
				nextPage: hasNextPage ? page + 1 : null,
				page,
				hasPrevPage,
				hasNextPage,
				prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
				nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
			};
		} catch (error) {
			// Registra el error en caso de que ocurra un problema al obtener los productos
			console.log("Error al obtener productos:", error);
			throw error;
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