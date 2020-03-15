const express = require("express");
const shopController = require("../controllers/shop");
const isNormalUser = require("../middleware/is-normalUser");
const router = express.Router();

router.get("/products", shopController.getAllProducts);
router.get("/product", shopController.getProductById);

router.get("/add-to-cart", isNormalUser, shopController.addToCart);
router.get(
  "/remove-item-from-cart",
  isNormalUser,
  shopController.removeItemFromCart
);
router.get("/fetch-cart-items", isNormalUser, shopController.fetchCartItems);

router.get("/create-order", isNormalUser, shopController.createOrder);
router.get("/orders", isNormalUser, shopController.getOrders);
router.get("/get-order", isNormalUser, shopController.getOrder);

module.exports = router;
