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

  socket.emit("newMessage", {
    from: "johnny cage",
    text: "Hey, I miss you.",
    createdAt: moment().format("ddd, hA")
  });

  socket.on("createMessage", newMessage => {
    console.log("Create Message: ", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected.");
  });
});

server.listen(port, () => {
  console.log(`Up and Running on port ${port}.`);
});
