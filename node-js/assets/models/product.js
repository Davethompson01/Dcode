const pool = require('../config/database');

class Product {
    static async createProduct(productData) {
        const client = await pool.connect();
        try {
            const categoryQuery = 'SELECT categories_id FROM categories WHERE category_name = $1';
            const categoryResult = await client.query(categoryQuery, [productData.categories_name]);
            const category = categoryResult.rows[0];

            if (!category) {
                return { error: 'Invalid category name' };
            }

            const productToken = Math.random().toString(36).substring(2, 9); // Generate a random token

            const query = `INSERT INTO products 
                (product_name, product_category, product_token, product_image, price, amount_in_stock, product_details, colors, origin, about_items) 
                VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
            const values = [
                productData.product_name,
                category.categories_id,
                productToken,
                productData.product_image,
                productData.price,
                productData.amount_in_stock,
                productData.product_details,
                productData.colors,
                productData.origin,
                productData.about_items,
            ];

            await client.query(query, values);
            return { success: 'Product uploaded successfully' };
        } catch (error) {
            return { error: 'Failed to upload product: ' + error.message };
        } finally {
            client.release();
        }
    }

    static async validateProductData(data) {
        const errors = {};
        if (!data.product_name) errors.product_name = "Product name is required.";
        if (!data.categories_name) errors.categories_name = "Categories name is required.";
        if (!data.price || isNaN(data.price)) errors.price = "Valid price is required.";
        if (!data.amount_in_stock || isNaN(data.amount_in_stock)) errors.amount_in_stock = "Amount in stock must be a valid number.";
        return errors;
    }

    // Additional methods for fetching products can be added similarly...
}

module.exports = Product;