import { Router } from "express";
import { CartManager } from "../dao/CartManager.js";

const router = Router();

//ARREGLAR CON STATIC
router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    if (cid) {
        try {
            const cart = await CartManager.getCartById(cid);
            if (cart) return res.status(200).json(cart);
        } catch (error) {
            return res.status(404).json({ "⛔Error": `Carrito id '${cid}' no encontrado` });
        }
    }
});

router.post("/carts", async (req, res) => {
    try {
        const newCart = await CartManager.addCart();
        return res.status(201).json({ "✅Carrito creado": newCart._id });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

router.put("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    const { body } = req;
    if (!cid) {
        return res.status(400).json({ "⛔Error": "Parametro recibidos no son validos" });
    }
    try {
        const result = await CartManager.addArrayToCart(cid, body);
        if (result === 1) return res.status(200).json({ "✅Info. agregada": `Se agregó la información al carrito '${cid}'` });
        if (result === -1) return res.status(404).json({ "⛔Error": `Carrito id '${cid}' no encontrado.` });
        if (result === -2) return res.status(404).json({ "⛔Error": `Productos no válidos en la lista` });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

router.put("/carts/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!cid || !pid) {
        return res.status(400).json({ "⛔Error": "Parametros recibidos no son validos" });
    }
    try {
        const result = await CartManager.addProductToCart(cid, pid, quantity);
        if (result === -1) return res.status(404).json({ "⛔Error": `Carrito id '${cid}' no encontrado.` });
        if (result === -2) return res.status(404).json({ "⛔Error": `Producto id '${pid}' no encontrado.` });
        return res.status(200).json({ "✅Cantidad agregada": `+${quantity} de producto '${pid}' al carrito '${cid}'` });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

router.delete("/carts/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    if (pid && cid) {
        try {
            const result = await CartManager.deleteProductFromCart(cid, pid);
            result ? res.status(200).json({ "✅Producto Eliminado del Carrito: ": pid }) :
                res.status(404).json({ "⛔Error": `Carrito o Producto no encontrados ⛔` });
        } catch (error) {
            return res.status(500).json({ error });
        }
    } else {
        res.status(400).json({ "⛔Error:": "id recibido de Producto no es válido ⛔" });
    }
});

router.delete("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    if (cid) {
        try {
            const result = await CartManager.emptyCart(cid);
            result ? res.status(200).json({ "✅Se vació exitosamente el Carrito: ": cid }) :
                res.status(404).json({ "⛔Error": `Carrito no encontrado ⛔` });
        } catch (error) {
            return res.status(500).json({ error });
        }
    } else {
        res.status(400).json({ "⛔Error:": "id recibido de Carrito no es válido ⛔" });
    }
});

export { router };