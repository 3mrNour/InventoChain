const mongoose = require("mongoose");

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
      },
    ],
    totalPrice: { type: Number, required: true },
    // status: { type: String, default: "pending" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
