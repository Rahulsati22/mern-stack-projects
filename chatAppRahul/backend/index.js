const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/errormiddleware");
dotenv.config();
const port = 8000;
const mongooseConnection = require("./config/mongoose");
const user = require("./routes/userRoutes");
const chat = require("./routes/chatRoutes");
const message = require("./routes/messageRoutes");
app.use(express.json());
app.get("/", function (request, response) {
  return response.send("hello world");
});
app.use("/api/user", user);
app.use("/api/chat", chat);
app.use("/api/message", message);
app.use(notFound);
app.use(errorHandler);
const server = app.listen(port, function (error) {
  if (error) {
    console.log(error);
    return;
  }
  console.log(`running on port ${port}`);
});

const io = require("socket.io")(server, {
  pingOut: "60000",
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket io");
  socket.on("setup", (userData) => {
    // it will create a separate room for the user
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    // creating room for the user in which it will send messages
    socket.join(room);
    console.log("user successfully joined the room");
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat users is not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
