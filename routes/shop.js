const express = require("express");
const shopController = require("../controllers/shop");
const router = express.Router();

router.post("/add-to-cart", shopController.addToCart);
router.get("/remove-item-from-cart", shopController.removeItemFromCart);
router.get("/cart-items", shopController.getCartItems);

router.get("/create-order", shopController.createOrder);
router.get("/get-order", shopController.getOrder);
router.get("/orders", shopController.getOrders);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
