import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/media/proxy/**",
      },
      {
        pathname: "/blogs/**",
      },
      {
        pathname: "/my_pictures/**",
      },
      {
        pathname: "/app_icons/**",
      },
      {
        pathname: "/elemeents/**",
      },
    ],
  },
};

export default nextConfig;
