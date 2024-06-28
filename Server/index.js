const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { connectToDb } = require("./connection");
const Product = require('./Schemas/Product.js');
const User = require('./Schemas/User.js');

dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectToDb();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './upload/images';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Serve Uploaded Images
app.use('/image', express.static('upload/images'));

// File Upload Endpoint
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({
    success: true,
    image_url: `http://localhost:4000/image/${req.file.filename}`
  });
});

// Add a Product
app.post('/addproduct', async (req, res) => {
  try {
    const { name, category, new_price, old_price, image } = req.body;

    // Calculate ID for the new product
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    // Create new product instance
    const product = new Product({
      id,
      name,
      image,
      category,
      new_price,
      old_price,
    });

    // Save product to database
    await product.save();

    console.log("Product saved successfully:", product);

    res.json({
      success: true,
      product: product
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove a Product
app.post('/removeproduct', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    console.log("Removed product:", deletedProduct);
    res.json({
      success: true,
      product: deletedProduct
    });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get All Products
app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({});
    console.log("All products fetched");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User with this email already exists" });
    }

    // Initialize cart data
    const cartData = {};
    for (let i = 0; i < 300; i++) {
      cartData[i] = 0;
    }

    // Create new user instance
    const newUser = new User({
      name: username,
      email,
      password,
      cartData,
    });

    // Save user to database
    await newUser.save();

    const token = jwt.sign({ user: { id: newUser.id } }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Validate password
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Invalid password" });
    }

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



// Endpoint for New Collections
app.get('/newcollections', async (req, res) => {
  try {
    const products = await Product.find({});
    const newCollection = products.slice(1).slice(-8); // Get last 8 products excluding the first one
    console.log("New collection fetched");
    res.json(newCollection);
  } catch (error) {
    console.error("Error fetching new collections:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint for Popular Products in Women Section
app.get('/popular_in_women', async (req, res) => {
  try {
    const products = await Product.find({ category: "women" }).limit(4);
    console.log("Popular in women fetched");
    res.json(products);
  } catch (error) {
    console.error("Error fetching popular in women:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Middleware to fetch user from token
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ errors: "Please authenticate using a valid token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ errors: "Invalid token" });
  }
};

// Add to Cart Endpoint
app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    let userData = await User.findById(req.user.id);
    userData.cartData[itemId] += 1;
    await userData.save();
    res.send("Item added to cart");
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).send("Failed to add item to cart");
  }
});

// Remove from Cart Endpoint
app.post('/removefromcart', fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    let userData = await User.findById(req.user.id);
    if (userData.cartData[itemId] > 0) {
      userData.cartData[itemId] -= 1;
    }
    await userData.save();
    res.send("Item removed from cart");
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).send("Failed to remove item from cart");
  }
});

// Get Cart Data Endpoint
app.get('/getcart', fetchUser, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id);
    res.json(userData.cartData);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).send("Failed to fetch cart data");
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
