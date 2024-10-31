// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order');

router.post('/create', OrderController.createOrder);

module.exports = router;
