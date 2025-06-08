import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
}

interface CouponStore {
  couponList: Coupon[];
  isLoading: boolean;
  error: string | null;
  fetchCoupons: () => Promise<void>;
  createCoupon: (
    coupon: Omit<Coupon, "id" | "usageCount">,
  ) => Promise<Coupon | null>;
  deleteCoupon: (id: string) => Promise<boolean>;
}

export const useCouponStore = create<CouponStore>((set, get) => ({
  couponList: [],
  isLoading: false,
  error: null,

  fetchCoupons: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.COUPON}`, {
        withCredentials: true,
      });
      console.log(response);
      set({ couponList: response.data.couponList, isLoading: false });
    } catch (e) {
      set({ error: "Failed to fetch products (admin)", isLoading: false });
    }
  },

  createCoupon: async (coupon) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.COUPON}/create-coupon`,
        coupon,
        {
          withCredentials: true,
        },
      );
      set({ isLoading: false });
      return response.data.coupon;
    } catch (e) {
      set({ error: "Failed to create coupon (admin)", isLoading: false });
    }
  },
  deleteCoupon: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_ROUTES.COUPON}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data.success;
    } catch (e) {
      set({ error: "Fail to delete coupon (admin)", isLoading: false });
    }
  },
}));
