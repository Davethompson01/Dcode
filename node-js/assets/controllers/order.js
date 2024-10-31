// controllers/orderController.js
const Order = require('../models/order');
const Product = require('../models/product');

class OrderController {
  static async createOrder(req, res) {
    const { user_id, product_id, order_quantity } = req.body;

    if (!user_id || !product_id || !order_quantity) {
      return res.status(400).json({ status: 'error', message: 'User ID, product ID, and quantity are required' });
    }

    try {
      const product = await Product.getProductById(product_id);
      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Invalid product ID' });
      }

      const products = [{
        product_id,
        price: product.price,
        quantity: order_quantity
      }];

      const response = await Order.createOrder(user_id, products);
      res.json(response);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Order creation failed', error: error.message });
    }
  }
}

module.exports = OrderController;
