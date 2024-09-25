require("dotenv").config({ path: "./config.env" });
const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  console.log(user);
  const accessToken = sign({ email: user.email }, process.env.SECRET_KEY,{ expiresIn: '30d' });
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.headers["authorization"];
  
  if (!accessToken) {
    return res.status(401).json({status:false, message: "Login To Proceed" });
  }

  const token = accessToken.split(" ")[1]; // Extract token from 'Bearer <token>'
  
  try {
    const validToken = verify(token, process.env.SECRET_KEY);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: "Invalid Token" });
  }
};

module.exports = { createTokens, validateToken };
