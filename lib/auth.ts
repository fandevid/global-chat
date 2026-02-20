import jwt from "jsonwebtoken";

type Payload = { userId: string; username: string };

export function signToken(payload: Payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET belum diset");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET belum diset");
  return jwt.verify(token, secret) as Payload;
}