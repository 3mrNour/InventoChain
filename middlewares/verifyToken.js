const jwt = require("jsonwebtoken");
const HttpResponseText = require("../utils/HttpResponseText.js");
const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({
      status: HttpResponseText.FAIL,
      data: { message: "Invalid Token,Sign in again" },
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: HttpResponseText.ERROR, data: { message: err.message } });
  }
};

module.exports = verifyToken;
