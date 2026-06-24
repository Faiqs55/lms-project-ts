import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
        domains: ['res.cloudinary.com','randomuser.me'],
        unoptimized: true
      },
};

export default nextConfig;
