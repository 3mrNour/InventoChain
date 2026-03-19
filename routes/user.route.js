const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const {updateUser} = require("../middlewares/auth.validation");
const express = require("express");

const router = express.Router();

router.route("/").get(userController.getAllUsers);

router
  .route("/:userId")
  .get(userController.getUserById)
  .patch(updateUser, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
