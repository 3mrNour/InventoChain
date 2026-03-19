const authController = require("../controllers/auth.controller");
const { authValidation } = require("../middlewares/auth.validation");
const express = require("express");

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/register").post(authValidation, authController.register);

module.exports = router;
