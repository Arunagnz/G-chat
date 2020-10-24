const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const emoji = require("node-emoji");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => res.sendFile(__dirname + "/public/index.html"));

const users = {};

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  socket.emit("bot", "Welcome to G-chat");

  socket.on("connected", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connect", name);
  });

  socket.on("chat-msg", (message) => {
    socket.broadcast.emit("message", {
      message: emoji.emojify(message),
      name: users[socket.id],
    });
  });

  socket.on("my-msg", (message) => {
    socket.emit("my-message", { message: emoji.emojify(message), name: "You" });
  });

  socket.on("disconnect", () => {
    if (users[socket.id])
      socket.broadcast.emit("user-disconnect", users[socket.id]);
  });
});

server.listen(PORT, () =>
  console.log(`Server is up and running on port : ${PORT}`)
);
