const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const HttpResponseText = require("./utils/HttpResponseText");
const supplierRouter = require("./routes/supplier.route");
const productRouter = require("./routes/product.route");
const orderRouter = require("./routes/order.route");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

app.use("/api/suppliers", supplierRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

//Global middleware for not found pages
app.all(/(.*)/, (req, res) => {
  return res.status(404).json({
    status: HttpResponseText.FAIL,
    data: { message: "Route Not Found!" },
  });
});

mongoose.connect(url).then(() => {
  console.log("Server Connected Sucsessfully");
});
app.listen(process.env.PORT, () => {
  console.log("Server is listening in Port : 2000");
});
