const express = require("express");
const orderTrackingController = require("../controllers/orderTracking.controller");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const router = express.Router();
const userRoles = require("../utils/userRoles");

router
  .route("/:orderId")
  .get(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.SUPPLIER),
    orderTrackingController.getOrderStatus,
  )
  .post(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.SUPPLIER),
    orderTrackingController.updateStatus,
  );

module.exports = router;
