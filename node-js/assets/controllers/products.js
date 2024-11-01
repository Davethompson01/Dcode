const Product = require("../models/product");

class ProductController {
  async uploadProducts(req, res) {
    const productsData = req.body;

    if (!Array.isArray(productsData)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid data format. Expected an array of products.",
      });
    }

    const successfulUploads = [];
    const errors = [];

    for (const product of productsData) {
      const validationErrors = Product.validateProductData(product); // Use static method
      if (Object.keys(validationErrors).length > 0) {
        errors.push({
          product_name: product.product_name,
          errors: validationErrors,
        });
        continue;
      }

      const result = await Product.createProduct(product);
      if (result.error) {
        errors.push({
          product_name: product.product_name,
          errors: result.error,
        });
      } else {
        successfulUploads.push({
          product_name: product.product_name,
          status: "Uploaded successfully",
        });
      }
    }

    if (errors.length > 0) {
      return res.status(207).json({
        status: "partial",
        uploaded: successfulUploads,
        errors,
        message: "Some products failed to upload. Check errors for details.",
      });
    } else {
      return res.status(200).json({
        status: "success",
        uploaded: successfulUploads,
        message: "All products uploaded successfully.",
      });
    }
  }
}

module.exports = new ProductController();

// module.exports = new ProductController();
