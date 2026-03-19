const mongoose = require("mongoose");
const orderStatus = require("../utils/orderStatus");
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        priceAtPurchase: { type: Number, required: true },
        supplierId: {
          type: mongoose.Types.ObjectId,
          ref: "Supplier",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        _id: false,
      },
    ],
    totalPrice: { type: Number, required: true },
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
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
