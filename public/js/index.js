const formatTime = time => moment(time).format("h:mm a");

const socket = io();

const createLi = () => $("<li></li>");
socket.on("connect", () => {
  console.log("Connected to the server.");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});

socket.on("newMessage", message => {
  console.log("New Message.", message);

  const formattedTime = formatTime(message.createdAt);
  const li = createLi().text(`${message.from}  @ ${formattedTime}: ${message.text}`);

  $("#messages").append(li);
});

socket.on("newLocationMessage", message => {
  const li = createLi();
  const a = $("<a target='blank'>My current location</a>");

  const formattedTime = formatTime(message.createdAt);

  li.text(`${message.from} @ ${formattedTime}: `);
  a.attr("href", message.url);

  li.append(a);
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
    () => {
      messageInput.val("");
    }
  );
});

const locationButton = $("#send-location");
locationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  locationButton.attr("disabled", "disabled").text("Sending location...");

  const removeDisabledAtrr = () => locationButton.removeAttr("disabled").text("Send location");

  navigator.geolocation.getCurrentPosition(
    position => {
      removeDisabledAtrr();

      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    error => {
      removeDisabledAtrr();
      alert("Unable to fetch location: " + error.message);
    }
  );
});
