const { body } = require("express-validator");

const authValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .trim(),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isStrongPassword()
    .withMessage("Password is too weak (use letters, numbers & symbols)"),
  body("role")
    .optional()
    .isIn(["USER", "SUPPLIER", "ADMIN"])
    .withMessage("Invalid user role"),
];
const updateUser = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string")
    .trim(),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .optional()
    .isIn(["USER", "SUPPLIER", "ADMIN"])
    .withMessage("Invalid user role"),
];
module.exports = { authValidation, updateUser };
