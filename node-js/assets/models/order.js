const pool = require("../../config/database");

class Order {
  static async createOrder(userId, products) {
    const client = await pool.connect();
    try {
      // Verify user exists and has sufficient balance
      const userCheckResult = await client.query(
        "SELECT balance FROM users WHERE user_id = $1",
        [userId]
      );

      if (userCheckResult.rows.length === 0) {
        throw new Error("User does not exist");
      }

      const userBalance = userCheckResult.rows[0].balance;
      if (userBalance <= 0.00) {
        throw new Error("Insufficient balance to place an order");
      }

      // Begin transaction
      await client.query('BEGIN');

      // Fetch product details including price from the database
      let totalAmount = 0;
      const orderItems = [];
      for (const product of products) {
        const productResult = await client.query(
          "SELECT price FROM products WHERE id = $1",
          [product.product_id]
        );

        if (productResult.rows.length === 0) {
          throw new Error(`Product with ID ${product.product_id} does not exist`);
        }

        const price = productResult.rows[0].price;
        const total = price * product.quantity;
        totalAmount += total;

        orderItems.push([
          product.product_id,
          product.quantity,
          price,
          total
        ]);
      }

      // Insert into orders table
      const orderResult = await client.query(
        "INSERT INTO orders (user_id, order_total, created_at, status) VALUES ($1, $2, NOW(), 'pending') RETURNING order_id",
        [userId, totalAmount]
      );
      const orderId = orderResult.rows[0].order_id;

      // Insert each item into the order_items table
      const orderItemsQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price, total) 
        VALUES ($1, $2, $3, $4, $5)
      `;
      for (const item of orderItems) {
        await client.query(orderItemsQuery, [orderId, ...item]);
      }

      // Commit transaction
      await client.query('COMMIT');
      return { success: "Order created successfully", order_id: orderId };
    } catch (error) {
      await client.query('ROLLBACK');
      return { error: `Failed to create order: ${error.message}` };
    } finally {
      client.release();
    }
  }
}

module.exports = Order;
