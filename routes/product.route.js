const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();
const {
  addProductValidation,
  updateProductValidation,
} = require("../middlewares/product.validation");
const { body } = require("express-validator");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(addProductValidation, productController.addProduct);

router
  .route("/:productId")
  .get(productController.getProductById)
  .patch(updateProductValidation, productController.updateProduct)
  .delete(productController.deleteProduct);

router.get("/supplier/:supplierId", productController.getProductsBySupplier);

module.exports = router;
