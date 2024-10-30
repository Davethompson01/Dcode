const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const checkAuth = require('../middlewares/authMiddleware'); // Import the middleware

// Route to upload products
router.post('/upload', checkAuth, async (req, res) => {
    try {
        const response = await productController.uploadProducts(req.body, req.user); // Pass user info if needed
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to upload products.', error: error.message });
    }
});

// Route to get products by category
router.get('/category/:categoryName', checkAuth, async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const response = await productController.getProductsByCategory(categoryName);
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch products by category.', error: error.message });
    }
});

// Route to get random products
router.get('/random/:limit?', checkAuth, async (req, res) => {
    try {
        const limit = req.params.limit || 20; // Default to 20 if no limit is provided
        const response = await productController.getRandomProducts(limit);
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch random products.', error: error.message });
    }
});

// Route to get last updated products
router.get('/last-updated/:limit?', checkAuth, async (req, res) => {
    try {
        const limit = req.params.limit || 20; // Default to 20 if no limit is provided
        const response = await productController.getLastUpdatedProducts(limit);
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch last updated products.', error: error.message });
    }
});

// Route to get the most checked category
router.get('/most-checked', checkAuth, async (req, res) => {
    try {
        const response = await productController.getMostCheckedCategory();
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch most checked category.', error: error.message });
    }
});

module.exports = router;