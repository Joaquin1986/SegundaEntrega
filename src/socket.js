import { Server } from "socket.io";
import { Product, ProductManager } from "./ProductManager.js";

const pm1 = new ProductManager("./src/products.json");

export const init = (httpServer) => {
    pm1.getProducts().then((products) => {
        const socketServer = new Server(httpServer);
        socketServer.on("connection", (socketClient) => {
            console.log(`Cliente conectado exitosamente 👍: id #${socketClient.id}`);
            socketClient.emit('products', { products });
            socketClient.on('product', (prod) => {
                const productoAgregar = new Product(prod.title, prod.description,
                    prod.price, prod.code, prod.stock);
                pm1.addProduct(productoAgregar).then(() => {
                    socketServer.emit('products', { products });
                });
            });
        });
    });
};