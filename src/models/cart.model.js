import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
}, { _id: false });

const cartSchema = new mongoose.Schema({
    products: { type: [productsSchema], default: [] }
}, { timestamps: true });

cartSchema.pre('findById', function () {
    this.populate('products.product');
});

cartSchema.pre('find', function () {
    this.populate('products.product');
});

cartSchema.plugin(mongoosePaginate);

export default mongoose.model('Cart', cartSchema);