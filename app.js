const path = require("path");

const express = require("express");
const json = require("body-parser").json;
const mongoose = require("mongoose");
const urlencoded = require("body-parser").urlencoded;
let cors = require("cors");
let multer = require("multer");

const fileStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "images");
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname);
   },
});

const fileFilter = (req, file, cb) => {
   if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
   ) {
      cb(null, true);
   } else {
      cb(null, false);
   }
};

const app = express();
app.use(cors());

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

app.use(json({ limit: "1gb", strict: true }));
app.use(urlencoded({ limit: "1gb", extended: true }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
   let { userid } = req.headers;
   if (!userid) {
      return next();
   }
   User.findById(userid)
      .then((user) => {
         req.user = user;
         next();
      })
      .catch((error) => {
         console.log(error, "error");
      });
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

const port = parseInt(process.env.PORT, 10) || 3001;

mongoose
   .connect("mongodb+srv://shubham:life@123@cluster0-zasjm.mongodb.net/shop?", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log("connected");
      app.listen(port);
   })
   .catch((error) => {
      console.log(error);
   });
