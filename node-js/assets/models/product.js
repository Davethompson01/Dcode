// models/product.js
const pool = require('../../config/database');

class Product {
    static validateProductData(productData) {
        const errors = {};
        
        if (!productData.product_name || typeof productData.product_name !== 'string') {
            errors.product_name = 'Product name is required and must be a string.';
        }

        if (!productData.categories_name || typeof productData.categories_name !== 'string') {
            errors.categories_name = 'Category name is required and must be a string.';
        }

        if (!productData.product_image || typeof productData.product_image !== 'string') {
            errors.product_image = 'Product image URL is required and must be a string.';
        }

        if (!productData.price || typeof productData.price !== 'number') {
            errors.price = 'Price is required and must be a number.';
        }

        if (!productData.amount_in_stock || typeof productData.amount_in_stock !== 'number') {
            errors.amount_in_stock = 'Amount in stock is required and must be a number.';
        }

        if (!productData.product_details || typeof productData.product_details !== 'string') {
            errors.product_details = 'Product details are required and must be a string.';
        }

        // You can add more validation checks as necessary.

        return errors;
    }

    static async createProduct(productData) {
        try {
            const categoryQuery = 'SELECT categories_id FROM categories WHERE categories_name = $1';
            const categoryResult = await pool.query(categoryQuery, [productData.categories_name]);
            const category = categoryResult.rows[0];
    
            if (!category) {
                return { error: 'Invalid category name' }; // Make sure to return in the correct format
            }
    
            const productToken = Math.random().toString(36).substring(2, 9);
            const query = `INSERT INTO products 
                (product_name, product_category, product_token, product_image, price, amount_in_stock, product_details, colors, origin, about_items) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
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
    
            await pool.query(query, values);
            return { success: 'Product uploaded successfully' }; // Make sure to return success in the correct format
        } catch (error) {
            console.error('Error uploading product:', error);
            return { error: 'Failed to upload product: ' + error.message }; // Ensure this is always returned
        }
        return{}
    }
    

    static async updateProduct(productId, productData) {
        try {
            const categoryQuery = 'SELECT categories_id FROM categories WHERE categories_name = $1';
            const categoryResult = await pool.query(categoryQuery, [productData.categories_name]);
            const category = categoryResult.rows[0];

            if (!category) {
                return { error: 'Invalid category name' };
            }

            const query = `UPDATE products 
                SET product_name = $1, product_category = $2, product_image = $3, price = $4, 
                    amount_in_stock = $5, product_details = $6, colors = $7, origin = $8, about_items = $9 
                WHERE product_id = $10`;
            const values = [
                productData.product_name,
                category.categories_id,
                productData.product_image,
                productData.price,
                productData.amount_in_stock,
                productData.product_details,
                productData.colors,
                productData.origin,
                productData.about_items,
                productId,
            ];

            await pool.query(query, values);
            return { success: 'Product updated successfully' };
        } catch (error) {
            console.error('Error updating product:', error);
            return { error: 'Failed to update product: ' + error.message };
        }
    }

    static async deleteProduct(productId) {
        try {
            const query = 'DELETE FROM products WHERE product_id = $1';
            await pool.query(query, [productId]);
            return { success: 'Product deleted successfully' };
        } catch (error) {
            console.error('Error deleting product:', error);
            return { error: 'Failed to delete product: ' + error.message };
        }
    }

    static async getProductById(productId) {
        try {
            const result = await pool.query(
                "SELECT * FROM products WHERE product_id = $1",
                [productId]
            );
            return result.rows[0] || null; // Returns product if found, or null if not found
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            return { error: 'Failed to fetch product: ' + error.message };
        }
    }
    
}

module.exports = Product;
