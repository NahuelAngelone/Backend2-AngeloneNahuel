import express from "express";
import multer from "multer";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import exphbs from "express-handlebars";
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import usuariosRouter from "./routes/usuarios.router.js";
import mongoose from "./database.js";


const app = express();
const PUERTO = 8080;

//confid del handlebards	
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


//para que maneje JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//para las rutas
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);
app.use('/', viewsRouter);
app.use('/usuarios', usuariosRouter);


//para archivos estaticos + seguridad
app.use("/static", express.static("./src/public"))
app.use(express.static("./src/public"))


//Server escuchando
const httpServer = app.listen(PUERTO, () => {
	console.log("Escuchando correctamente")
});

//multer para subir archivos al servidor

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./src/public/img");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
})

const upload = multer({ storage: storage });

app.post("/img", upload.single("imagen"), (req, res) => {
	res.send("archivos cargado")
})

const io = new Server(httpServer);


import ProductManager from "./dao/db/product-manager-db.js";
const productManager = new ProductManager();


io.on("connection", async (socket) => {
	console.log("Un cliente se conecto");

	//Enviamos el array de productos: 
	socket.emit("productos", await productManager.getProducts());

	//Recibimos el evento "eliminarProducto" desde el cliente: 
	socket.on("eliminarProducto", async (id) => {
		await productManager.deleteProduct(id);

		//Le voy a enviar la lista actualizada al cliente: 
		io.sockets.emit("productos", await productManager.getProducts());
	})

	//Agregamos productos por medio de un formulario: 
	socket.on("agregarProducto", async (producto) => {
		await productManager.addProduct(producto);
		//Le voy a enviar la lista actualizada al cliente: 
		io.sockets.emit("productos", await productManager.getProducts());
	})
})

