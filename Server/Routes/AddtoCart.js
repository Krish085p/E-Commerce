const express = require("express");
const router = express.Router();
const User = require("../Schemas/User.js");
const jwt = require("jsonwebtoken");

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token)
    return res
      .status(401)
      .json({ errors: "Please authenticate using a valid token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ errors: "Invalid token" });
  }
};

router.post("/addtocart", fetchUser, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) return res.status(400).json({ errors: "Item ID is required" });
  try {
    let userData = await User.findById(req.user.id);
    if (!userData) return res.status(404).json({ errors: "User not found" });
    if (!userData.cartData) userData.cartData = {};
    if (!userData.cartData[itemId]) userData.cartData[itemId] = 0;
    userData.cartData[itemId] += 1;
    await userData.save();
    res.json({ message: "Item added to cart", cartData: userData.cartData });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ errors: "Failed to add item to cart" });
  }
});

module.exports = router;
