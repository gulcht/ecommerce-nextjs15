import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";

export function generateToken(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = uuidv4();

  return { accessToken, refreshToken };
}

export async function setTokens(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // ms,  1 hour
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}
