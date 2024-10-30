// models/productModel.js
const pool = require('../config/db');

class Product {
  static async createProduct(productData) {
    try {
      const categoryQuery = 'SELECT categories_id FROM categories WHERE category_name = $1';
      const categoryResult = await pool.query(categoryQuery, [productData.categories_name]);
      if (!categoryResult.rows.length) {
        throw new Error('Invalid category name');
      }

      const productToken = Math.random().toString(36).substr(2, 10);
      const insertQuery = `
        INSERT INTO products (product_name, product_category, product_token, product_image, price, amount_in_stock, product_details, colors, origin, about_items)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
      `;
      const values = [
        productData.product_name,
        categoryResult.rows[0].categories_id,
        productToken,
        productData.product_image,
        productData.price,
        productData.amount_in_stock,
        productData.product_details,
        productData.colors,
        productData.origin,
        productData.about_items,
      ];

      const result = await pool.query(insertQuery, values);
      return { success: true, product: result.rows[0] };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async getProductsByCategory(categoryName) {
    const query = `
      SELECT p.product_name, p.product_image, p.price, p.amount_in_stock, p.product_details, p.colors, p.origin, p.about_items
      FROM products p
      JOIN categories c ON p.product_category = c.categories_id
      WHERE c.category_name = $1
      LIMIT 25
    `;
    const result = await pool.query(query, [categoryName]);
    return result.rows;
  }

  static async getRandomProducts(limit = 20) {
    const query = `
      SELECT product_name, product_image, price, amount_in_stock, product_details, colors, origin, about_items 
      FROM products 
      ORDER BY RANDOM() 
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Product;
