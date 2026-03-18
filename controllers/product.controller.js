const Product = require("../models/product.model");
const { validationResult } = require("express-validator");
const HttpResponseText = require("../utils/HttpResponseText");

const getAllProducts = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  try {
    const allProducts = await Product.find({}, { _v: false })
      .populate("supplierId", "name phone")
      .limit(limit)
      .skip(skip);
    res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { products: allProducts },
    });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: HttpResponseText.ERROR,
      data: { ValidationErrors: errors.array() },
    });
  }

  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({
      status: HttpResponseText.SUCCESS,
      data: { product: newProduct },
    });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "supplierId",
    );
    if (!product) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "Product Not Found" },
      });
    }
    res
      .status(200)
      .json({ status: HttpResponseText.SUCCESS, data: { product } });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { ...req.body } },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "Product Not Found" },
      });
    }

    return res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { product: updatedProduct },
    });
  } catch (err) {
    return res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "Product Not Found" },
      });
    }

    return res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { product: deletedProduct },
    });
  } catch (err) {
    return res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const products = await Product.find({ supplierId });
    if (!products) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "Product Not Found" },
      });
    }
    res
      .status(200)
      .json({ status: HttpResponseText.SUCCESS, data: { products } });
  } catch (err) {
    return res
      .status(500)
      .json({ status: HttpResponseText.ERROR, message: err, code: 500 });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySupplier,
};
