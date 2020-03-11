const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const app = express();
app.use(cors());

const mongoose = require("mongoose");
// const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5e628a66d6f0520658e4f651")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => {
      console.log(error, "error");
    });
});
app.use(adminRoutes);
app.use(shopRoutes);
// app.use(errorController.get404);

mongoose
  .connect("mongodb+srv://shubham:life@123@cluster0-zasjm.mongodb.net/shop?", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("connected");
    User.findOne().then(user => {
      if (!user) {
        const user = User({
          name: "Shubham",
          email: "shubham@gmail.com"
        });
        user.save();
      }
    });
    app.listen(3001);
  })
  .catch(error => {
    console.log(error);
  });
