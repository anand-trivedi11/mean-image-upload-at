const express = require("express");
const multer = require("multer");

const Image = require("../models/image");
const fs = require('fs');
const router = express.Router();
// Introducing Checks for Image format, If image is not of below format, Error will be thrown on console.
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
// Configuring Multer and providing it a folder for storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

// Posting to DB
router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log("saved")
    const image = new Image({
      // uploading Local Images Path to DB, Later used in src of Image to get Image. Temp Solution
      imagePath: url + "/images/" + req.file.filename,

    });
    // Adding Image as Binary Value, To be Done: Need to convert back to Image to be shown on Front End
    image.imageBuffer.data = fs.readFileSync(req.file.path)
    image.imageBuffer.contentType = 'image/png';

    image.save().then(createdImage => {
      res.status(201).json({
        message: "Image added successfully",
        image: {
          ...createdImage,
          id: createdImage._id
        }
      });
    });
  }
);

// Getting from DB
router.get("", (req, res, next) => {
  Image.find().then(documents => {
    res.status(200).json({
      message: "Images fetched successfully!",
      images: documents
    });
  });
});

// Deleting from DB by ID
router.delete("/:id", (req, res, next) => {
  Image.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Image deleted!" });
  });
});

module.exports = router;
