// const User = require("../models/user");

// exports.addUser = (req, res, next) => {
//   const { name, email } = req.body;
//   const user = new User(name, email);
//   user
//     .createUser()
//     .then(result => {
//       res.send(result);
//     })
//     .catch(error => {
//       res.send(error);
//     });
// };

// exports.getUser = (req, res, next) => {
//   const { id } = req.body;
//   User.getById(id)
//     .then(result => {
//       res.send(result);
//     })
//     .catch(error => {
//       res.send(error);
//     });
// };

// exports.deleteUser = (req, res, next) => {
//   const { id } = req.body;
//   User.deleteUserById(id)
//     .then(result => {
//       res.send(result);
//     })
//     .catch(error => {
//       res.send(error);
//     });
// };
