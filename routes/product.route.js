const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();
const { body } = require("express-validator");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Name must be a string"),

      body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

      body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number")
        .custom((value) => value >= 0)
        .withMessage("Price cannot be negative"),

      body("quantity")
        .notEmpty()
        .withMessage("Stock quantity is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a positive integer"),

      body("category").trim().notEmpty().withMessage("Category is required"),

      body("supplierId")
        .trim()
        .notEmpty()
        .withMessage("Supplier ID is required")
        .isMongoId()
        .withMessage("Invalid Supplier ID format"),
    ],
    productController.addProduct,
  );

router
  .route("/:productId")
  .get(productController.getProductById)
  .patch(
    [
      body("price")
        .optional()
        .isNumeric()
        .withMessage("Price must be a number"),
      body("quantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be positive"),
    ],
    productController.updateProduct,
  )
  .delete(productController.deleteProduct);

router.get("/supplier/:supplierId", productController.getProductsBySupplier);

module.exports = router;
