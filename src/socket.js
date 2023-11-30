import { Server } from "socket.io";
import { Product, ProductManager } from "./dao/ProductManager.js";

export const init = async (httpServer) => {
    const products = await ProductManager.getProducts();
    const socketServer = new Server(httpServer);
    socketServer.on("connection", (socketClient) => {
        console.log(`Cliente conectado exitosamente 👍: id #${socketClient.id}`);
        socketClient.emit('products', products);
        socketClient.on('product', async (prod) => {
            const productoAgregar =
                new Product(
                    prod.title,
                    prod.description,
                    prod.price,
                    prod.code,
                    prod.stock
                );
            await ProductManager.addProduct(productoAgregar);
            let result = await ProductManager.getProducts();
            console.log (result);
            socketServer.emit('products', result);
        });
    });
};