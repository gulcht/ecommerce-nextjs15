import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import {
  createCoupon,
  deleteCoupon,
  fetchAllCoupons,
  // getCouponById,
  // updateCoupon,
} from "../controllers/couponController";

const router = express.Router();
router.use(authenticateJwt);

router.get("/", fetchAllCoupons);
router.post("/create-coupon", isSuperAdmin, createCoupon);
router.delete("/:id", isSuperAdmin, deleteCoupon);

// router.get("/:id", authenticateJwt, getCouponById);
// router.put("/:id", authenticateJwt, isSuperAdmin, updateCoupon);
export default router;
