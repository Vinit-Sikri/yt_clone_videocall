import express from "express"
import mongoose from "mongoose"
import dontenv from "dotenv"
import cors from 'cors'
import bodyParser from "body-parser"
import userRoutes from './routes/user.js'
import videoRoutes from './routes/video.js'
import commentsRoutes from './routes/comments.js'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'

dontenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use('/uploads', express.static(path.join('uploads')))

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["https://6690e70b521c87f6288b716f--guileless-otter-82d908.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  socket.emit("me", socket.id)

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  })

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
  })

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })
})

app.get('/', (req, res) => {
  res.send("hello")
})
app.use(bodyParser.json())

app.use('/user', userRoutes)
app.use('/video', videoRoutes)
app.use('/comment', commentsRoutes)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server Running on the PORT ${PORT}`)
  console.log("Video Call Server is running on port 5000")
})

const DB_URL = process.env.CONNECTION_URL
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("MongoDB database connected")
}).catch((error) => {
  console.log(error)
})