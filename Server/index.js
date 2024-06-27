const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectToDb } = require("./connection");
const Product = require('./Schemas/Product.js');

dotenv.config(); // Load environment variables from .env file

// Database Connection with MongoDB
connectToDb();

app.use(express.json());
app.use(cors());

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Image Storage Engine
const Storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: Storage });

// Creating Upload Endpoint 
app.use('/image', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/image/${req.file.filename}`
    });
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});

app.post('/addproduct', async (req, res) => {
    const help = req.body;
    const product = new Product({
        id: help.id,
        name: help.name,
        Image: help.image,  // Assuming 'Image' is the field where you store the image URL
        category: help.category,
        new_price: help.new_price,
        old_price: help.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved!!");
    res.json({
        success: true,
        name: help.name  // Fixed typo here
    });
});
