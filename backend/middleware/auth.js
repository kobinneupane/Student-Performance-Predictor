const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If you want to restrict to teachers only
    if (decoded.role && decoded.role !== "teacher") {
      return res.status(403).json({ error: "🚫 Access denied. Teachers only." });
    }

    req.teacher = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;
