const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET all products
router.get("/", productController.getAllProducts);

// POST new product
router.post("/", productController.createProduct);

module.exports = router;
