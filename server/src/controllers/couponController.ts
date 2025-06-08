import cloudinary from "../config/cloudinary";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import { prisma } from "../server";
import fs from "fs";

// create Coupon
export const createCoupon = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { code, discountPercent, startDate, endDate, usageLimit } = req.body;

    const newlyCreatedCoupon = await prisma.coupon.create({
      data: {
        code,
        discountPercent: parseInt(discountPercent),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: parseInt(usageLimit),
        usageCount: 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Coupon created succesfully",
      coupon: newlyCreatedCoupon,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Create Coupon failed, Some error occured",
    });
  }
};

// fetch all Coupons (admin side)
export const fetchAllCoupons = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json({ success: true, message: "", couponList: coupons });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Fetch all Coupons failed, Some error occured",
    });
  }
};

// get Coupon by id
export const getCouponById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.findUnique({
      where: {
        id,
      },
    });
    if (!coupon) {
      res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
      return;
    }
    res.status(200).json(coupon);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "get Coupon by id failed, Some error occured",
    });
  }
};

// update Coupon by id (admin)
export const updateCoupon = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {} = req.body;

    const Coupon = await prisma.coupon.update({
      where: {
        id,
      },
      data: {},
    });
    res.status(200).json(Coupon);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Update Coupon failed, Some error occured",
    });
  }
};

// delete Coupon by id (admin)
export const deleteCoupon = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      id: id,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Delete Coupon failed, Some error occured",
    });
  }
};
