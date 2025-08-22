// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // make sure path is correct

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select("_id name email");
    if (!req.user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    next(); // ✅ continue to controller
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
