const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const { connectToDb } = require("./connection");
const Product = require('./Schemas/Product.js');
const User = require('./Schemaz/User.js');

dotenv.config();

// Database Connection with MongoDB
connectToDb();

// Middleware
app.use(express.json());
app.use(cors());

// Image Storage Engine
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

// Creating Upload Endpoint 
app.use('/image', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: 'No file uploaded' });
  }
  res.json({
    success: 1,
    image_url: `http://localhost:4000/image/${req.file.filename}`
  });
});

// Adding a product
app.post('/addproduct', async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    const { name, category, new_price, old_price, image } = req.body;

    const product = new Product({
      id: id,
      name,
      image,
      category,
      new_price,
      old_price,
    });

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

// Creating API for deleting Products
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed!!");
  res.json({
    success: true,
    name: req.body.name
  });
});

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("All products Fetched!!");
  res.send(products);
});

// Schema creating for User model

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
