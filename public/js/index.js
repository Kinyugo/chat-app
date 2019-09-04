const socket = io();

socket.on("connect", () => {
  console.log("Connected to the server.");

  socket.emit("createMessage", {
    from: "Kitana",
    text: "I miss you too babe."
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});

socket.on("newMessage", message => {
  console.log("New Message.", message);
});
