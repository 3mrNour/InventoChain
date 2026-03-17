const express = require("express");
const app = express();
require("dotenv").config();

const HttpResponseText = require("./utils/HttpResponseText");
const supplierRouter = require("./routes/supplier.route");
const productRouter = require("./routes/product.route");
app.use(express.json());
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

app.use("/api/suppliers", supplierRouter);
app.use("/api/products", productRouter);

app.all(/(.*)/, (req, res, next) => {
  return res.status(404).json({
    status: HttpResponseText.FAIL,
    data: { message: "Not Found!" },
  });
});

mongoose.connect(url).then(() => {
  console.log("Server Connected Sucsessfully");
});
app.listen(process.env.PORT, () => {
  console.log("Server is listening in Port : 2000");
});
