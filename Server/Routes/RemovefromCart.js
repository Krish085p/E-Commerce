const express = require("express");
const router = express.Router();
const User = require("../Schemas/User.js");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/Auth.js");

router.post("/removefromcart", auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    let userData = await User.findById(req.user.id);

    // Assuming cartData is an array of objects, and each object has an 'id' property
    userData.cartData = userData.cartData.filter(item => item.id !== itemId);

    await userData.save();
    res.send("Item removed from cart");
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).send("Failed to remove item from cart");
  }
});

module.exports = router;
