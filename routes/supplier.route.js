const express = require("express");
const supplierController = require("../controllers/supplier.controller");
const addSupplierValidation = require("../middlewares/supplier.validation");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/userRoles");
const router = express.Router();

router
  .route("/")
  .get(supplierController.getAllSuppliers)
  .post(addSupplierValidation, supplierController.addSupplier);
router
  .route("/:supplierId")
  .get(supplierController.getSupplierById)
  .patch(supplierController.updateSupplier)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN),
    supplierController.deleteSupplier,
  );
module.exports = router;
