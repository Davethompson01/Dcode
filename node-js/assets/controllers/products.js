// controllers/productController.js
const Product = require('../models/productModel');

const uploadProducts = async (req, res) => {
  const productsData = req.body;
  const successfulUploads = [];
  const errors = [];

  for (const product of productsData) {
    const validationErrors = Product.validateProductData(product);
    if (validationErrors.length) {
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

  res.json({
    status: errors.length ? 'partial' : 'success',
    uploaded: successfulUploads,
    errors: errors.length ? errors : undefined,
  });
};

module.exports = {
  uploadProducts,
};
