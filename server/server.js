import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import path from "path";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

import aiChatRouter from "./routes/aiChat.js";

import dotenv from 'dotenv';
dotenv.config(); // Load env vars from .env


//Create Express app and Http server
const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

//Store online users
export const userSocketMap = {}; //{userId: socketId}

//Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


//Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());


//Routes setup
app.use("/api/status", (req, res)=> res.send("Server is live"));
app.use("/api/auth", userRouter); 
app.use("/api/messages", messageRouter);

app.use("/api/aiChat", aiChatRouter); 

//Connect to MongoDB
try {
  await connectDB();
} catch (error) {
  console.error("Failed to connect to DB", error);
  process.exit(1);
}



const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  })
}
server.listen(PORT, ()=> console.log("Server is running on PORT: " + PORT));

