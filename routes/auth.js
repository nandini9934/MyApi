// Dummy API key list (should come from a database in productionject)
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("token");
  const secretKey = "yourSecretKey";
  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  // Check if the provided API key is valid
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return;
    }
    next();
    // Now you can access the payload from the decoded object
  });

  // If the API key is valid, allow access
  next();
};

module.exports = auth;
