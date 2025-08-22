const mongoose = require('mongoose');

const userProductSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    expiryDate: { type: Date, required: true },
    scanImageURL: { type: String }, // optional: store original scan image
    notified: { type: Boolean, default: false } // if user has been notified
}, { timestamps: true });

module.exports = mongoose.model('UserProduct', userProductSchema);
