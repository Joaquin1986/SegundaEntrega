import http from "http";
import { app } from "./app.js"
import { init } from "./socket.js";
import { init as initMongoDB } from "./db/mongodb.js";

await initMongoDB();

const PORT = 8080;
export const server = http.createServer(app);

init(server);

server.listen(PORT, () => console.log((`El servidor está trabajando en el puerto ${PORT} ✅`)));