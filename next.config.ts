/** @type {import('next').NextConfig} */
const backendUrl =
  process.env.NODE_ENV === "production"
    ? process.env.BACKEND_URL_PROD
    : process.env.BACKEND_URL;

const nextConfig: import("next").NextConfig = {
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
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
