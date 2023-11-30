import { Router } from "express";
import { CartManager } from "../../dao/CartManager.js";

const router = Router();

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    if (cid) {
        let cart = await CartManager.getCartById(cid);
        const cartArr = { ...cart }; // DESTRUCT DEL OBJETO OBTENIDO MEDIANTE LA CONSULTA A MONGODB
        cart = []; //LIMPIAMOS EL CART PREVIO PARA PASARLE ÚNICAMENTE LO QUE NECESITAMOS A HANDLEBARS
        cartArr[0].products.map((prod) => {
            cart.push(prod);
        });
        res.render('carts', { title: 'Vista de Carrito 🛒', cart, cid });
    }
});

export { router }