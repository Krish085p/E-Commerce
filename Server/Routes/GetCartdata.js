const express = require("express");
const router = express.Router();
const User = require("../Schemas/User.js");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/Auth.js");


router.post("/getcart", auth, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id);
    res.json(userData.cartData);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).send("Failed to fetch cart data");
  }
});

module.exports = router;