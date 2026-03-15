const getProductById = (req, res) => {
  const productID = req.params.productID;
  const product = inventory.find((product) => product.id == productID);
  if (!product) {
    return res.status(404).json({ msg: "Product Not Found!" });
  }
  res.status(200).json(product);
};

const getProudctByName = (req, res) => {
  const searchInput = req.params.productName.toLowerCase().replaceAll(" ", "");
  const products = inventory.filter((product) =>
    product.name.toLowerCase().replaceAll(" ", "").includes(searchInput),
  );
  if (products.length === 0) {
    return res.status(404).json({ msg: "Product Not Found!" });
  }
  res.status(200).json(products);
};

const addProudct = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  inventory.push({ id: inventory[inventory.length - 1].id + 1, ...req.body });
  res.status(201).json({ msg: "Product Added Successfully!" });
};
