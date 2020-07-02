const User = require("../models/user");

module.exports = (req, res, next) => {
   const { userid } = req.headers;
   if (!userid) {
      return res.status(400).send("Please send User Id");
   }
   User.findById(userid)
      .then((user) => {
         if (!user) {
            return res.status(400).send("Incorrect User Id");
         }
         const userType = user.userType;
         if (userType !== 1) {
            return res.status(400).send("Not a admin user!");
         }
         next();
      })
      .catch((error) => {
         console.log(error);
      });
};
