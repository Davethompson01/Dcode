// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/products/upload', productController.uploadProducts);

module.exports = router;
