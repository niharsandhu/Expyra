// utils/dateUtils.js

// Check if a date is expiring within 'days' days
function isExpiringSoon(expiryDate, days = 2) {
    const now = new Date();
    const diff = new Date(expiryDate) - now;
    const diffDays = diff / (1000 * 60 * 60 * 24);
    return diffDays <= days && diffDays >= 0;
}

// Format date to YYYY-MM-DD
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = { isExpiringSoon, formatDate };
