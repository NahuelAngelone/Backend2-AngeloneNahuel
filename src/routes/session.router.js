import { Router } from "express";
const router = Router();
import UserModel from "../models/usuarios.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";

//registro de usuario con passport y almacenamiento en MondongoDB: 

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failedregister" }), async (req, res) => {
	req.session.user = {
		first_name: req.user.first_name,
		last_name: req.user.last_name,
		age: req.user.age,
		email: req.user.email
	}

	req.session.login = true;
	res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
	res.send("Registro fallido");
})


//login passport: 

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}) ,async (req, res) => {
	req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			age: req.user.age, 
			email: req.user.email
	}

	req.session.login = true;
	res.redirect("/profile");
})

router.get("/faillogin", async (req, res) => {
	res.send("Error al loguearse");
})

router.get("/logout", (req, res) => {
	if (req.session.login) {
		req.session.destroy()
	}
	res.redirect("/login")
})



export default router;