import { Router } from "express";
import { Product, ProductManager } from "../dao/ProductManager.js";
import productModel from "../models/product.model.js";

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
    try {
        const products = await productModel.paginate(criteria, options);
        return res.status(200).json(buildAnswer({ ...products, sort, query }));
    } catch {
        const errorAnswer = {
            status: "error",
            payload: [],
            totalPages: 0,
            prevPage: null,
            nextPage: null,
            page: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevLink: null,
            nextLink: null,
        };
        return res.status(500).json(errorAnswer);
    }
});

router.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await ProductManager.getProductById(pid);
        if (!product) return res.status(404).json({ "Error": `Producto id #${pid} no encontrado ⛔` });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

router.post("/products", async (req, res) => {
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
            const result = await ProductManager.addProduct(prod1);
            console.log(result)
            result !== -1 ? res.status(201).json(result) : res.status(400).json({
                "⛔Error:":
                    "Producto ya existente en la Base de Datos"
            });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
});

router.put("/products/:pid", async (req, res) => {
    const { pid } = req.params
    const { body } = req;
    if (pid) {
        try {
            const currentProduct = await productModel.find({ _id: pid });
            if (!body.title || !body.description || !body.price || !body.code || !body.stock) {
                return res.status(400).json({
                    "⛔Error:":
                        "Producto recibido no es válido. Propiedades vacías o sin definir ⛔"
                });
            } else {
                const result = await ProductManager.updateProduct(pid, body);
                result ? res.status(204).end() :
                    res.status(500).json({ "⛔Error:": "No se pudo actualizar el producto" });

            }
        } catch {
            return res.status(404).json({ "⛔Error:": "Producto ID#" + pid + " no existe en la BD ⛔" });
        }
    }
    else {
        return res.status(400).json({ "⛔Error:": "id recibido de Producto no es válido ⛔" });
    }
});

router.delete("/products/:pid", async (req, res) => {
    const { pid } = req.params;
    if (pid) {
        const result = await ProductManager.deleteProduct(pid);
        result ? res.status(200).json({ "✅Producto Eliminado: ": pid }) :
            res.status(404).json({ "⛔Error": `Producto id #${pid} no encontrado ⛔` });
    } else {
        res.status(400).json({ "⛔Error:": "id recibido de Producto no es válido ⛔" });
    }
});

const buildAnswer = (data) => {
    const answer = {
        status: "success",
        payload: data.docs,
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.prevPage}` : null,
        nextLink: data.hasNextPage ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.nextPage}` : null,
    }
    answer.prevLink && data.sort ? answer.prevLink += `&sort=${data.sort}` : null;
    answer.prevLink && data.query ? answer.prevLink += `&query=${data.query}` : null;
    answer.nextLink && data.sort ? answer.nextLink += `&sort=${data.sort}` : null;
    answer.nextLink && data.query ? answer.nextLink += `&query=${data.query}` : null;
    return answer;
};

export { router };