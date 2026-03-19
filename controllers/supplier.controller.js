const Supplier = require("../models/suppplier.model");
const Product = require("../models/product.model");
const HttpResponseText = require("../utils/HttpResponseText");
const { validationResult } = require("express-validator");
const { $where } = require("../models/user.model");

const getAllSuppliers = async (req, res) => {
  try {
    const allSuppliers = await Supplier.find({}, { __v: false });
    res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { suppliers: allSuppliers },
    });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const addSupplier = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: HttpResponseText.FAIL,
      data: { ValidationErrors: errors.array() },
    });
  }
  const { name, phone, email, address } = req.body;
  try {
    const addedSupplier = new Supplier({ name, phone, email, address });
    await addedSupplier.save();
    res.status(201).json({
      status: HttpResponseText.SUCCESS,
      data: { supplier: addedSupplier },
    });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId, {
      __v: false,
    });
    if (!supplier) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "Supplier Not Found!" },
      });
    }
    res
      .status(200)
      .json({ status: HttpResponseText.SUCCESS, data: { supplier: supplier } });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      {
        $set: { ...req.body },
      },
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedSupplier) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "Supplier Not Found!" },
      });
    }
    return res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { supplier: updatedSupplier },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: HttpResponseText.ERROR, message: err, code: 500 });
  }
};
const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);
    if (!deletedSupplier) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "Supplier Not Found!" },
      });
    }

    // Delete Products of Deleted Supplier
    //====================================
    // const deletedProducts = await Product.deleteMany({
    //   supplierId: supplierId,
    // });
    // supplierProducts: deletedProducts

    return res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { supplier: deletedSupplier },
    });
  } catch (err) {
    return res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

module.exports = {
  getAllSuppliers,
  addSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
