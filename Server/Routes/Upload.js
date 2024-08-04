const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./upload/images";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Serve Uploaded Images
router.use("/images", express.static(path.join(__dirname, "../upload/images")));

router.post("/upload", upload.single("product"), (req, res) => {
  console.log("hello");
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  res.json({
    success: true,
    image_url: `http://localhost:4000/api/images/${req.file.filename}`,
  });
});

router.get("/uploadstesting", (req,res) => {
  res.send("Successfull");
})

module.exports = router;
