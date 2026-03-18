const express = require("express");
const { body } = require("express-validator");
const orderController = require("../controllers/order.controller");
const placeOrderValidation = require("../middlewares/order.validation");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router
  .route("/")
  .get(verifyToken,orderController.getOrders)
  .post(placeOrderValidation, orderController.PlaceOrder);
router.route("/:orderId").get(orderController.getOrderById);

module.exports = router;
