const socket = io();

socket.on("connect", () => {
  console.log("Connected to the server.");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});

socket.on("newMessage", message => {
  console.log("New Message.", message);

  let li = $("<li></li>");
  li.text(`${message.from} : ${message.text}`)

  $("#messages").append(li);
});

$("#message-form").on("submit", e => {
    const messageInput = $("[name=message]");
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "user",
      text: messageInput.val()
    },
    (data) => {
        console.log("Server says: ", data);
    }
  );

  messageInput.val("");
});
