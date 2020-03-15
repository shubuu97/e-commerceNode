const path = require("path");

const express = require("express");
const json = require("body-parser").json;
const urlencoded = require("body-parser").urlencoded;
var cors = require("cors");

const app = express();
app.use(cors());

const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

app.use(json({ limit: "1gb", strict: true }));
app.use(urlencoded({ limit: "1gb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  let { userid } = req.headers;
  if (!userid) {
    return next();
  }
  User.findById(userid)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => {
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
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("connected");
    app.listen(port);
  })
  .catch(error => {
    console.log(error);
  });
