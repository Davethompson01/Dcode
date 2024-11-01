const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');
const checkAuth = require('../middlewares/auth');

const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: 'error', message: 'Permission denied.' });
        }
        next();
    };
};

router.post('/upload', checkAuth, authorizeRoles(['admin', 'seller']), async (req, res) => {
    try {
        const response = await productController.uploadProducts(req, res);
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to upload products.', error: error.message });
    }
});


// Fetch products by category
router.get('/category/:categoryName', checkAuth, async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const response = await productController.getProductsByCategory(categoryName);
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch products by category.', error: error.message });
    }
});

// Fetch random products
router.get('/random/:limit?', checkAuth, async (req, res) => {
    try {
        const limit = req.params.limit || 20;
        const response = await productController.getRandomProducts(limit);
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch random products.', error: error.message });
    }
});

// Fetch most-checked category
router.get('/most-checked', checkAuth, async (req, res) => {
    try {
        const response = await productController.getMostCheckedCategory();
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch most-checked category.', error: error.message });
    }
});

module.exports = router;
