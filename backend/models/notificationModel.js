// models/notificationModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProduct', required: true },
    message: { type: String, required: true },
    channel: { type: String, enum: ['whatsapp'], default: 'whatsapp' },
    sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
