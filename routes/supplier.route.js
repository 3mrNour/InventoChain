const express = require("express");
const supplierController = require("../controllers/supplier.controller");
const addSupplierValidation = require("../middlewares/supplier.validation");
const router = express.Router();

router
  .route("/")
  .get(supplierController.getAllSuppliers)
  .post(addSupplierValidation, supplierController.addSupplier);
router
  .route("/:supplierId")
  .get(supplierController.getSupplierById)
  .patch(supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier);
module.exports = router;
