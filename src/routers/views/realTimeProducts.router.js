import { Router } from "express";
import { ProductManager } from "../../dao/ProductManager.js";

const router = Router();
const pm1 = new ProductManager("./src/products.json");

router.get("/realtimeproducts", (req, res) => {
    res.render('realTimeProducts', { title: 'Alta de Producto en Tiempo Real ⌚' });
});

export { router };