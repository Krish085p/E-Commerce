const express = require("express");
const router = express.Router();
const Product = require("../Schemas/Product.js");

router.post("/addproduct", async (req, res) => {
  try {
    const { name, category, new_price, old_price, image } = req.body;
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const product = new Product({
      id,
      name,
      image,
      category,
      new_price,
      old_price,
    });
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
