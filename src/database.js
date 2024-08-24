import mongoose from "mongoose"

//Conecto a mongo
mongoose.connect("mongodb+srv://nahuelangelone94:Mongo123@cluster0.p2h3zxe.mongodb.net/Store?retryWrites=true&w=majority&appName=Cluster0")
	.then(() => console.log("mongo on"))
	.catch(() => console.log("mongo off"))



export default mongoose