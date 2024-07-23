import express from "express";
import multer from "multer";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";

const app = express();
const PUERTO = 8080;


//para que maneje JSON
app.use(express.json());

//para las rutas
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);

//para archivos estaticos + seguridad
app.use("/static", express.static("./src/public"))


//Server escuchando
app.listen(PUERTO, () => {
	console.log('Escuchando correctamente')
})

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