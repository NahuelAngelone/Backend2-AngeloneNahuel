import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema({
	products: [
		{
			product: {
				type: String,
				require: true
			},
			quantity: {
				type: Number,
				require: true
			}
		}
	]
})

cartSchema.plugin(mongoosePaginate);

cartSchema.pre("findOne", function(next) {
	this.populate("products");
	next();
})

const CartModel = mongoose.model("carts", cartSchema)

export default CartModel;