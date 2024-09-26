import bcrypt from "bcrypt";

//hasheo password 
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//valido password
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

export { createHash, isValidPassword };