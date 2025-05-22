const jwt = require("jsonwebtoken");
const ggpKey = process.env.GGP_SECRET_KEY;

const userAuth = (...allowedRoles) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, ggpKey);
      const user = decoded.user;
      const userRole = user?.role || "user";

      const roles = allowedRoles.length > 0 ? allowedRoles : ["user"];
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied. Invalid role." });
      }

      req.userInfo = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = { userAuth };