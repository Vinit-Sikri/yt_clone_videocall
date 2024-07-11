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
const io = new Server(server, {
  cors: {
    origin: "https://66901091e471f911613fb5d0--guileless-otter-82d908.netlify.app",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

io.on("connection", (socket) => {
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

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.CONNECTION_URL;

app.get('/', (req, res) => {
  res.send("hello");
});

app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentsRoutes);

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

server.listen(5000, () => console.log("Video call server is running on port 5000"));
