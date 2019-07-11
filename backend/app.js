const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const imagesRoutes = require("./routes/images");

const app = express();
// MongoDB Connection String for Cloud DB 
mongoose
  .connect(
    "mongodb+srv://anand:password@123@cluster0-ezayc.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  // If Using Local Instance of MongoDB uncomment below Line and comment above line.
  // mongoose.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
// Resolving CORS.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/images", imagesRoutes);

module.exports = app;
