const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isValidString } = require("./utils/validation");
const { Users } = require("./utils/Users");

let users = new Users();

// Configuration constants
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Static files middleware
app.use(express.static(publicPath));

app.get("/test", (req, res) => {
  res.sendFile(path.join(publicPath, "test.html"));
});

// Socket methods
io.on("connection", socket => {
  console.log("New user connected:");

  socket.on("join", ({ name, room }, callback) => {
    if (!(isValidString(room) && isValidString(name))) {
      callback("Name and room are required.");
    }
    socket.join(room);
    users = users.removeUser(socket.id).addUser(socket.id, name, room);

    io.to(room).emit("updateUsersList", users.getUsersFor(room));

    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat room.")
    );

    socket.broadcast
      .to(room)
      .emit("newMessage", generateMessage("Admin", `${name} has joined.`));
    callback();
  });

  socket.on("createMessage", (newMessage, callback) => {
    console.log("Create Message: ", newMessage);

    io.emit("newMessage", generateMessage(newMessage.from, newMessage.text));

    callback();
  });

  socket.on("createLocationMessage", ({ latitude, longitude }) => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", latitude, longitude)
    );
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected.");
    const user = users.getUser(socket.id);
    if(user) {
      users = users.removeUser(socket.id);
      io.to(user.room).emit("updateUsersList", users.getUsersFor(user.room))
      io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left.`))
    }
    
  });
});

server.listen(port, () => {
  console.log(`Up and Running on port ${port}.`);
});
