const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  const token = req.cookies.token; // needed for cookie based

  if (!token) return res.status(401).json({ error: "Token Not Found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
        console.log("User authenticated:", decoded.email);
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { jwtAuthMiddleware, generateToken };
