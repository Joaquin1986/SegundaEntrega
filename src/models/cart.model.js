import mongoose, { mongo } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema({
    products: [{
        product: String,
        quantity: Number
    }, { _id: false }],
}, { timestamps: true });

cartSchema.plugin(mongoosePaginate);

export default mongoose.model('Cart', cartSchema);