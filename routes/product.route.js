const express = require("express");
const productController = require("../controllers/product.controller");
const userRoles = require('../utils/userRoles')
const router = express.Router();
const {
  addProductValidation,
  updateProductValidation,
} = require("../middlewares/product.validation");
const { body } = require("express-validator");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.SUPPLIER),
    addProductValidation,
    productController.addProduct,
  );

router
  .route("/:productId")
  .get(productController.getProductById)
  .patch(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.SUPPLIER),
    updateProductValidation,
    productController.updateProduct,
  )
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.SUPPLIER),
    productController.deleteProduct,
  );

router.get(
  "/supplier/:supplierId",
  verifyToken,
  productController.getProductsBySupplier,
);

module.exports = router;
