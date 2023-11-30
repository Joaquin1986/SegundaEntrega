import { Router } from "express";
import { CartManager } from "../../dao/CartManager.js";

const router = Router();

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    if (cid) {
        const cart = await CartManager.getCartById(cid);
        res.render('carts', { title: 'Vista de Carrito 🛒', ...cart });
    }
});

export { router }