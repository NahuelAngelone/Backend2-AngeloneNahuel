export function soloAdmin(req, res, next) {
	if (!req.user) return res.status(403).send("No autorizado");
	if (req.user.role === "admin") {
		next();
	} else {
		res.status(403).send("Acceso denegado, no tienes rol de Admin");
	}
}

export function soloUser(req, res, next) {
	if (!req.user) return res.status(403).send("No autorizado");
	if (req.user.role === "user") {
		next();
	} else {
		res.status(403).send("Acceso denegado, no tienes rol de usuario normal");
	}
}