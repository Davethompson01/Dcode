const jwt = require('jsonwebtoken');
require('dotenv').config(); // Make sure to use environment variables

// Middleware to check authorization
const checkAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Authorization token not provided.' });
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(cleanToken, process.env.JWT_SECRET || '12345Dcode', (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err); // Log error for debugging
            return res.status(403).json({ status: 'error', message: 'Invalid authorization token.', error: err.message });
        }

        // Store user data in request for later use
        req.user = {
            id: decoded.data.id,
            username: decoded.data.username,
            role: decoded.data.role, // Store role if needed
        };

        console.log(`Authenticated user: ${req.user.username}, Role: ${req.user.role}`); // Log user info for debugging
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = checkAuth;
