const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const constants = require("../constants");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.send("Incorrect Email!");
      }
      bcrypt
        .compare(password, user.password)
        .then(isMatching => {
          if (isMatching) {
            let userRes = {
              userId: user._id,
              userType: user.userType
            };
            return res.json(userRes);
          }
          res.send("Incorrect Password!");
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.signup = (req, res, next) => {
  const { name, email, password, userType } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.redirect("/signup");
      }
      bcrypt
        .hash(password, 12)
        .then(password => {
          const user = new User({
            name,
            email,
            password,
            userType
          });
          user
            .save()
            .then(result => {
              transporter.sendMail({
                to: email,
                from: "shubhamchitransh98@gmail.com",
                subject: "Sign Up Successfully!",
                html: "<h1>You have signed up successfully!</h1>"
              });
              res.send("Registration Successful!");
            })
            .catch(error => {
              console.log(error, "error");
            });
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
};
