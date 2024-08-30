const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  cartData: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product',},
      quantity: { type: Number }
    }
  ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
