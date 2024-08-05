import express from "express";
import multer from "multer";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import exphbs from "express-handlebars";
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";


const app = express();
const PUERTO = 8080;

//confid del handlebards	
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


//para que maneje JSON
app.use(express.json());

//para las rutas
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);
app.use('/', viewsRouter)


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

io.on("connection", (socket) => {
	socket.on("mensaje", (data) => {
		console.log(data);

	socket.emit("saludo", "hola cliente");
	})

})