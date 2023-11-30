// Imports de Express y Routers
import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { router as productsApiRouter } from "./routers/api/products.router.js";
import { router as cartsRouter } from "./routers/api/carts.router.js";
import { router as homeRouter } from "./routers/views/home.router.js";
import { router as productsViewsRouter } from "./routers/views/products.router.js";
import { router as cartsViewsRouter } from "./routers/views/carts.router.js";
import { router as realTimeProducts} from "./routers/views/realTimeProducts.router.js";


// Se crea el sas realTimeProducts
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

app.use("/views", homeRouter);
app.use("/views", productsViewsRouter);
app.use("/views", cartsViewsRouter);
app.use("/views", realTimeProducts);
app.use("/api", productsApiRouter);
app.use("/api", cartsRouter);

app.use((error, req, res, next) => {
    const message = `⛔ Error desconocido: ${error.message}`;
    console.error(message);
    res.status(500).json({ message });
});

export { app }; 
