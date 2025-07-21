const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "test_secret"; // fallback cho test

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ." });
  }
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ message: "Bạn không có quyền truy cập." });
    }
  };
};
