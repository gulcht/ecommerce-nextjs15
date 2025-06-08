import express from "express"
import { login, logout, refreshAccessToken, register } from '../controllers/authContoller';

const router = express.Router();

router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh-token", refreshAccessToken)
router.post("/register", register)

export default router;