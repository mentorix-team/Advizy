import jwt from "jsonwebtoken";

const INTERNAL_SECRET = "yourInternalToken";

export const verifyInternalToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, INTERNAL_SECRET);

    // Optionally check payload role
    if (decoded.role !== "admin" && decoded.role !== "superAdmin") {
      return res.status(403).json({ message: "Access denied: invalid role" });
    }

    req.internal = decoded; // If needed later in controller
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
