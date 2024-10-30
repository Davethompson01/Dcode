const Product = require('../models/product');

class ProductController {
    async uploadProducts(productsData) {
        const successfulUploads = [];
        const errors = [];

        for (const product of productsData) {
            const validationErrors = await Product.validateProductData(product);
            if (Object.keys(validationErrors).length > 0) {
                errors.push({ product_name: product.product_name, errors: validationErrors });
                continue;
            }

            const result = await Product.createProduct(product);
            if (result.error) {
                errors.push({ product_name: product.product_name, errors: result.error });
            } else {
                successfulUploads.push({ product_name: product.product_name, status: 'Uploaded successfully' });
            }
        }

        if (errors.length > 0) {
            return { status: 'partial', uploaded: successfulUploads, errors };
        } else {
            return { status: 'success', uploaded: successfulUploads, message: 'All products uploaded successfully.' };
        }
    }

    // Additional controller methods for fetching products can be added similarly...
}

module.exports = new ProductController();