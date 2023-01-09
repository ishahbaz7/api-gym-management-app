const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  var auth = req.get("Authorization");
  var token;
  if (auth) {
    token = auth.split(" ")[1];
  }
  console.log(token);
  var decodeToken;
  try {
    decodeToken = jwt.verify(token, "e0ba87d5-467e-4695-ac74-4605de04aaa4");
    console.log("decodeToken", decodeToken);
  } catch (error) {
    console.log(error);
  }
  if (!decodeToken) {
    return res.status(401).json("Unauthorized!");
  }
  next(decodeToken);
};
