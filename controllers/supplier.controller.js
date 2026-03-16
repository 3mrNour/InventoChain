const Supplier = require("../models/suppplier.model");
// const { mowared } = require("../data/data");
const { validationResult } = require("express-validator");

const getAllSuppliers = async (req, res) => {
  try {
    const allSuppliers = await Supplier.find();
    res.status(200).json(allSuppliers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const addSupplier = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, phone, email, address } = req.body;
  try {
    const addedSupplier = new Supplier({ name, phone, email, address });
    await addedSupplier.save();
    res.status(201).json({ message: "Added Sucsessfully", addedSupplier });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier Not Found" });
    }
    res.status(200).json(supplier);
  } catch (err) {
    res.status(400).json({ message: "Invalid Object ID" });
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
      { new: true, runValidators: true },
    );
    return res
      .status(200)
      .json({ message: "Updated Sucsessfully", updatedSupplier });
  } catch (err) {
    return res.status(400).json({ error: err, message: "Invalid Object ID" });
  }
};
const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Deleted Sucsessfully", deletedSupplier });
  } catch (err) {
    return res.status(400).json({ error: err, message: "Invalid Object ID" });
  }
};

module.exports = {
  getAllSuppliers,
  addSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
