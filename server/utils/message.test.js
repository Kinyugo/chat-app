const expect = require("expect");
const { generateMessage } = require("./message");

describe("generateMessage", () => {
  it("Should generate correct message object", () => {
    const from = "jen";
    const text = "I miss you.";

    const message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe("string");
    expect(message).toMatchObject({
      from,
      text
    });
  });
});
