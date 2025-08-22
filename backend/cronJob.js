// cronJob.js
const cron = require('node-cron');
const mongoose = require('mongoose');
require('dotenv').config();

const notificationController = require('./controllers/notificationController');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected for Cron Job"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Schedule the job
// "0 9 * * *" → runs every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
    console.log("⏰ Running daily expiry check at", new Date().toLocaleString());

    try {
        // Call controller directly (without HTTP)
        await notificationController.sendExpiryNotifications({
            body: {} // dummy req
        }, {
            json: (data) => console.log("📢 Cron Job result:", data),
            status: (code) => ({ json: (data) => console.error(`Error ${code}:`, data) })
        });
    } catch (err) {
        console.error("❌ Cron job failed:", err.message);
    }
}, {
    timezone: "Asia/Kolkata" // Adjust to your timezone
});
