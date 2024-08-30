const express = require("express");
const router = express.Router();
const User = require("../Schemas/User.js");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, error: "User with this email already exists" });
    const cartData = [];
    const newUser = new User({ name: username, email, password, cartData });
    await newUser.save();
    const token = jwt.sign(
      { user: { id: newUser.id } },
      process.env.JWT_SECRET
    );
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
