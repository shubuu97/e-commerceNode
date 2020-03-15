const User = require("../models/user");

module.exports = (req, res, next) => {
  const { userid } = req.headers;
  if (!userid) {
    return res.send("Please send User Id");
  }
  User.findById(userid)
    .then(user => {
      if (!user) {
        return res.send("Incorrect User Id");
      }
      const userType = user.userType;
      if (userType !== 2) {
        return res.send("Not a normal user!");
      }
      next();
    })
    .catch(error => {
      console.log(error);
    });
};
