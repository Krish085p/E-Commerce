const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs"); // Require the fs module for file system operations
const { connectToDb } = require("./connection");
const Product = require('./Schemas/Product.js'); // Import your Product model

dotenv.config(); // Load environment variables from .env file

// Database Connection with MongoDB
connectToDb();

// Middleware
app.use(express.json());
app.use(cors());

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './upload/images';
        // Ensure the directory exists
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
    res.json({
        success: 1,
        image_url: `http://localhost:4000/image/${req.file.filename}`
    });
});

// Adding a product
app.post('/addproduct', async (req, res) => {
    try {
        const { id, name, category, new_price, old_price } = req.body;
        
        const product = new Product({
            id,
            name,
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

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
