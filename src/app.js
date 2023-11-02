// Imports de Express y Routers
import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { router as productsRouter } from "./routers/products.router.js";
import { router as cartsRouter } from "./routers/carts.router.js";
import { router as homeRouter } from "./routers/home.router.js";

// Se crea el server express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

app.use("/", homeRouter);
app.use("/api", productsRouter);
app.use("/api", cartsRouter);

app.use((error, req, res, next) => {
    const message = `⛔ Error desconocido: ${error.message}`;
    console.error(message);
    res.status(500).json({ message });
});

export { app }; 
