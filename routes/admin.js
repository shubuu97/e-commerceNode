const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();

//Add a product
router.post("/add-product", adminController.addProduct);

// Get all products list
router.get("/products", adminController.fetchAllProducts);

//get product by id
router.get("/product", adminController.findProductById);

// Update a product
router.put("/update-product", adminController.updateProduct);

//Delete a product
router.delete("/delete-product", adminController.deleteProduct);

module.exports = router;
