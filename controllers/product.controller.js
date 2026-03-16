const Product = require("../models/product.model");
const { validationResult } = require("express-validator");

// 1. جلب كل المنتجات (للزباين أو الأدمن)
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find().populate(
      "supplierId",
      "name phone",
    ); // حركة زيادة عشان تظهر اسم المورد مع المنتج
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. إضافة منتج جديد (بواسطة المورد)
const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // بناخد البيانات بما فيها الـ stock والـ supplierId
    const newProduct = new Product(req.body);
    await newProduct.save();

    res.status(201).json({
      message: "Product Added Successfully",
      addedProduct: newProduct,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 3. جلب منتج معين بالتفاصيل
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "supplierId",
    );
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid Product ID" });
  }
};

// 4. تحديث المنتج (تعديل سعر، زيادة مخزون Stock، إلخ)
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { ...req.body } },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    return res.status(200).json({
      message: "Product Updated Successfully",
      updatedProduct,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ error: err.message, message: "Invalid Product ID" });
  }
};

// 5. مسح منتج من السوق
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    return res.status(200).json({
      message: "Product Deleted Successfully",
      deletedProduct,
    });
  } catch (err) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }
};

// 6. ميزة إضافية: جلب منتجات مورد معين (الـ Inventory بتاعه)
const getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const products = await Product.find({ supplierId });
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: "Error fetching supplier inventory" });
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
