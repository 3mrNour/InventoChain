const jwt = require("jsonwebtoken");
const HttpResponseText = require("../utils/HttpResponseText");
module.exports = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        throw new Error("Header must be provided");
      }
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const authrozied = roles.find((role) => {
        return role === decodedToken.role;
      });
      if (!authrozied) {
        return res.status(401).json({
          status: HttpResponseText.FAIL,
          data: { message: "Not Authorized!" },
        });
      }
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ status: HttpResponseText.ERROR, message: error.message });
    }
  };
};
