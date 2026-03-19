const express = require("express");
const supplierController = require("../controllers/supplier.controller");
const addSupplierValidation = require("../middlewares/supplier.validation");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/userRoles");
const router = express.Router();

router
  .route("/")
  .get(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.USER),
    supplierController.getAllSuppliers,
  )
  .post(
    verifyToken,
    allowedTo(userRoles.ADMIN),
    addSupplierValidation,
    supplierController.addSupplier,
  );

router
  .route("/:supplierId")
  .get(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.USER),
    supplierController.getSupplierById,
  )
  .patch(
    verifyToken,
    allowedTo(userRoles.ADMIN),
    supplierController.updateSupplier,
  )
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN),
    supplierController.deleteSupplier,
  );
module.exports = router;
