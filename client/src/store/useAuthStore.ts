import axios from "axios";
import { API_ROUTES } from "../utils/api"; // ตรวจสอบ path ให้ถูกต้อง
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "SUPER_ADMIN";
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<string | null>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<Boolean>;
};

// **ไม่ต้องสร้าง axiosInstance ตรงนี้แล้ว**
// const axiosInstance = axios.create({
//   baseURL: API_ROUTES.AUTH,
//   withCredentials: true,
// });

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => {
      // สร้าง axiosInstance ตรงนี้แทน หรือใช้ axios โดยตรงกับ URL เต็ม
      const axiosInstance = axios.create({
        baseURL: API_ROUTES.AUTH, // **มั่นใจได้ว่า API_ROUTES.AUTH มีค่าแล้ว ณ จุดนี้**
        withCredentials: true,
      });

      return {
        user: null,
        isLoading: false,
        error: null,
        register: async (name, email, password, confirmPassword) => {
          set({ isLoading: true, error: null });

          if (password !== confirmPassword) {
            set({
              isLoading: false,
              error: "Passwords do not match",
            });
            return null;
          }

          try {
            const response = await axiosInstance.post("/register", {
              name,
              email,
              password,
              confirmPassword,
            });

            set({ isLoading: false });
            return response.data.userId;
          } catch (error) {
            set({
              isLoading: false,
              error: axios.isAxiosError(error)
                ? error?.response?.data?.error || "Registration failed"
                : "Registration failed",
            });

            return null;
          }
        },
        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axiosInstance.post("/login", {
              email,
              password,
            });

            set({ isLoading: false, user: response.data.user });
            return true;
          } catch (error) {
            set({
              isLoading: false,
              error: axios.isAxiosError(error)
                ? error?.response?.data?.error || "Login failed"
                : "Login failed",
            });

            return false;
          }
        },
        logout: async () => {
          set({ isLoading: true, error: null });
          try {
            await axiosInstance.post("/logout"); // จะใช้ baseURL ที่ถูกต้อง
            set({ user: null, isLoading: false });
          } catch (error) {
            set({
              isLoading: false,
              error: axios.isAxiosError(error)
                ? error?.response?.data?.error || "Logout failed"
                : "Logout failed",
            });
          }
        },
        refreshAccessToken: async () => {
          try {
            await axiosInstance.post("/refresh-token");
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        },
      };
    },
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
