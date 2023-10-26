import { Router } from "express";
import { Product, ProductManager } from "../ProductManager.js";

const router = Router();
const pm1 = new ProductManager("./src/products.json");

router.get("/products", (req, res) => {
    const { limit } = req.query;
    if (!limit || limit < 1) {
        return pm1.getProducts().then((products) => res.status(200).json(products));
    }
    if (!parseInt(limit)) return res.status(400).json({ "Error": "Límite establecido no válido ⛔" })
    pm1.getProducts().then((result) => {
        const products = result;
        const filteredProducts = products.slice(0, limit)
        return res.status(200).json(filteredProducts);
    });
});

router.get("/products/:pid", (req, res) => {
    const { pid } = req.params;
    pm1.getProductById(pid).then((product) => {
        if (product) return res.status(200).json(product);
        return res.status(404).json({ "Error": `Producto id #${pid} no encontrado ⛔` });
    })
});

router.post("/products", (req, res) => {
    const { body } = req;
    const { title, description, price, code, stock } = body;
    if (!title || !description || !price || !code || !stock) {
        return res.status(400).json({
            "⛔Error:":
                "Producto recibido no es válido. Propiedades vacías o sin definir ⛔"
        });
    } else {
        try {
            const prod1 = new Product(title, description, price, code, stock);
            pm1.addProduct(prod1).then((result) => {
                result ? res.status(201).json(prod1) : res.status(400).json({
                    "⛔Error:":
                        "Producto ya existente u ocurrió un problema al guardarlo en el FS"
                });
            });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
});

router.put("/products/:pid", (req, res) => {
    const { pid } = req.params
    const { body } = req;
    const { title, description, price, thumbnails, code, status, stock } = body;
    if (pid) {
        try {
            pm1.productCodeExists(code).then((exists) => {
                if (exists) {
                    if (!title || !description || !price || !code || !stock) {
                        return res.status(400).json({
                            "⛔Error:":
                                "Producto recibido no es válido. Propiedades vacías o sin definir ⛔"
                        });
                    } else {
                        const newProduct = new Product(title, description, price, code, stock);
                        //Se mantiene el mismo 'id' del Producto, ya que el contructor por defecto asigna uno único
                        newProduct.id = pid;
                        newProduct.status = status;
                        if (thumbnails) newProduct.thumbnails = thumbnails;
                        pm1.updateProduct(newProduct).then((result) => {
                            result ? res.status(201).json(newProduct) : res.status(500).json({
                                "⛔Error:":
                                    "El Producto '" + pid + "' no pudo ser actualizado"
                            });
                        });
                    }
                } else {
                    return res.status(404).json({ "⛔Error:": "Producto recibido no existe en la base ⛔" });
                }
            });
        } catch (error) {
            return res.status(400).json({ error });
        }
    } else {
        return res.status(400).json({ "⛔Error:": "id recibido de Producto no es válido ⛔" });
    }
});

router.delete("/products/:pid", (req, res) => {
    const { pid } = req.params;
    if (pid) {
        pm1.deleteProduct(pid).then((result) => {
            if (result) return res.status(200).json({ "✅Producto Eliminado: ": pid });
            return res.status(404).json({ "⛔Error": `Producto id #${pid} no encontrado ⛔` });
        })
    } else {
        res.status(400).json({ "⛔Error:": "id recibido de Producto no es válido ⛔" });
    }
});

export { router };