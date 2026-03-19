const mongoose = require("mongoose");
const orderStatus = require("../utils/orderStatus");

const orderTrackingSchema = new mongoose.Schema({
  order: {
    type: mongoose.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  status: {
    type: String,
    enum: [
      orderStatus.PENDING,
      orderStatus.SHIPPED,
      orderStatus.DELIVERED,
      orderStatus.CANCELLED,
    ],
    default: orderStatus.PENDING,
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: [
          orderStatus.PENDING,
          orderStatus.SHIPPED,
          orderStatus.DELIVERED,
          orderStatus.CANCELLED,
        ],
        default: orderStatus.PENDING,
      },
      timestamp: { type: Date, default: Date.now },
      message: String,
    },
  ],
});
module.exports = mongoose.model("OrderTracking", orderTrackingSchema);
