import { Router } from "express";
import { Product, ProductManager } from "../ProductManager.js";

const router = Router();
const pm1 = new ProductManager("./src/products.json");

router.get("/", (req, res) => {
    pm1.getProducts().then((products) => {
        res.render("home", { title: "Home Productos 🏡", products});
    });

});

export { router };