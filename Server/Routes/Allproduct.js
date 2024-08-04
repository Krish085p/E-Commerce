const express = require("express");
const router = express.Router();
const Product = require("../Schemas/Product.js");

router.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
