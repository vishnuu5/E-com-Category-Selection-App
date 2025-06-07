import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check cookies
  const cookies = request.headers.get("cookie");
  if (cookies) {
    const tokenCookie = cookies
      .split(";")
      .find((c) => c.trim().startsWith("token="));
    if (tokenCookie) {
      return tokenCookie.split("=")[1];
    }
  }

  return null;
}
