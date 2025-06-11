import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/authRoutes";
import productRoutes from "../src/routes/productRoutes";
import couponRoutes from "../src/routes/couponRoutes";
import cartRoutes from "../src/routes/cartRoutes";
import settingRoutes from "../src/routes/settingRoutes";
import addressRoutes from "../src/routes/addressRoutes";
import orderRoutes from "../src/routes/orderRoutes";

// load environment variables
dotenv.config();

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGNINT", async () => {
  await prisma.$disconnect();
  process.exit(1);
});
