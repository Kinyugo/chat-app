const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");

// Configuration constants
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
// Formatted time
const time = () => () => moment().format("ddd, hA");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Static files middleware
app.use(express.static(publicPath));

app.get("/test", (req, res) => {
  res.sendFile(path.join(publicPath, "test.html"));
})

// Socket methods
io.on("connection", socket => {
  console.log("New user connected:");

  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat room.")
  );

  socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined."));

  socket.on("createMessage", (newMessage, callback) => {
    console.log("Create Message: ", newMessage);

    io.emit("newMessage", generateMessage(newMessage.from, newMessage.text));

    callback();
  });

  socket.on("createLocationMessage", ({latitude, longitude}) => {
    io.emit("newLocationMessage", generateLocationMessage("Admin", latitude, longitude));
  })

  socket.on("disconnect", () => {
    console.log("User was disconnected.");
  });
});

server.listen(port, () => {
  console.log(`Up and Running on port ${port}.`);
});
