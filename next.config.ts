/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    remotePatterns: [
  { protocol: "https", hostname: "randomuser.me" },
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "i.pravatar.cc" },
  { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

module.exports = nextConfig;
