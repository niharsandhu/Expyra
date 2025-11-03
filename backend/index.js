const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const routes = require('./routes/routes');
const paymentRoutes = require("./routes/paymentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationController = require('./controllers/notificationController');

const app = express();

// === Middlewares ===
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Cron Job (daily at 9 AM IST)
cron.schedule('0 9 * * *', async () => {
    console.log("⏰ Running daily expiry check at", new Date().toLocaleString());
    try {
        await notificationController.sendExpiryNotifications(
            { body: {} },
            {
                json: (data) => console.log("📢 Cron Job result:", data),
                status: (code) => ({
                    json: (data) => console.error(`Error ${code}:`, data)
                })
            }
        );
    } catch (err) {
        console.error("❌ Cron job failed:", err.message);
    }
}, {
    timezone: "Asia/Kolkata"
});
