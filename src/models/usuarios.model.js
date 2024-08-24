import mongoose from "mongoose";

const usuariosCollection = "usuarios";

const usuariosSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    edad: Number
})

const UsuarioModel = mongoose.model(usuariosCollection, usuariosSchema);

export default UsuarioModel