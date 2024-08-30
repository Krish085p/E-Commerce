const express = require('express');
const router = express.Router();
const User = require('../Schemas/User.js');
const auth = require('../Middleware/Auth.js');

// Route to add item to cart
router.post('/addtocart', auth, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ errors: 'Item ID is required' });
  }

  console.log("item id is ", itemId);

  try {
    const userId = req.user.id;

    console.log("user id is ", userId);
    if (!userId || !itemId) {
      return res.status(400).json({ errors: 'Invalid user or item ID' });
    }

    let user = await User.findById(userId);
    console.log("user is ", user);
    if (!user) {
      return res.status(404).json({ errors: 'User not found' });
    }

    if (!Array.isArray(user.cartData)) {
      user.cartData = [];
    }

    const existingItem = user.cartData.find((item) => 
      item.productId && item.productId.toString() === itemId.toString()
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else { 
      user.cartData.push({ productId: itemId, quantity: 1 });
    }

    await user.save();

    res.json({ message: 'Item added to cart', cartData: user.cartData });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ errors: 'Failed to add item to cart' });
  }
});

module.exports = router;
