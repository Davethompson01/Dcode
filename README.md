# E-commerce

This repository provides an API for managing products, handling user signups, processing orders, and handling authentication for an e-commerce platform. The was built using PHP, Node.js, Express, PostgreSQL, and Firebase JWT for token-based authorization.

## Features

- **Product Management**: Create, update, delete, and retrieve products By admin alone.
- **Order Processing**: Create orders, check product availability, and ensure users have sufficient balance using stripe for my payment gateway.
- **User and Admin Signup**: Different signup flows for users and admins, with Stripe integration for user accounts.
- **JWT Authorization**: Secure routes using Firebase JWT for token-based authorization.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Usage](#usage)
   - [Product Routes](#product-routes)
   - [Order Management](#order-management)
   - [User Signup](#user-signup)
   - [Authorization](#authorization)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)


## Installation

1. Clone the repository:
    ```bash
  https://github.com/Davethompson01/Dcode.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```


## Configuration

Make sure to have a PostgreSQL database set up with tables for `products`, `categories`, `orders`,`admin` and `users`. 

Update `config/database.js` to match your PostgreSQL configuration.

## Usage

## Product Routes

### `assets/routes/product.js`

This file manages the routes for product operations within the API.

- **POST /upload**: Authenticated users can upload new products.
- **PUT /update-product/:productId**: This endpoint allows authenticated users to update existing product details based on the provided `productId`.
- **DELETE /delete-product/:productId**: This endpoint allows authenticated users to delete a product using its `productId`.

```javascript

router.post("/upload", checkAuth, productController.uploadProducts);
router.put("/update-product/:productId", checkAuth, productController.updateProduct);
router.delete("/delete-product/:productId", checkAuth, productController.deleteProduct);


## Order Routes

### `routes/orderRoutes.js`

This file defines the routes related to orders in the e-commerce API.

- **POST /create**: This endpoint allows users to create an order. It utilizes the `createOrder` method from the `OrderController`.

```javascript
router.post('/create', OrderController.createOrder);


# Token Generation and Authorization Code Explanation

This section outlines the implementation of token generation and authorization using JSON Web Tokens (JWT) within the E-Commerce API. The primary classes involved are `TokenGenerator` for creating tokens and `Authorization` for validating them.

## Token Generator

### `App\Utilities\TokenGenerator`

The `TokenGenerator` class is responsible for generating JWT tokens for users upon signup or login.

#### Properties

- **$secretKey**: A private key used for signing the tokens. In this implementation, it is set to `'12345Dcode'`.
- **$algorithm**: Specifies the algorithm used for signing, set to `'HS256'`.

#### Methods

- **generateToken($userId, $username, $email, $isAdminSignup)**:
     Generates a JWT token containing user information.
    - The method determines the user role based on the `$isAdminSignup` parameter, assigning either `'admin'` or `'user'`.
    - Creates a payload that includes:
        - `iat`: Issued at time.
        - `exp`: Expiration time (set to 160 minutes).
        - `data`: An array containing `id`, `username`, `email`, and `role`.
    - The method encodes and returns the generated token.



