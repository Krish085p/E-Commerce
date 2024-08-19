const express = require("express");
const Product = require("../Schemas/Product");
const router = express.Router();

router.get("/relatedProduct", async (req, res) => {
    try {
        const { par, proId } = req.query; // Destructure both category and proId from query parameters

        // Find products by category and exclude the product with the given proId
        const response = await Product.find({ 
            category: par, 
            _id: { $ne: proId } // Exclude the product with the specified proId
        }).limit(4);

        res.json(response); // Send the response as JSON
    } catch (err) {
        console.error("Error message:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
