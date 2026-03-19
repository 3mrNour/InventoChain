const express = require("express");
const orderTrackingController = require("../controllers/orderTracking.controller");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const router = express.Router();
const userRoles = require("../utils/userRoles");

router.route("/").get(verifyToken, allowedTo(userRoles.ADMIN));

module.exports=router