const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({

  imagePath: { type: String, required: true },
  imageBuffer: { data: Buffer, contentType: String }
});

module.exports = mongoose.model("Image", imageSchema);
