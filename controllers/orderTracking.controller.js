const Order = require("../models/order.model");
const OrderTracking = require("../models/tracking.model.js");
const Product = require("../models/product.model");
const HttpResponseText = require("../utils/HttpResponseText");
const { validationResult } = require("express-validator");
const updateOrderStatus = require("../middlewares/orderTracking.validation");
const jwt = require("jsonwebtoken");
const orderStatus = require("../utils/orderStatus");

const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const tracking = await OrderTracking.findOne({ order: orderId }).populate(
      "order",
      "_id userId totalPrice items createdAt",
    );

    if (!tracking) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "No tracking records found for this order." },
      });
    }

    res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: { tracking },
    });
  } catch (error) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: error.message,
    });
  }
};
const updateStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: HttpResponseText.ERROR,
      data: { ValidationErrors: errors.array() },
    });
  }

  try {
    const { orderId } = req.params;
    const { status, message } = req.body;

    const order = await Order.findById(orderId);
    const tracking = await OrderTracking.findOne({ order: orderId });

    if (!order || !tracking) {
      return res.status(404).json({
        status: HttpResponseText.FAIL,
        data: { message: "Order or Tracking record not found" },
      });
    }
    order.status = status;
    await order.save();

    tracking.status = status;
    tracking.statusHistory.push({
      status: status,
      message: message || `Order status moved to ${status}`,
      timestamp: new Date(),
    });
    await tracking.save();

    res.status(200).json({
      status: HttpResponseText.SUCCESS,
      data: {
        orderHistory: tracking.statusHistory,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: HttpResponseText.ERROR,
      message: error.message,
    });
  }
};

module.exports = { getOrderStatus, updateStatus };
