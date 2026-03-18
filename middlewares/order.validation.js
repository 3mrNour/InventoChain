const { body } = require("express-validator");

const placeOrderValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID Must be Filled")
    .isMongoId()
    .withMessage("Invalid objectID"),

  body("items").isLength({ min: 1 }),

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
