const Product = require("../models/product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      stock_quantity,
      category_id,
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
