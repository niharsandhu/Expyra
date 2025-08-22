// controllers/userController.js
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const Notification = require('../models/notificationModel');
const UserProduct = require('../models/userProductModel');

exports.createUser = async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        // Check all required fields
        if (!name || !phone || !email) {
            return res.status(400).json({ 
                error: "Name, phone, and email are required" 
            });
        }

        // Create user
        const user = await User.create({ name, phone, email });
        res.status(201).json({ 
            message: "User created successfully", 
            user 
        });

    } catch (error) {
        console.error("User creation error:", error.message);
        res.status(500).json({ error: "Failed to create user" });
    }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // token valid for 30 days
  });
};

// Login Controller
exports.loginUser = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone is required" });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Failed to login" });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId; // or from req.user if using auth middleware
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Total products scanned by this user
    const totalProductsScanned = await UserProduct.countDocuments({ user: userId });

    // Total notifications sent to this user
    const totalNotificationsSent = await Notification.countDocuments({ user: userId });

    res.json({
      totalProductsScanned,
      totalNotificationsSent
    });
  } catch (err) {
    console.error("User stats fetch error:", err);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};