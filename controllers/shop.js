const Order = require("../models/order");

// exports.getProducts = (req, res, next) => {
//   Product.fetchAllProducts(products => {
//     res.render("shop/product-list", {
//       prods: products,
//       pageTitle: "All Products",
//       path: "/products"
//     });
//   });
// };

// exports.getProductDetail = (req, res, next) => {
//   const productId = req.params.productId;
//   Product.getProductById(productId, product => {
//     res.render("shop/product-detail", {
//       path: "/products",
//       product,
//       pageTitle: product.title
//     });
//   });
// };

// exports.getIndex = (req, res, next) => {
//   Product.fetchAllProducts(products => {
//     res.render("shop/index", {
//       prods: products,
//       pageTitle: "Shop",
//       path: "/"
//     });
//   });
// };

exports.getCartItems = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      res.send(user.cart.items);
    })
    .catch(error => {
      res.send(error);
    });
};

exports.addToCart = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .addToCart(productId)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.send(error);
    });
};

exports.removeItemFromCart = (req, res, next) => {
  const { productId } = req.query;
  req.user
    .removeItemFromCart(productId)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.send(error);
    });
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
  const { orderId } = req.query;
  Order.find({ _id: orderId })
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.send(error);
    });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout"
//   });
// };
