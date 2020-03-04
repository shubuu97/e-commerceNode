const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  const { name, price, description } = req.body;
  const product = new Product({ name, price, description, userId: req.user });
  product
    .save()
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.send(err);
    });
};

exports.updateProduct = (req, res, next) => {
  const { id, name, price, description } = req.body;
  Product.findById(id)
    .then(product => {
      product.name = name;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(response => {
      res.send(response);
    })
    .catch(error => {
      res.send(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const { id } = req.body;
  Product.findByIdAndDelete(id)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      res.send(error);
    });
};

exports.fetchAllProducts = (req, res, next) => {
  Product.find()
    //? to fetch only specific fields and populate is used to fetch all data instead of id only
    // .select("-_id")
    // .populate("userId", "name")
    .then(products => {
      console.log(products, "products");
      res.json(products);
    })
    .catch(error => {
      res.send(error);
    });
};

exports.findProductById = (req, res, next) => {
  const { id } = req.body;
  Product.findById(id)
    .then(product => {
      res.json(product);
    })
    .catch(error => {
      res.send(error);
    });
};
