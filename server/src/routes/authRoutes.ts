import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/register", register);

export default router;
