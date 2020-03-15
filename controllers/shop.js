const Order = require("../models/order");
const Product = require("../models/product");

exports.getAllProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.send(products);
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getProductById = (req, res, next) => {
  const { id } = req.query;
  Product.findById(id)
    .then(product => {
      res.send(product);
    })
    .catch(error => {
      console.log(error);
    });
};

exports.addToCart = (req, res, next) => {
  const { id } = req.query;
  Product.findById(id)
    .then(product => {
      if (!product) {
        return res.send("Invalid Product Id!");
      }
      req.user
        .addToCart(id)
        .then(result => {
          res.send(result);
        })
        .catch(error => {
          res.send(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.removeItemFromCart = (req, res, next) => {
  const { id } = req.query;
  req.user
    .removeItemFromCart(id)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.send(error);
    });
};
exports.fetchCartItems = (req, res, next) => {
  res.json(req.user.cart);
};

exports.createOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          quantity: item.quantity,
          product: { ...item.productId._doc }
        };
      });
      const order = new Order({
        user: {
          userId: req.user,
          name: req.user.name
        },
        products: [...products]
      });
      return order.save();
    })
    .then(result => {
      req.user.clearCart();
      return result;
    })
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.send(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.findOne({ "user.userId": req.user._id })
    .then(orders => {
      res.send(orders);
    })
    .catch(error => {
      res.send(error);
    });
};

exports.getOrder = (req, res, next) => {
  const { id } = req.query;
  Order.find({ _id: id })
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.send(error);
    });
};
