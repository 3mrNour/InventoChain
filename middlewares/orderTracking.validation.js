const { body } = require("express-validator");
const orderStatus = require("../utils/orderStatus");
const updateOrderStatus = [
  body("status").isIn([
    orderStatus.PENDING,
    orderStatus.SHIPPED,
    orderStatus.DELIVERED,
    orderStatus.CANCELLED,
  ]),
];

module.exports = updateOrderStatus;
