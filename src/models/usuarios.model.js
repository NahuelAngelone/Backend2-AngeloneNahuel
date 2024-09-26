import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
	usuario: {
		type: String,
		required: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	password: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true
	},
	rol: {
		type: String,
		enum: ["admin", "user"], 
		default: "user"
	},
	cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
});

const UsuarioModel = mongoose.model("usuarios", usuarioSchema);

export default UsuarioModel;
