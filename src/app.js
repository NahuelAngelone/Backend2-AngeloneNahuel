import express from "express";
import multer from "multer";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import exphbs from "express-handlebars";
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import usuariosRouter from "./routes/usuarios.router.js";
import mongoose from "./database.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import FileStore from "session-file-store";
import sessionRouter from "./routes/session.router.js"

//Persistencias de archivos
const fileStore = new FileStore(session);


const app = express();
const PUERTO = 8080;

//confid del handlebards	
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


//para que maneje JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret: "secret",
	resave: true,
	saveUninitialized: true,
	store: MongoStore.create({
		mongoUrl: "mongodb+srv://nahuelangelone94:Mongo123@cluster0.p2h3zxe.mongodb.net/Store?retryWrites=true&w=majority&appName=Cluster0", ttl:100
	})
}))
//para las rutas
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);
app.use('/', viewsRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/sessions', sessionRouter)


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
import MongoStore from "connect-mongo";
const productManager = new ProductManager();


io.on("connection", async (socket) => {
	console.log("Un cliente se conecto");

	//Enviamos el array de productos: 
	socket.emit("products", await productManager.getProducts());

	//Recibimos el evento "eliminarProducto" desde el cliente: 
	socket.on("eliminarProducto", async (id) => {
		await productManager.deleteProduct(id);

		//Le voy a enviar la lista actualizada al cliente: 
		io.sockets.emit("products", await productManager.getProducts());
	})

	//Agregamos productos por medio de un formulario: 
	socket.on("agregarProducto", async (producto) => {
		await productManager.addProduct(producto);
		//Le voy a enviar la lista actualizada al cliente: 
		io.sockets.emit("products", await productManager.getProducts());
	})
})

