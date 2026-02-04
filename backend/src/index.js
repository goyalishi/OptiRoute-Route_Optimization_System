import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
    },
});

app.set("io", io); 

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

connectDB()
    .then(() => {
        httpServer.listen(process.env.PORT || 5000, () => {
            console.log(`server is listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => console.log("Mogodb connection failed 😩", err));