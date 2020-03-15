const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/login", authController.login);

router.post("/admin/login", authController.login);

router.post("/signup", authController.signup);

router.get("/send-reset-password-link", authController.sendResetPasswordLink);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
