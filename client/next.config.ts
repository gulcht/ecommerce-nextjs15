import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // <-- เพิ่มโดเมนนี้เข้ามา
  },
};

export default nextConfig;
