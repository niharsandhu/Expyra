const { isExpiringSoon } = require('../utils/dateUtils');
const { sendWhatsAppMessage } = require('../utils/notificationUtils');
const UserProduct = require('../models/userProductModel');
const Notification = require('../models/notificationModel');
const { generateExpiryNotification } = require('../utils/geminiUtils');

exports.sendExpiryNotifications = async (req, res) => {
  try {
    const { userId } = req.body; // optional now

    // If userId provided → send for that user only
    // If not → send for all users (cron case)
    const query = userId ? { user: userId } : {};

    const items = await UserProduct.find(query)
      .populate('user')
      .populate('product');

    let sentCount = 0;

    for (const item of items) {
      if (isExpiringSoon(item.expiryDate) && !item.notified) {
        const formattedDate = new Date(item.expiryDate).toLocaleDateString('en-IN');

        // AI generated friendly notification
        const message = await generateExpiryNotification(item.product.name, formattedDate);

        await sendWhatsAppMessage(item.user.phone, message);

        await Notification.create({
          user: item.user._id,
          userProduct: item._id,
          message,
          channel: 'whatsapp',
        });

        item.notified = true;
        await item.save();

        sentCount++;
      }
    }

    // For API response
    if (res) {
      res.json({ message: `Sent ${sentCount} WhatsApp notifications ${userId ? `to user ${userId}` : `to all users`}` });
    } else {
      console.log(`📢 Sent ${sentCount} notifications ${userId ? `to user ${userId}` : `to all users`}`);
    }
  } catch (error) {
    console.error('Notification error:', error.message);
    if (res) {
      res.status(500).json({ error: 'Failed to send WhatsApp notifications' });
    }
  }
};
