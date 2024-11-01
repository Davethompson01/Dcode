// assets/routes/product.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/products"); // Already an instance
const checkAuth = require("../middlewares/auth");

router.post("/upload", checkAuth, productController.uploadProducts);
router.put("/update-product/:productId", checkAuth, productController.updateProduct);
router.delete("/delete-product/:productId", checkAuth, productController.deleteProduct);

module.exports = router;
