import { prisma } from "../server";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken, setTokens } from "../utils/token";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(400).json({ success: false, error: "Email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const extractCurrentUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (
      !extractCurrentUser ||
      !(await bcrypt.compare(password, extractCurrentUser.password))
    ) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    const { accessToken, refreshToken } = generateToken(
      extractCurrentUser.id,
      extractCurrentUser.email,
      extractCurrentUser.role
    );
    await setTokens(res, accessToken, refreshToken);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: extractCurrentUser.id,
        name: extractCurrentUser.name,
        email: extractCurrentUser.email,
        role: extractCurrentUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ error: "Invalid refresh token" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
      },
    });
    if (!user) {
      res.status(401).json({ success: false, error: "User not found" });
      return;
    }
    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      user.id,
      user.email,
      user.role
    );
    await setTokens(res, accessToken, newRefreshToken);
    res.status(200).json({
      success: true,
      message: "Refresh token refreshed successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Refresh token error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logout successful" });
};
