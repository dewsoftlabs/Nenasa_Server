const jwt = require("jsonwebtoken");

function getToken(email, time) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: time }); // Change expiresIn as needed
}

module.exports = { getToken };
