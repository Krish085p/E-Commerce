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

router.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    let userData = await User.findById(req.user.id);
    if (userData.cartData[itemId] > 0) userData.cartData[itemId] -= 1;
    await userData.save();
    res.send("Item removed from cart");
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).send("Failed to remove item from cart");
  }
});

module.exports = router;
