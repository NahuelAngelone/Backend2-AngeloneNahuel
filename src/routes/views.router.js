import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta para la página de inicio
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/carts", (req, res) => {
  res.render("carts");
});

// Ruta para obtener productos con paginación
router.get("/products", async (req, res) => {
  try {
    // Obtiene parámetros de paginación, con valores predeterminados si no se especifican
    const { page = 1, limit = 5 } = req.query;

    // Llama al método getProducts del ProductManager con opciones de paginación
    const productos = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    // Mapea los productos para eliminar el campo _id antes de enviar los datos a la vista
    const nuevoArray = productos.docs.map((producto) => {
      const { _id, ...rest } = producto.toObject();
      return rest;
    });

    // Renderiza la vista "products" con los productos y datos de paginación
    res.render("products", {
      productos: nuevoArray,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      currentPage: productos.page,
      totalPages: productos.totalPages,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

// Ruta para obtener el carrito por ID
router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    // Llama al método getCarritoById del CartManager con el ID del carrito
    const carrito = await cartManager.getCarritoById(cartId);

    if (!carrito) {
      console.log("El carrito con ID", cartId, "no existe");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Mapea los productos en el carrito para obtener un formato adecuado para la vista
    const productosEnCarrito = carrito.products.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    // Renderiza la vista "carts" con los productos en el carrito
    res.render("carts", { productos: productosEnCarrito });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Formulario de Registro. 

router.get("/register", (req, res) => {
  res.render("registro");
})

//Formulario de Login. 

router.get("/login", (req, res) => {
  res.render("login");
})


//Perfil. 

router.get("/profile", (req, res) => {
  res.render("perfil");
})

export default router;

