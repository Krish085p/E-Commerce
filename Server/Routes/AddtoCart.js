const express = require("express");
const router = express.Router();
const User = require("../Schemas/User.js");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/Auth.js");

// Middleware to fetch and verify the user

// Route to add item to cart
router.post("/addtocart", auth, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ errors: "Item ID is required" });
  }

  try {
    let userData = await User.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ errors: "User not found" });
    }
    
    // Initialize cartData if not already
    if (!userData.cartData) {
      userData.cartData = {};
    }
    
    // Ensure itemId is a string and not an object
    if (typeof itemId !== 'string') {
      return res.status(400).json({ errors: "Invalid item ID format" });
    }

    // Initialize item quantity if it doesn't exist
    if (!userData.cartData[itemId]) {
      userData.cartData[itemId] = 0;
    }

    // Increment the item quantity
    userData.cartData[itemId] += 1;

    // Save the updated user data
    await userData.save();

    res.json({ message: "Item added to cart", cartData: userData.cartData });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ errors: "Failed to add item to cart" });
  }
});

module.exports = router;
