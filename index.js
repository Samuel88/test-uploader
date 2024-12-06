const port = 3000;

const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(fileUpload());

app.get("/galleries", (req, res) => {
  const files = fs.readdir(__dirname + "/uploads/", (error, files) => {
    if (error) {
      return res.status(500).json({
        error,
      });
    } else {
      const images = [];
      files.forEach((file) => {
        if (path.extname(file) === ".jpg") {
          images.push(
            req.protocol + "://" + req.get("host") + "/uploads/" + file
          );
        }
      });

      return res.json({
        status: true,
        results: images,
      });
    }
  });
});

app.post("/upload", (req, res) => {
  console.log(req.files);

  let imageFile, uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      error: "No File Found",
    });
  }

  imageFile = req.files.image;
  uploadPath = __dirname + "/uploads/" + imageFile.name;

  imageFile.mv(uploadPath, (error) => {
    if (error)
      return res.status(500).json({
        error,
      });

    res.json({
      status: true,
    });
  });
});

app.listen(port, () => {
  console.log("App Listening on port " + port);
});
