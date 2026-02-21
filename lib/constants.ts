// lib/constants.ts
export const APP_NAME = "ElectroMart";

export const NAV_CATEGORIES = [
  {
    name: "Smartphones & Tablets",
    slug: "smartphones-tablets",
    icon: "Smartphone",
    subcategories: [
      { name: "Android Phones", slug: "android-phones" },
      { name: "iPhones", slug: "iphones" },
      { name: "Tablets", slug: "tablets" },
      { name: "Phone Cases", slug: "phone-cases" },
    ],
  },
  {
    name: "Laptops & Computers",
    slug: "laptops-computers",
    icon: "Laptop",
    subcategories: [
      { name: "Gaming Laptops", slug: "gaming-laptops" },
      { name: "Ultrabooks", slug: "ultrabooks" },
      { name: "Desktops", slug: "desktops" },
      { name: "Monitors", slug: "monitors" },
    ],
  },
  {
    name: "Audio & Headphones",
    slug: "audio-headphones",
    icon: "Headphones",
    subcategories: [
      { name: "Wireless Earbuds", slug: "wireless-earbuds" },
      { name: "Over-Ear", slug: "over-ear" },
      { name: "Speakers", slug: "speakers" },
      { name: "Soundbars", slug: "soundbars" },
    ],
  },
  {
    name: "Cameras & Photography",
    slug: "cameras-photography",
    icon: "Camera",
    subcategories: [
      { name: "DSLR", slug: "dslr" },
      { name: "Mirrorless", slug: "mirrorless" },
      { name: "Action Cameras", slug: "action-cameras" },
      { name: "Drones", slug: "drones" },
    ],
  },
  {
    name: "Gaming & Consoles",
    slug: "gaming-consoles",
    icon: "Gamepad2",
    subcategories: [
      { name: "PlayStation", slug: "playstation" },
      { name: "Xbox", slug: "xbox" },
      { name: "Nintendo", slug: "nintendo" },
      { name: "PC Gaming", slug: "pc-gaming" },
    ],
  },
  {
    name: "Smart Home & IoT",
    slug: "smart-home",
    icon: "Home",
    subcategories: [
      { name: "Smart Speakers", slug: "smart-speakers" },
      { name: "Security Cameras", slug: "security-cameras" },
      { name: "Smart Lighting", slug: "smart-lighting" },
      { name: "Thermostats", slug: "thermostats" },
    ],
  },
  {
    name: "Wearable Tech",
    slug: "wearable-tech",
    icon: "Watch",
    subcategories: [
      { name: "Smartwatches", slug: "smartwatches" },
      { name: "Fitness Trackers", slug: "fitness-trackers" },
      { name: "VR Headsets", slug: "vr-headsets" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    icon: "Cable",
    subcategories: [
      { name: "Chargers & Cables", slug: "chargers-cables" },
      { name: "Power Banks", slug: "power-banks" },
      { name: "Storage", slug: "storage" },
      { name: "Adapters", slug: "adapters" },
    ],
  },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Deals & Offers", href: "/products?deal=true" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Best Sellers", href: "/products?sort=best-selling" },
    { label: "Gift Cards", href: "/gift-cards" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Order Tracking", href: "/track-order" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Sell on ElectroMart", href: "/vendor/apply" },
    { label: "Affiliate Program", href: "/affiliate" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  VENDOR: "VENDOR",
  CUSTOMER: "CUSTOMER",
  DELIVERY: "DELIVERY",
} as const;