const Payment = require("../models/paymentModel");

// 📊 Get overall analytics
exports.getAnalyticsSummary = async (req, res) => {
  try {
    // Total revenue from successful payments
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Count of successful and failed payments
    const paidCount = await Payment.countDocuments({ status: "paid" });
    const failedCount = await Payment.countDocuments({ status: "failed" });

    // Group payments by date for trend chart
    const dailyData = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      totalRevenue: totalRevenue[0]?.total || 0,
      paidCount,
      failedCount,
      dailyData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};
