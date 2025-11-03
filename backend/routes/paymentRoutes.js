// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getUserPayments,
} = require("../controllers/paymentController");

// POST /api/payment/create-order
router.post("/create-order", createOrder);

// POST /api/payment/verify-payment
router.post("/verify-payment", verifyPayment);

// GET /api/payment/:userId
router.get("/:userId", getUserPayments);

module.exports = router;
