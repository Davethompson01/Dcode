// controllers/orderController.js
const Order = require('../models/order');
const Product = require('../models/product');

class OrderController {
  static async createOrder(req, res) {
    const { user_id, product_id, order_quantity } = req.body;

    // Validate input
    if (!user_id || !product_id || !order_quantity) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'User  ID, product ID, and quantity are required' 
      });
    }

    try {
      // Retrieve product details
      const product = await Product.getProductById(product_id);
      if (!product) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Invalid product ID' 
        });
      }

      // Prepare product data for the order
    // Prepare product data for the order
const products = [
  {
    product_id,
    price: product.price, // Ensure price is not null
    quantity: order_quantity
  }
];

      // Create the order
      const response = await Order.createOrder(user_id, products);
      if (response.error) {
        return res.status(500).json({ 
          status: 'error', 
          message: 'Order creation failed', 
          error: response.error 
        });
      }

      // Success response
      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating order:", error); // Log the error for debugging
      res.status(500).json({ 
        status: 'error', 
        message: 'Order creation failed', 
        error: error.message 
      });
    }
  }
}

module.exports = OrderController;