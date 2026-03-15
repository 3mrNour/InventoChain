
// Get all Products
app.get("/api/inventory", );

// get Product By ID
app.get("/api/inventory/searchbyid/:productID", );

// get Product By Name
app.get("/api/inventory/searchbyname/:productName", );

// Post Product
app.post(
  "/api/inventory",
  [
    body("name").notEmpty().withMessage("Name Must not be empty"),
    body("category").notEmpty().withMessage("Category Must not be empty"),
    body("price").isNumeric().withMessage("Price Must be a number"),
    body("stock").isNumeric().withMessage("Stock Must be a number"),
    body("supplierId").isNumeric().withMessage("Supplier ID Must be a number"),
  ],
);