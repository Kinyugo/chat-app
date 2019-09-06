const expect = require("expect");
const { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("Should generate correct message object", () => {
    const from = "jen";
    const text = "I miss you.";

    const message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({
      from,
      text
    });
  });
});

describe("generateLocationMessage", () => {
  it("Should generate correct message with a valid url", () => {
    const latitude = 32.323434;
    const longitude = -32.323434;
    const from = "test"

    var url = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const locationMessage = generateLocationMessage(from, latitude, longitude);

    expect(typeof locationMessage.url).toBe("string");

    expect(locationMessage).toMatchObject({
      from,
      url
    })
  })
})
