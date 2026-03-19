// const Product = require("../models/product.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const HttpResponseText = require("../utils/HttpResponseText");
const { validationResult } = require("express-validator");

const getOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({}, { _v: false });
    res
      .status(200)
      .json({ status: HttpResponseText.SUCCESS, data: { orders: allOrders } });
  } catch (err) {
    return res
      .status(500)
      .json({ status: HttpResponseText.ERROR, message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId, { _v: false });
    if (!order) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "Order Not Found" },
      });
    }
    res.status(200).json({ status: HttpResponseText.SUCCESS, data: { order } });
  } catch (err) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: err.message,
      code: 500,
    });
  }
};

const PlaceOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: HttpResponseText.ERROR,
      data: { ValidationErrors: errors.array() },
    });
  }

  try {
    const { userId, items } = req.body;
    let totalPriceCalculator = 0;
    for (const item of items) {
      let productExist = await Product.findById(item.productId);
      if (!productExist) {
        return res.status(404).json({
          status: HttpResponseText.FAIL,
          data: { message: `Product with id ${item.productId} is not found` },
        });
      }
      if (productExist.quantity < item.quantity) {
        return res.status(400).json({
          status: HttpResponseText.FAIL,
          data: { message: `Insufficient stock` },
        });
      }
      const name = productExist.name;
      const price = productExist.price;

      totalPriceCalculator += productExist.price * item.quantity;
      item.name = name;
      item.priceAtPurchase = price;
      item.supplierId = productExist.supplierId;
    }
    const newOrder = new Order({
      userId,
      items,
      totalPrice: totalPriceCalculator,
    });
    await newOrder.save();
    res
      .status(201)
      .json({ status: HttpResponseText.SUCCESS, data: { order: newOrder } });
  } catch (error) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: error.message,
    });
  }
};
module.exports = { getOrders, getOrderById, PlaceOrder };

//اللي فاضل في المشروع (Place Order and API , Inventory Updates & shipment tracking , تقفيل الراوتس مع الرولز)
