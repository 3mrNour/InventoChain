const User = require("../models/user.model");
const HttpResponseText = require("../utils/HttpResponseText");
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}, { _v: false, password: false });
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

const getUserById = async (req, res) => {
  try {
    // استخدمت الـ params زي ما عملت في الـ getOrderById
    const user = await User.findById(req.params.userId, {
      __v: false,
      password: false,
    });

    if (!user) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "User Not Found!" },
      });
    }

    res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { user: user },
    });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { returnDocument: "after" },
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "User Not Found!" },
      });
    }

    res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { user: updatedUser },
    });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "User Not Found!" },
      });
    }

    res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { message: "User Deleted Successfully" },
    });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
