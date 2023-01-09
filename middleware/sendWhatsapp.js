const twilio = require("twilio");

const client = new twilio(
  "ACeace829360760e83531cfb908a1b8efd",
  "69c60355ddd9595d7e893c0fa91440e5"
);

client.message
  .create({
    from: "whatsapp:+918983837783",
    message: "this is whatsapp message",
    to: `whatsapp:+918983837783`,
  })
  .then((message) => console.log(message))
  .catch((err) => console.log(err));
