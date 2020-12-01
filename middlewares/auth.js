require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");
const Logger = require(path.join(__dirname, "..", "logger")).createLogger();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (e) {
    Logger.error(e);
    res.status(401).send("wrong token");
  }
};
