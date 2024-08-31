const express = require("express");
const router = express.Router();
const User = require("../Schemas/User.js");
const auth = require("../Middleware/Auth.js");

router.post("/removefromcart", auth, async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ errors: "Item ID is required" });
    }

    const userId = req.user.id;
    console.log("User ID:", userId, "Item ID:", itemId);

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ errors: "User not found" });
    }

    const itemIndex = user.cartData.findIndex(
      (item) => item.productId && item.productId.toString() === itemId.toString()
    );

  
    user.cartData.splice(itemIndex, 1);
    

    await user.save();

    res.json({ message: "Item removed from cart", cartData: user.cartData });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ errors: "Failed to remove item from cart" });
  }
});

module.exports = router;
