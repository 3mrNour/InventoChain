const express = require("express");
const app = express();

const supplierRouter = require("./routes/supplier.route");
app.use(express.json());
const mongoose = require("mongoose");
const url =
  "mongodb+srv://InventoChain:InventoChain_123@inventochain.5vvt4cr.mongodb.net/InventoChain_DB";

app.use("/api/suppliers", supplierRouter);

mongoose.connect(url).then(() => {
  console.log("Server Connected Sucsessfully");
});
app.listen(2000, () => {
  console.log("Server is listening in Port : 5000");
});
