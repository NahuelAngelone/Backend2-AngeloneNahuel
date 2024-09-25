import { Router } from "express";
const router = Router();
import UserModel from "../models/usuarios.model.js";

//registro de usuario y almacenamiento en MondongoDB: 

router.post("/register", async (req, res) => {
	const { first_name, last_name, email, password, age } = req.body;

	try {
		//Verificamos si el email ya esta registrado: 
		const existeUsuario = await UserModel.findOne({ email: email });

		if (existeUsuario) {
			return res.status(400).send("El email ya esta registrado, intente nuevamente");
		}

		//Si el email nunca fue usado, puedo registrar un nuevo usuario: 
		const nuevoUser = await UserModel.create({
			first_name,
			last_name,
			email,
			password,
			age
		})

		//Almacenamos los datos del usuario en la sesión: 
		req.session.user = {
			first_name: nuevoUser.first_name,
			last_name: nuevoUser.last_name,
			email: nuevoUser.email,
			age: nuevoUser.age
		}

		res.status(200).send("Usuario creado con exito!");

	} catch (error) {
		res.status(500).send("Error del servidor");
	}
})


//login: 

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		//Primero verificamos el email: 
		const usuario = await UserModel.findOne({ email: email });

		if (usuario) {
			//Si encuentro al usuario, ahora verifico la contraseña: 
			if (usuario.password === password) {
				req.session.user = {
					first_name: usuario.first_name,
					last_name: usuario.last_name,
					email: usuario.email,
					age: usuario.age
				}
				res.redirect("/profile");
			} else {
				res.status(401).send("Password incorrecto");
			}
		} else {
			res.status(404).send("Usuario no encontrado");
		}
	} catch (error) {
		res.status(500).send("Error interno del server");
	}
})



export default router;