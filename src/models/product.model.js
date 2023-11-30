import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: { type: Array, "default": [] },
    code: String,
    status: Boolean,
    stock: Number,
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', productSchema);