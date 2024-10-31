const Product = require('../models/product');

class ProductController {
    // Method to handle batch upload of products
    async uploadProducts(req, res) {
        const productsData = req.body;
        const successfulUploads = [];
        const errors = [];

        for (const product of productsData) {
            // Validate individual product data
            const validationErrors = await Product.validateProductData(product);
            if (Object.keys(validationErrors).length > 0) {
                errors.push({ product_name: product.product_name, errors: validationErrors });
                continue;  // Skip to the next product if validation fails
            }

            // Attempt to create each product in the database
            const result = await Product.createProduct(product);
            if (result.error) {
                errors.push({ product_name: product.product_name, errors: result.error });
            } else {
                successfulUploads.push({ product_name: product.product_name, status: 'Uploaded successfully' });
            }
        }

        // Send a summary response with both successful and failed uploads
        if (errors.length > 0) {
            return res.status(207).json({
                status: 'partial',
                uploaded: successfulUploads,
                errors,
                message: 'Some products failed to upload. Check errors for details.'
            });
        } else {
            return res.status(200).json({
                status: 'success',
                uploaded: successfulUploads,
                message: 'All products uploaded successfully.'
            });
        }
    }

    // Additional controller methods for fetching products can be added similarly...
}

module.exports = new ProductController();
