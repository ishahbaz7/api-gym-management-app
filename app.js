const fs = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const traineesRoute = require("./routes/traineesRoutes");
const userRoute = require("./routes/userRoutes");
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
  if (req.file) {
    const { buffer, originalname } = req.file;
    const timeStamp = new Date().toISOString();
    const ref = `${timeStamp}-${originalname}`;
    await sharp(buffer)
      .webp({ quality: 20 })
      .toFile(path.join(__dirname, "public", "images", ref));
    return res.json({ ref: "public/images/" + ref });
  }
  return res.status(402).json({ response: "please select file" });
});
app.post("/api/delete-image", (req, res, next) => {
  const { location } = req?.body;
  console.log("req.body", req.body);
  fs.unlink(path.join(__dirname, location), (err) => {
    if (!err) {
      return res.status(202).json("ok");
    }
    return res.status(402).json(err);
  });
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
app.get("/settings", serveClient);
app.get("/auth/sign-in", serveClient);

app.use(updateTraineeStatus);

app.use("/api", traineesRoute);
app.use("/api", membershipsRoute);
app.use("/api", userRoute);

app.use((error, req, res, next) => {
  console.log("error from app", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ data: data, message });
});

mongoose
  .connect(mongoAtlas)
  .then((result) => {
    console.log("connected!");
    app.listen(8080);
  })
  .catch((err) => console.log(err));
