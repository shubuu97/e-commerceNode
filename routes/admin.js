const express = require("express");
const adminController = require("../controllers/admin");
const isAdminUser = require("../middleware/is-admin");
const router = express.Router();

//Add a product
router.post("/add-product", isAdminUser, adminController.addProduct);

// Get all products list
router.get("/products", isAdminUser, adminController.fetchAllProducts);

//get product by id
router.get("/product", isAdminUser, adminController.findProductById);

// Update a product
router.post("/update-product", isAdminUser, adminController.updateProduct);

//Delete a product
router.get("/delete-product", isAdminUser, adminController.deleteProduct);

module.exports = router;
