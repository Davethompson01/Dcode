const Product = require("../models/product");

class ProductController {
  async uploadProducts(req, res) {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only admins can upload products.",
      });
    }

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
      try {
        const validationErrors = Product.validateProductData(product);
        if (Object.keys(validationErrors).length > 0) {
          errors.push({
            product_name: product.product_name,
            errors: validationErrors,
          });
          continue;
        }

        const result = await Product.createProduct(product);
        if (result?.error) {
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
      } catch (err) {
        console.error(`Error processing product ${product.product_name}:`, err);
        errors.push({
          product_name: product.product_name,
          errors: { message: "An unexpected error occurred." },
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Some products failed to upload. Check errors for details.",
        errors,
      });
    }

    return res.status(200).json({
      status: "success",
      uploaded: successfulUploads,
    });
  }

  async updateProduct(req, res) {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only admins can update products.",
      });
    }

    const { productId } = req.params;
    const productData = req.body;
    const validationErrors = Product.validateProductData(productData);

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid product data.",
        errors: validationErrors,
      });
    }

    const result = await Product.updateProduct(productId, productData);
    if (result.error) {
      return res.status(400).json({
        status: "error",
        message: result.error,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.success,
    });
  }

  async deleteProduct(req, res) {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only admins can delete products.",
      });
    }

    const { productId } = req.params;
    const result = await Product.deleteProduct(productId);

    if (result.error) {
      return res.status(400).json({
        status: "error",
        message: result.error,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.success,
    });
  }
}

module.exports = new ProductController();
