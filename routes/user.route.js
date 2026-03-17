const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const express = require("express");

const router = express.Router();

router.route("/").get(userController.getAllUsers);

module.exports = router;
