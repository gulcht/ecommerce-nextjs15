import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { JWTPayload, jwtVerify } from "jose";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    res
      .status(401)
      .json({ success: false, error: "Access token is not present" });
    return;
  }

  jwtVerify(accessToken, new TextEncoder().encode(process.env.JWT_SECRET))
    .then((res) => {
      const payload = res.payload as JWTPayload & {
        userId: string;
        email: string;
        role: string;
      };

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(401).json({ success: false, error: "Invalid access token" });
    });
};

export const isSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "SUPER_ADMIN") {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: "Access denied! Require Super Admin role!",
    });
  }
};
