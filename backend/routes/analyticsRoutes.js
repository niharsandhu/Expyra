const express = require("express");
const router = express.Router();
const { getAnalyticsSummary } = require("../controllers/analyticsController");

// ✅ Route to get payment analytics summary
router.get("/summary", getAnalyticsSummary);

module.exports = router;
