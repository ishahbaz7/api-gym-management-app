const fs = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const traineesRoute = require("./routes/traineesRoutes");
const userRoute = require("./routes/userRoutes");
const invoiceRoute = require("./routes/invoiceRoutes");
const membershipsRoute = require("./routes/membershipsRoutes");
const multer = require("multer");
const updateTraineeStatus = require("./middleware/updateTraineeStatus");
const sharp = require("sharp");

const app = express();
mongoose.set("strictQuery", true);

const mongoAtlas =
  "mongodb+srv://shahbaz:Ids%401234@cluster0.hij2bny.mongodb.net/gymManagementApp?retryWrites=true&w=majority";
const mongoLocal = "mongodb://localhost:27017/gymManagementApp";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

var pubImg = path.join(__dirname, "public", "images");
if (!fs.existsSync(pubImg)) {
  fs.mkdirSync(pubImg, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "client", "build")));

// uploading image route
app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  console.log("reached to upload");
  try {
    if (req.file) {
      const { buffer, originalname } = req.file;
      const timeStamp = new Date().toISOString().replaceAll(":", "_");
      const ref = `${timeStamp}-${originalname}`;
      await sharp(buffer)
        .webp({ quality: 20 })
        .toFile(path.join(__dirname, "public", "images", ref));
      return res.json({ ref: "public/images/" + ref });
    }
    return res.status(402).json({ response: "please select file" });
  } catch (error) {
    console.log(error);
  }
});
app.post("/api/delete-image", (req, res, next) => {
  const { location = "" } = req?.body;
  try {
    const filePath = path.join(__dirname, location);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(402).json(err);
        }
      });
    }
    return res.status(202).json("ok");
  } catch (error) {
    console.log("error", error);
    return res.status(202).json(error);
  }
});

const serveClient = (req, res) => {
  res.sendFile(
    path.join(__dirname, "client", "build", "index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
};
app.get("/", serveClient);
app.get("/all-members", serveClient);
app.get("/active-members", serveClient);
app.get("/expire-members", serveClient);
app.get("/in-active-members", serveClient);
app.get("/membership", serveClient);
app.get("/auth/sign-in", serveClient);
app.get("/profile", serveClient);

app.use(updateTraineeStatus);

app.use("/api", userRoute);
app.use("/api", traineesRoute);
app.use("/api", membershipsRoute);
app.use("/api", invoiceRoute);

app.use((error, req, res, next) => {
  console.log("error from app", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ data: data, message });
});

mongoose
  .connect(mongoLocal)
  .then((result) => {
    console.log("connected!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
