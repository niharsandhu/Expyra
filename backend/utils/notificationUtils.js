const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Send WhatsApp message (sandbox or production)
async function sendWhatsAppMessage(to, message) {
    try {
        const response = await client.messages.create({
            from: `whatsapp:${process.env.WHATSAPP_FROM}`, // Your Twilio WhatsApp number
            to: `whatsapp:${to}`, // User's phone number
            body: message
        });
        console.log("WhatsApp message sent:", response.sid);
        return response;
    } catch (error) {
        console.error("WhatsApp send error:", error.message);
        throw error;
    }
}

module.exports = { sendWhatsAppMessage };

