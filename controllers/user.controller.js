const User = require("../models/user.model");
const HttpResponseText = require("../utils/HttpResponseText");
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res
      .status(200)
      .json({ status: HttpResponseText.SUCCESS, data: { users: allUsers } });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

module.exports = { getAllUsers };
