// const Product = require("../models/product.model");
const Order = require("../models/order.model");
const HttpResponseText = require("../utils/HttpResponseText");

const getOrders = async (req, res) => {
  try {
    const allOrders = await Order.find();
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
    const order = await Order.findById(req.params.orderId);
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

};

module.exports = { getOrders, getOrderById , PlaceOrder };
