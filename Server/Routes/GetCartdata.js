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

router.post("/getcart", fetchUser, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id);
    res.json(userData.cartData);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).send("Failed to fetch cart data");
  }
});

module.exports = router;