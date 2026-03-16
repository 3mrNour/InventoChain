const express = require("express");
const supplierController = require("../controllers/supplier.controller");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router
  .route("/")
  .get(supplierController.getAllSuppliers)
  .post(
    [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name Must Added")
        .isLength({ min: 2, max: 500 })
        .withMessage("Name Must be between 2 and 500 charachters")
        .isString()
        .withMessage("Name Must Be String"),
      body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone Must Added")
        .isMobilePhone("ar-EG")
        .withMessage("Please Proivde a valid phone number"),
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email Must Added")
        .isEmail()
        .withMessage("Add Valid Email"),
      body("address")
        .trim()
        .notEmpty()
        .withMessage("Address Must Added")
        .isLength({ min: 5, max: 2500 })
        .withMessage("Address Must be between 500 and 2500 charachters")
        .isString()
        .withMessage("Address Must Be String"),
    ],
    supplierController.addSupplier,
  );
router
  .route("/:supplierId")
  .get(supplierController.getSupplierById)
  .patch(supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier);
module.exports = router;
