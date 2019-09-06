const formatTime = time => moment(time).format("h:mm a");

const scrollToBottom = () => {
  // selectors
  const messages = $("#messages");
  const newMessage = messages.children("li:last-child");

  // height calculations
  const clientHeight = messages.prop("clientHeight");
  const scrollTop = messages.prop("scrollTop");
  const scrollHeight = messages.prop("scrollHeight");
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

const socket = io();

const createLi = () => $("<li></li>");
socket.on("connect", () => {
  console.log("Connected to the server.");
  const params = jQuery.deparam(window.location.search);
  socket.emit("join", params, err => {
    if(err) {
      alert(err);
      window.location.href = "/";
    }else {
      console.log("No Error.");
    }
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server.");
  $("#user").html('');
});

socket.on("updateUsersList", users => {
  const ol = $("<ol></ol>");
  users.forEach(user => {
    ol.append($("<li></li>").text(user))
  })
  $("#user").append(ol);
})

socket.on("newMessage", ({ text, from, createdAt }) => {
  const template = $("#message-template").html();
  const html = Mustache.render(template, {
    text,
    from,
    createdAt: formatTime(createdAt)
  });

  $("#messages").append(html);
  scrollToBottom();
});

socket.on("newLocationMessage", ({ from, url, createdAt }) => {
  const template = $("#location-message-template").html();
  const html = Mustache.render(template, {
    url,
    from,
    createdAt: formatTime(createdAt)
  });

  $("#messages").append(html);
  scrollToBottom();

});

$("#message-form").on("submit", e => {
  const messageInput = $("[name=message]");

  e.preventDefault();
  socket.emit(
    "createMessage",
    {
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

  const removeDisabledAtrr = () =>
    locationButton.removeAttr("disabled").text("Send location");

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
