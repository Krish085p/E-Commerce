const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectToDb } = require("./connection");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectToDb();
 


const addproduct = require("./Routes/Addproduct");
const addtocart = require("./Routes/AddtoCart");
const allproducts = require("./Routes/Allproduct");
const getcart = require("./Routes/GetCartdata");
const login = require("./Routes/Login");
const newcollections = require("./Routes/NewCollection");
const popular_in_women = require("./Routes/Popular_in_women");
const removefromcart = require("./Routes/RemovefromCart");
const removeproduct = require("./Routes/Removeproduct");
const signup = require("./Routes/Signup");
const uploads = require("./Routes/Upload");

app.use("/api", addproduct);
app.use("/api", addtocart);
app.use("/api", allproducts);
app.use("/api", getcart);
app.use("/api", login);
app.use("/api", newcollections);
app.use("/api", popular_in_women);
app.use("/api", removefromcart);
app.use("/api", removeproduct);
app.use("/api", signup);
app.use("/api", uploads);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
