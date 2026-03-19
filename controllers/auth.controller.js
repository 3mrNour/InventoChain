const User = require("../models/user.model");
const HttpResponseText = require("../utils/HttpResponseText");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const generatedJWT = require("../utils/generateJWT");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: HttpResponseText.FAIL,
        data: { message: "Email and password are required" },
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        status: HttpResponseText.FAIL,
        data: { message: "Invalid email or Password" },
      });
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return res.status(401).json({
        status: HttpResponseText.FAIL,
        data: { message: "Invalid email or Password" },
      });
    }
    const token = await generatedJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { message: "welcome", token: token },
    });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    const { firstName, lastName, email, password, role } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: HttpResponseText.FAIL,
        data: { ValidationErrors: errors.array() },
      });
    }
    const isExsistingUser = await User.findOne({ email: email });
    if (isExsistingUser) {
      return res.status(400).json({
        status: HttpResponseText.FAIL,
        data: { message: "Email already exsists" },
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    newUser.token = await generatedJWT({
      email: newUser.email,
      id: newUser._id,
      role: newUser.role,
    });
    await newUser.save();
    res
      .status(200)
      .json({ status: HttpResponseText.SUCCESS, data: { user: newUser } });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

module.exports = { login, register };
