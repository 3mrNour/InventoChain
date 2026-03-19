const Order = require("../models/order.model");
const Product = require("../models/product.model");
const HttpResponseText = require("../utils/HttpResponseText");
const orderStatus = require("../utils/orderStatus");
const OrderTracking = require("../models/tracking.model");
const updateOrderStatus = require("../middlewares/orderTracking.validation");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

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
    if (!req.headers.authorization) {
      throw new Error("Token must be provided");
    }
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, process.env.JWT_SECRET_KEY).id;

    const { items } = req.body;
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

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOps);
    const newTracking = new OrderTracking({
      order: newOrder._id,
      status: orderStatus.PENDING,
      statusHistory: [
        {
          status: orderStatus.PENDING,
          message:
            "Order has been created successfully and is awaiting processing.",
          timestamp: new Date(),
        },
      ],
    });
    await newTracking.save();
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

