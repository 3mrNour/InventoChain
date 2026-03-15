const Supplier = require("../models/suppplier.model");
// const { mowared } = require("../data/data");
const { body, validationResult } = require("express-validator");

const getAllSuppliers = async (req, res) => {
  const allSuppliers = await Supplier.find();
   res.status(200).json(allSuppliers);
};

const createSupplier = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.array().isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, phone ,address} = req.body;
  const newSupplier = new Supplier({ name, email, phone ,address});
  try {
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const patchSupplier = async (req, res) => {}
  

module.exports = { getAllSuppliers, createSupplier };
