const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const moment = require("moment");

// Configuration constants
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Static files middleware
app.use(express.static(publicPath));

// Socket methods
io.on("connection", socket => {
  console.log("New user connected:");

  socket.on("createMessage", newMessage => {
    console.log("Create Message: ", newMessage);

    io.emit("newMessage", {
      from: newMessage.from,
      text: newMessage.text,
      createdAt: moment().format("dddd, hA")
    });
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected.");
  });
});

server.listen(port, () => {
  console.log(`Up and Running on port ${port}.`);
});
