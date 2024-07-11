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

app.use(cors({
  origin: 'https://66900e4a521c870d908b6444--guileless-otter-82d908.netlify.app/',
  methods: ["GET", "POST"]
}));

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use('/uploads', express.static(path.join('uploads')));

// Video call addition
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://668edc57330b7a410a1576ed--guileless-otter-82d908.netlify.app/',
    methods: ["GET", "POST"]
  }
});

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

const VIDEO_CALL_PORT = process.env.VIDEOCALLPORT || 5000;
server.listen(VIDEO_CALL_PORT, () => console.log(`Video call server is running on port ${VIDEO_CALL_PORT}`));

app.get('/', (req, res) => {
  res.send("hello");
});
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const DB_URL = process.env.CONNECTION_URL;
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB database connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
