import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
    const products = await ProductManager.getProducts();
    res.render("home", { title: "Home Productos 🏡", products });
});

export { router };