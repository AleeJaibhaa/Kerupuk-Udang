import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Host preview Cloud yang diizinkan mengakses aset dev (HMR & chunk).
  allowedDevOrigins: [
    "pv-7baf25a0492c-f4be61d3-28d6-4492-a8c9-768319ff2297.style.dev",
  ],
};

export default nextConfig;
