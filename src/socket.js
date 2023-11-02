import { Server } from "socket.io";

export const init = (httpServer) => {
    const socketServer = new Server(httpServer);
    socketServer.on("connection", (socketClient) => {
        console.log(`Cliente conectado exitosamente 👍: id #${socketClient.id}`);
    });
};