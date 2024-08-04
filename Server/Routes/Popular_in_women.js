const express = require("express");
const router = express.Router();
const Product = require("../Schemas/Product.js");

router.get("/popular_in_women", async (req, res) => {
  try {
    const products = await Product.find({ category: "women" }).limit(4);
    res.json(products);
  } catch (error) {
    console.error("Error fetching popular in women:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
