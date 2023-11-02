import { Router } from "express";
import { CartManager } from "../CartManager.js";

const router = Router();
const cm1 = new CartManager("./src/carts.json");

router.get("/carts/:cid", (req, res) => {
    const { cid } = req.params;
    if (cid) {
        cm1.getCartById(cid).then((cart) => {
            if (cart) return res.status(200).json(cart.products);
            return res.status(404).json({ "⛔Error": `Carrito id '${cid}' no encontrado` });
        });
    }
});

router.post("/carts", (req, res) => {
    try {
        cm1.addCart().then((result) => {
            result ? res.status(201).json({ "✅Carrito creado": result }) : res.status(500).json({
                "⛔Error:":
                    "Hubo un error interno del servidor al crear el carrito"
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/carts/:cid/product/:pid", (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (cid && pid) {
        cm1.addProductToCart(cid, pid, quantity).then((result) => {
            if (result) return res.status(200).json({ "✅Cantidad agregada": `+${quantity} de producto '${pid}' al carrito '${cid}'` });
            if (result === undefined) return res.status(500).json({ "⛔Error": "Error: debe crear el archivo JSON utilizando el método POST '/api/carts/'" });
            return res.status(404).json({ "⛔Error": `Carrito id '${cid}' no encontrado` });

        })
    }
});

export { router };