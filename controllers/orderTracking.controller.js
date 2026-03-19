const Order = require("../models/order.model");
const Product = require("../models/product.model");
const HttpResponseText = require("../utils/HttpResponseText");
const { validationResult } = require("express-validator");
const updateOrderStatus = require("../middlewares/orderTracking.validation");
const jwt = require("jsonwebtoken");
const orderStatus = require("../utils/orderStatus");


const updateStatus = async (req, res) => {
const orderId = req.params.orderId;
const status = req.body
};
