import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: { type: Array, "default": [] },
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);