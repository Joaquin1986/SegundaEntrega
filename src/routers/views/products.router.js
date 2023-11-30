import { Router } from "express";
import { buildAnswer } from "../../utils.js";
import productModel from "../../models/product.model.js";

const router = Router();

router.get("/products", async (req, res) => {
    const { limit = 10, page = 1, query, sort } = req.query;
    const criteria = {};
    const options = { limit, page };
    if (sort) {
        options.sort = { price: sort };
    }
    if (query) {
        criteria.title = query;
    }
    const products = await productModel.paginate(criteria, options);
    const data = buildAnswer({ ...products }, "views")
    res.render('products', { title: 'Alta de Producto en Tiempo Real ⌚', ...data });
});

export { router };