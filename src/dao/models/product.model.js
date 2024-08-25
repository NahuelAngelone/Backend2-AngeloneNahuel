import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({

	title: {
		type: String,
		require: true
	},
	description: {
		type: String,
		require: true
	},
	price: {
		type: Number,
		require: true
	},
	category: {
		type: String,
		require: true
	},
	stock: {
		type: Number,
		require: true
	},
	code: {
		type: String,
		require: true,
		unique: true
	},
	img: {
		type: String,
	},
	status: {
		type: Boolean,
		require: true
	},
	thumbnails: {
		type: [String],
	},
})

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("products", productSchema)

export default ProductModel;