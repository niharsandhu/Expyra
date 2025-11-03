// controllers/paymentController.js
const razorpay = require("../razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");

// ✅ Create Razorpay order and store in DB
exports.createOrder = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "userId and amount are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 💾 Save order to DB
    await Payment.create({
      user: user._id,
      orderId: order.id,
      amount,
      currency: order.currency,
      status: "created",
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

// ✅ Verify payment and update status
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    const payment = await Payment.findOne({ orderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    if (isAuthentic) {
      payment.paymentId = razorpay_payment_id;
      payment.status = "paid";
      await payment.save();

      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      payment.status = "failed";
      await payment.save();

      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

// ✅ Optional: Fetch all payments for a user
exports.getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");

    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};
