const jwt = require("jsonwebtoken");
const ggpKey = process.env.GGP_SECRET_KEY;
const db = require("../sqlconnection");

// User auth middleware (for client-only routes)
const userAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, ggpKey);
    if (!decoded.user) {
      return res.status(403).json({ message: "Access denied. Invalid user." });
    }
    req.userInfo = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { userAuth };