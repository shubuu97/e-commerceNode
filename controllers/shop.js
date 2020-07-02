const Order = require("../models/order");
const Product = require("../models/product");

exports.getAllProducts = (req, res, next) => {
   Product.find()
      .then((products) => {
         if (Array.isArray(products)) {
            res.status(200).json({ products });
         } else {
            res.status(502).send({ message: "Something went wrong!" });
         }
      })
      .catch((error) => {
         res.status(500).send({ message: error });
      });
};

exports.getProductById = (req, res, next) => {
   const { id } = req.query;
   Product.findById(id)
      .then((product) => {
         res.status(200).send({ product });
      })
      .catch((error) => {
         res.status(500).send({ message: error });
      });
};

exports.addToCart = (req, res, next) => {
   const { id } = req.query;
   Product.findById(id)
      .then((product) => {
         if (!product) {
            return res.status(400).send({ message: "Invalid Product Id!" });
         }
         req.user
            .addToCart(id)
            .then((result) => {
               res.send(result);
            })
            .catch((error) => {
               res.status(400).send(error);
            });
      })
      .catch((error) => {
         console.log(error);
      });
};

exports.removeItemFromCart = (req, res, next) => {
   const { id } = req.query;
   req.user
      .removeItemFromCart(id)
      .then((result) => {
         res.send(result);
      })
      .catch((error) => {
         res.send(error);
      });
};
exports.fetchCartItems = (req, res, next) => {
   req.user
      .populate("cart.items.productId")
      .execPopulate()
      .then((user) => {
         const products = user.cart.items;
         res.json(products);
      })
      .catch((err) => {
         res.status(400).json(err);
      });
};

exports.createOrder = (req, res, next) => {
   req.user
      .populate("cart.items.productId")
      .execPopulate()
      .then((user) => {
         const products = user.cart.items.map((item) => {
            return {
               quantity: item.quantity,
               product: { ...item.productId._doc },
            };
         });
         const order = new Order({
            user: {
               userId: req.user,
               name: req.user.name,
            },
            products: [...products],
         });
         return order.save();
      })
      .then((result) => {
         req.user.clearCart();
         return result;
      })
      .then((result) => {
         res.send(result);
      })
      .catch((error) => {
         res.send(error);
      });
};

exports.getOrders = (req, res, next) => {
   Order.findOne({ "user.userId": req.user._id })
      .then((orders) => {
         res.send(orders);
      })
      .catch((error) => {
         res.send(error);
      });
};

exports.getOrder = (req, res, next) => {
   const { id } = req.query;
   Order.find({ _id: id })
      .then((result) => {
         res.send(result);
      })
      .catch((error) => {
         res.send(error);
      });
};
