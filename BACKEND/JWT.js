require("dotenv").config({ path: "./config.env" });
const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  console.log(user);
  const accessToken = sign({ email: user.email }, process.env.SECRET_KEY);
  return accessToken;
};

const validateToken = (req, res, next) => {;
  const accessToken = req.cookies["access-token"];
  console.log(req.cookies);
  console.log("Token  " + accessToken);
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const validToken = verify(accessToken, process.env.SECRET_KEY);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }

};

module.exports = { createTokens, validateToken };
