const express = require("express");
const router = express.Router();
const Product = require("../Schemas/Product.js");

router.get('/newcollections', async (req, res) => {
    try {
        const products = await Product.find({});
        const newCollection = products.slice(1).slice(-8);
        res.json(newCollection);
    } catch (error) {
        console.error("Error fetching new collections:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
