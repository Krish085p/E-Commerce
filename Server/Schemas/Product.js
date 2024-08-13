const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the product schema
const productSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
