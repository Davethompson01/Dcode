const jwt = require("jsonwebtoken");
const secretKey = "12345Dcode"; // Use environment variables for security

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token missing." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.data; // Assuming `data` contains user details
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid." });
  }
};

module.exports = checkAuth;
