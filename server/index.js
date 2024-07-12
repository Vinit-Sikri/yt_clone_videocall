import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import bodyParser from "body-parser";
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentsRoutes from './routes/comments.js';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Update the CORS origin to your frontend URL
const io = new Server(server, {
  cors: {
    origin: "https://6690e70b521c87f6288b716f--guileless-otter-82d908.netlify.app",
    methods: ["GET", "POST"],
  },
});

// Middleware setup
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Socket.io setup
io.on("connection", (socket) => {
  console.log('New client connected:', socket.id);
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// Define API routes
app.get('/', (req, res) => {
  res.send("hello");
});
app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentsRoutes);

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.CONNECTION_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB database connected");
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Start the Socket.io server on the appropriate port
const SOCKET_IO_PORT = 5000;
server.listen(SOCKET_IO_PORT, () => console.log(`Video call server is running on port ${SOCKET_IO_PORT}`));
