const express = require("express");
const router = express.Router();
const Product = require("../Schemas/Product.js");

router.post("/removeproduct", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });
    if (!deletedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
