const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const constants = require("../constants");

const transporter = nodemailer.createTransport(
   sendgridTransport({
      auth: {
         api_key: "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",
      },
   })
);

exports.login = (req, res, next) => {
   const { email, password } = req.body;
   const isValidEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
      email
   );
   if (!isValidEmail || !password) {
      return res.status(400).json({ message: "Please enter correct email and/or password!" });
   }
   User.findOne({ email })
      .then((user) => {
         if (!user) {
            return res.status(401).json({ message: "Incorrect email!" });
         }
         bcrypt
            .compare(password, user.password)
            .then((isMatching) => {
               if (isMatching) {
                  let userRes = {
                     userId: user._id,
                     userType: user.userType,
                  };
                  return res.status(200).json(userRes);
               }
               res.status(401).send({ message: "Incorrect password!" });
            })
            .catch((error) => {
               return res.status(500).json({ message: error });
            });
      })
      .catch((error) => {
         return res.status(500).json({ message: error });
      });
};

exports.signup = (req, res, next) => {
   const { name, email, password, userType } = req.body;
   const isValidEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
      email
   );
   console.log(isValidEmail, "isValidEmail");
   if (!name || !isValidEmail || !password) {
      return res.status(400).json({ message: "Invalid request!" });
   }
   User.findOne({ email })
      .then((user) => {
         if (user) {
            return res.status(401).send({ message: "Email already exist." });
         }
         bcrypt
            .hash(password, 12)
            .then((password) => {
               const user = new User({
                  name,
                  email,
                  password,
                  userType,
               });
               user
                  .save()
                  .then((result) => {
                     res.status(200).send({ message: "Registration Successful!" });
                     transporter.sendMail({
                        to: email,
                        from: "shubhamchitransh98@gmail.com",
                        subject: "Sign Up Successfully!",
                        html: "<h1>You have signed up successfully!</h1>",
                     });
                  })
                  .catch((error) => {
                     return res.status(500).json({ message: error });
                  });
            })
            .catch((error) => {
               return res.status(500).json({ message: error });
            });
      })
      .catch((error) => {
         return res.status(500).json({ message: error });
      });
};

//? Not in use
exports.sendResetPasswordLink = (req, res, next) => {
   const { email } = req.query;
   console.log(email);
   crypto.randomBytes(32, (error, buffer) => {
      if (error) {
         return res.send(err);
      }
      const token = buffer.toString("hex");
      User.findOne({ email })
         .then((user) => {
            if (!user) {
               return res.send("Wrong Email!");
            }
            user.resetToken = token;
            user.resetTokenExpiry = Date.now() + 3600000;
            user
               .save()
               .then((result) => {
                  transporter
                     .sendMail({
                        to: email,
                        from: "shubhamchitransh98@gmail.com",
                        subject: "Reset Password!",
                        html: `
              <p>Here is the link to reset your password.</p>
              <p>Please click on this
              <a href="/reset-password/${token}" >link</a>to reset your password.</p>
              `,
                     })
                     .then((result) => {
                        res.send("Reset Password Link Sent Successfully!");
                     })
                     .catch((error) => {
                        console.log(error);
                     });
               })
               .catch((error) => {
                  console.log(error);
               });
         })
         .catch((error) => console.log(error));
   });
};

exports.resetPassword = (req, res, next) => {
   const { token, password } = req.body;
   let userToReset;
   User.findOne({
      resetToken: token,
   })
      .then((user) => {
         if (!user) {
            return res.send("Invalid Token!");
         }
         userToReset = user;
         return bcrypt.hash(password, 12);
      })
      .then((hashedPassword) => {
         userToReset.password = hashedPassword;
         userToReset.resetToken = undefined;
         userToReset.resetTokenExpiry = undefined;
         return userToReset.save();
      })
      .then((result) => {
         res.send("Password Reset Successfully!");
      })
      .catch((error) => {
         console.log(error);
      });
};
