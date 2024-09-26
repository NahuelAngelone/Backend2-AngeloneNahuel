import { Router } from "express";
const router = Router();

import UsuarioModel from "../models/usuarios.model.js";

router.get("/", async (req, res) => {
	try {
		const listadoUsuarios = await UsuarioModel.find()
		res.json(listadoUsuarios);
	} catch (error) {
		res.status(500).json({ message: "Error en el servidor" });
	}
})

//agregamos usuarios
router.post("/", async (req, res) => {
	const nuevoUsuario = req.body;
	try {
		const documentoUser = new UsuarioModel(nuevoUsuario);
		await documentoUser.save();
		res.send({ message: "Usuario agregado exitosamente", usuario: documentoUser });
	} catch (error) {
		res.send("error");
	}
})

//actualizo usuario
router.put("/:id", async (req, res) => {
	try {
		const user = await UsuarioModel.findByIdAndUpdate(req.params.id, req.body);
		if (!user) {
			return res.status(404).send("usuario no encontrado");
		}
		res.status(200).send({ message: "Usuario actualizado" })
	} catch (error) {
		res.status(500).send("Error del servidor")
	}
})

//elimino usuario
router.delete("/:id", async (req, res) => {
	try {
		const user = await UsuarioModel.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).send("usuario no encontrado");
		}
		res.status(200).send({ message: "Usuario borrado" })
	} catch (error) {
		res.status(500).send("Error del servidor")
	}
})

export default router;