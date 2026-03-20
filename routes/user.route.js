const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const { updateUser } = require("../middlewares/auth.validation");
const userRoles = require('../utils/userRoles')

const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");

const router = express.Router();

router
  .route("/")
  .get(verifyToken, allowedTo(userRoles.ADMIN), userController.getAllUsers);

router
  .route("/:userId")
  .get(verifyToken, allowedTo(userRoles.ADMIN), userController.getUserById)
  .patch(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.USER),
    updateUser,
    userController.updateUser,
  )
  .delete(verifyToken, allowedTo(userRoles.ADMIN), userController.deleteUser);

module.exports = router;
