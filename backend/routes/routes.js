// routes.js
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authmiddleware');

// User
router.post('/users', userController.createUser);
router.post('/users/login', userController.loginUser);
router.get('/stats',authMiddleware,userController.getUserStats);

// Product
router.post('/products/scan',authMiddleware, productController.upload, productController.scanProduct);

// Notifications (WhatsApp only now)
router.post('/notifications/send', notificationController.sendExpiryNotifications);

router.get('/products',authMiddleware, productController.getAllUserProducts);

module.exports = router;

