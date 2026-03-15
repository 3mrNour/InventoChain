const express = require("express");
const supplierController = require("../controllers/supplier.controller");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.route("/").get(supplierController.getAllSuppliers);
module.exports = router;
