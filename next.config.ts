/** @type {import('next').NextConfig} */
const backendUrl =
  process.env.BACKEND_URL || "http://localhost:5000";

const nextConfig: import("next").NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/v1/:path*",
  //       destination: `${backendUrl}/api/v1/:path*`,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
