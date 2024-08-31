const express = require('express');
const router = express.Router();
const User = require('../Schemas/User'); 
const auth = require('../Middleware/Auth.js');

router.post('/decreasequantity', auth, async (req, res) => {
  const { productId } = req.body; 
  const userId = req.user.id; 

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.cartData.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (user.cartData[itemIndex].quantity > 1) {
      user.cartData[itemIndex].quantity -= 1;
    } else {
      user.cartData.splice(itemIndex, 1); 
    }

    await user.save();

    res.json(user.cartData);
  } catch (error) {
    console.error('Error decreasing quantity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
