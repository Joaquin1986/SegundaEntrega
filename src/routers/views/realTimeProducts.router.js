import { Router } from "express";

const router = Router();

router.get("/realtimeproducts", (req, res) => {
    res.render('realTimeProducts', { title: 'Alta de Producto en Tiempo Real ⌚' });
});

export { router };