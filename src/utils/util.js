import bcrypt from "bcrypt";

//hasheo password 
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//valido password
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

const calcularTotal = (products) => {
    let total = 0; 

    products.forEach( item => {
        total += item.product.price * item.quantity;
    })

    return total; 
}

export { createHash, isValidPassword, calcularTotal }; 