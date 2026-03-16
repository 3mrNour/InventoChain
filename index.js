const express = require("express");
const app = express();

const supplierRouter = require("./routes/supplier.route");
const productRouter = require("./routes/product.route");
app.use(express.json());
const mongoose = require("mongoose");
const url =
  "mongodb+srv://InventoChain:InventoChain_123@inventochain.5vvt4cr.mongodb.net/InventoChain_DB";

app.use("/api/suppliers", supplierRouter);
app.use("/api/products", productRouter);

mongoose.connect(url).then(() => {
  console.log("Server Connected Sucsessfully");
});
app.listen(2000, () => {
  console.log("Server is listening in Port : 2000");
});
