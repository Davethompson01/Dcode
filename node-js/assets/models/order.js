const pool = require("../../config/database");

class Order {
  static async createOrder(userId, products) {
    const connection = await pool.getConnection();
    try {
      // Verify the user exists
      const [userCheck] = await connection.execute(
        "SELECT * FROM admin WHERE email = ?",
        [userId]
      );
      if (userCheck.length === 0) {
        throw new Error("User does not exist");
      }

      // Start transaction
      await connection.beginTransaction();

      // Calculate total amount
      const totalAmount = products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );

      // Insert into orders table
      const [orderResult] = await connection.execute(
        "INSERT INTO orders (user_id, order_total) VALUES (?, ?)",
        [userId, totalAmount]
      );
      const orderId = orderResult.insertId;

      // Ensure each product is properly structured for the SQL query
      const orderItems = products.map((product) => [
        orderId,
        product.product_id,
        product.quantity,
        product.price,
        product.price * product.quantity,
      ]);

      // Insert each product as an order item
      await connection.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price, total) VALUES ?",
        [orderItems]
      );

      await connection.commit();
      return { success: "Order created successfully", order_id: orderId };
    } catch (error) {
      await connection.rollback();
      return { error: `Failed to create order: ${error.message}` };
    } finally {
      connection.release();
    }
  }
}

module.exports = Order;
