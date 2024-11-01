const pool = require("../../config/database");

class Product {
  static async createProduct(productData) {
    const client = await pool.getConnection();
    try {
      const categoryQuery =
        "SELECT categories_id FROM categories WHERE category_name = ?";
      const [categoryResult] = await client.execute(categoryQuery, [
        productData.categories_name,
      ]);
      const category = categoryResult[0];

      if (!category) {
        return { error: "Invalid category name" };
      }

      const productToken = Math.random().toString(36).substring(2, 9);

      const query = `INSERT INTO products 
                (product_name, product_category, product_token, product_image, price, amount_in_stock, product_details, colors, origin, about_items) 
                VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

      await client.execute(query, values);
      return { status: "success", message: "Product uploaded successfully" };
    } catch (error) {
      return { error: "Failed to upload product: " + error.message };
    } finally {
      client.release();
    }
  }

  static validateProductData(productData) {
    const errors = {};
    
    // Validate required fields
    if (!productData.product_name) {
      errors.product_name = "Product name is required.";
    }
    if (!productData.categories_name) {
      errors.categories_name = "Category name is required.";
    }
    if (typeof productData.price !== 'number' || productData.price < 0) {
      errors.price = "Price must be a positive number.";
    }
    if (typeof productData.amount_in_stock !== 'number' || productData.amount_in_stock < 0) {
      errors.amount_in_stock = "Amount in stock must be a non-negative number.";
    }
    // Additional validations can be added here...

    return errors;
  }
}

module.exports = Product;
