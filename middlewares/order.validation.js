const { body } = require("express-validator");

const placeOrderValidation = [

  body("items")
    .isArray()
    .withMessage("Items must be provided in array form!")
    .isLength({ min: 1 })
    .withMessage("Order placed with at least 1 items!"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID is required for each item")
    .isMongoId()
    .withMessage("Invalid Product ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

module.exports = placeOrderValidation;
