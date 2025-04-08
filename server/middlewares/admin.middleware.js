import jwt from "jsonwebtoken";

const INTERNAL_SECRET = "yourInternalToken";

export const verifyInternalToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "yourInternalToken");
    req.internal = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid internal token" });
  }
};