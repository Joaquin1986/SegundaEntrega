// Se importa archivo ProductManager.js
import { Product, ProductManager } from "./ProductManager.js";

// Constante de Express
import express from "express";


// Se crea el server express
const app = express();
app.use(express.urlencoded({ extended: true }));

// Se crea una nueva instancia de la Clase ProductManager
const pm1 = new ProductManager("./data.json");

app.get("/products", (req, res) => {
    const { limit } = req.query;
    if ((!limit || limit < 1)) {
        return pm1.getProducts().then((products) => res.send({ products }));
    }
    if (!parseInt(limit)) return res.send({ "Error": "Límite establecido no válido ⛔" })
    pm1.getProducts().then((result) => {
        const products = result;
        const filteredProducts = products.slice(0, limit)
        return res.send({ filteredProducts })
    });
});

app.get("/products/:pid", (req, res) => {
    const { pid } = req.params
    pm1.getProductById(parseInt(pid)).then((product) => {
        if (product) return res.send(product);
        return res.send({ "Error": `Producto id #${pid} no encontrado ⛔` });
    })
});

app.listen(8080, () => console.log("El server está escuchando en el puerto 8080 ✅"));
