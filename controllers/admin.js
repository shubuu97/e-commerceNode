const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
   const { name, price, description } = req.body;
   // const image = req.file;
   const { userid } = req.headers;
   // if (!image) {
   //   return res
   //     .status(400)
   //     .send("Please enter valid image with format jpg/jpeg/png");
   // }
   const product = new Product({
      name,
      price,
      description,
      // image: image.path,
      userId: userid,
   });
   product
      .save()
      .then((response) => {
         res.status(200).send(response);
      })
      .catch((err) => {
         res.status(500).send(err);
      });
};

exports.updateProduct = (req, res, next) => {
   const { id, name, price, description } = req.body;
   Product.findById(id)
      .then((product) => {
         product.name = name;
         product.price = price;
         product.description = description;
         return product.save();
      })
      .then((response) => {
         res.send(response);
      })
      .catch((error) => {
         res.send(error);
      });
};

exports.deleteProduct = (req, res, next) => {
   const { id } = req.query;
   Product.findByIdAndDelete(id)
      .then((result) => {
         res.send(result);
      })
      .catch((error) => {
         res.send(error);
      });
};

exports.fetchAllProducts = (req, res, next) => {
   const { userid } = req.headers;
   Product.find({ userId: userid })
      //? to fetch only specific fields and populate is used to fetch all data instead of id only
      // .select("-_id")
      // .populate("userId", "name")
      .then((products) => {
         res.json(products);
      })
      .catch((error) => {
         res.send(error);
      });
};

exports.findProductById = (req, res, next) => {
   const { id } = req.query;
   Product.findById(id)
      .then((product) => {
         res.json(product);
      })
      .catch((error) => {
         res.send(error);
      });
};
