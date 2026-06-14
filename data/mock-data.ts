// ============================================================
// ElectroMart — Complete Mock Data
// All data is typed and ready to swap with real API calls
// ============================================================

import type {
  Address,
  AdminAnalytics,
  Brand,
  Cart,
  Category,
  DeliveryProfile,
  Notification,
  Order,
  Product,
  Review,
  User,
  VendorProfile,
  WishlistItem,
} from "./types";

// ============================================================
// USERS
// ============================================================

export const mockUsers: User[] = [
  {
    id: "user-admin-1",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@electromart.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    role: "SUPER_ADMIN",
    isVerified: true,
    isBanned: false,
    phone: "+1 (555) 000-0001",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "user-vendor-1",
    name: "Marcus Chen",
    email: "tumpa@techstore.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    role: "VENDOR",
    isVerified: true,
    isBanned: false,
    phone: "+1 (555) 000-0002",
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "user-vendor-2",
    name: "Priya Sharma",
    email: "priya.sharma@gadgetzone.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    role: "VENDOR",
    isVerified: true,
    isBanned: false,
    phone: "+1 (555) 000-0003",
    createdAt: "2026-04-20T00:00:00Z",
    updatedAt: "2026-01-12T00:00:00Z",
  },
  {
    id: "user-cust-1",
    name: "John Smith",
    email: "john.smith@email.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    role: "CUSTOMER",
    isVerified: true,
    isBanned: false,
    phone: "+1 (555) 100-0001",
    createdAt: "2026-06-10T00:00:00Z",
    updatedAt: "2026-01-14T00:00:00Z",
  },
  {
    id: "user-cust-2",
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    role: "CUSTOMER",
    isVerified: true,
    isBanned: false,
    phone: "+1 (555) 100-0002",
    createdAt: "2026-07-22T00:00:00Z",
    updatedAt: "2026-01-13T00:00:00Z",
  },
  {
    id: "user-delivery-1",
    name: "Carlos Rivera",
    email: "carlos.rivera@delivery.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    role: "DELIVERY",
    isVerified: true,
    isBanned: false,
    phone: "+1 (555) 200-0001",
    createdAt: "2026-05-05T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
];

// ============================================================
// VENDOR PROFILES
// ============================================================

export const mockVendorProfiles: VendorProfile[] = [
  {
    id: "vendor-1",
    userId: "user-vendor-1",
    storeName: "TechStore Pro",
    logo: "https://images.unsplash.com/photo-1612838320302-4b3b3996e01e?w=100",
    coverImage:
      "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&q=80",
    specialty: "Apple · Samsung · Sony",
    badge: "Top Seller",
    offers: "Free shipping on all orders",
    bio: "Premium electronics and gadgets since 2015.",
    isApproved: true,
    totalProducts: 48,
    totalSales: 12,
    rating: 4.8,
    createdAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "vendor-2",
    userId: "user-vendor-2",
    storeName: "GadgetZone",
    logo: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=100",
    coverImage:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80",
    specialty: "Smart Home · Audio · Wearables",
    badge: "Trending",
    offers: "Up to 30% off this week",
    bio: "Your one-stop shop for the latest gadgets.",
    isApproved: true,
    totalProducts: 32,
    totalSales: 870,
    rating: 4.6,
    createdAt: "2026-04-20T00:00:00Z",
  },
];

// ============================================================
// DELIVERY PROFILES
// ============================================================

export const mockDeliveryProfiles: DeliveryProfile[] = [
  {
    id: "delivery-1",
    userId: "user-delivery-1",
    vehicleType: "bike",
    isAvailable: true,
    totalDeliveries: 312,
    createdAt: "2026-05-05T00:00:00Z",
  },
];

// ============================================================
// ADDRESSES
// ============================================================

export const mockAddresses: Address[] = [
  {
    id: "addr-1",
    userId: "user-cust-1",
    label: "home",
    fullName: "John Smith",
    phone: "+1 (555) 100-0001",
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    isDefault: true,
  },
  {
    id: "addr-2",
    userId: "user-cust-1",
    label: "office",
    fullName: "John Smith",
    phone: "+1 (555) 100-0001",
    street: "456 Business Ave, Floor 12",
    city: "New York",
    state: "NY",
    zipCode: "10005",
    country: "USA",
    isDefault: false,
  },
  {
    id: "addr-3",
    userId: "user-cust-2",
    label: "home",
    fullName: "Emily Johnson",
    phone: "+1 (555) 100-0002",
    street: "789 Oak Lane",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "USA",
    isDefault: true,
  },
];

// ============================================================
// CATEGORIES (8)
// ============================================================

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Smartphones",
    slug: "smartphones",
    description:
      "Latest flagship and budget smartphones from top brands worldwide",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    parentId: null,
    productCount: 32,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Laptops & Computers",
    slug: "laptops-computers",
    description:
      "Powerful laptops, desktops, and accessories for work and gaming",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    parentId: null,
    productCount: 28,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Audio & Headphones",
    slug: "audio-headphones",
    description:
      "Premium headphones, earbuds, speakers and audiophile equipment",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    parentId: null,
    productCount: 24,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "Cameras & Photography",
    slug: "cameras-photography",
    description: "DSLR, mirrorless cameras, lenses and photography accessories",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    parentId: null,
    productCount: 18,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "Wearables",
    slug: "wearables",
    description:
      "Smart watches, fitness trackers, AR glasses and wearable tech",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    parentId: null,
    productCount: 16,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-6",
    name: "Gaming",
    slug: "gaming",
    description: "Consoles, controllers, gaming peripherals and accessories",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400",
    parentId: null,
    productCount: 22,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-7",
    name: "Smart Home",
    slug: "smart-home",
    description:
      "Smart speakers, home automation, security cameras and IoT devices",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    parentId: null,
    productCount: 20,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-8",
    name: "Accessories",
    slug: "accessories",
    description:
      "Cables, chargers, cases, stands and all essential tech accessories",
    image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400",
    parentId: null,
    productCount: 56,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

// ============================================================
// BRANDS
// ============================================================

export const mockBrands: Brand[] = [
  {
    id: "brand-1",
    name: "Apple",
    slug: "apple",
    logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100",
    description: "Think Different",
    productCount: 24,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "brand-2",
    name: "Samsung",
    slug: "samsung",
    logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100",
    description: "Inspire the World, Create the Future",
    productCount: 31,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "brand-3",
    name: "Sony",
    slug: "sony",
    logo: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=100",
    description: "Be Moved",
    productCount: 18,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "brand-4",
    name: "Dell",
    slug: "dell",
    logo: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=100",
    description: "The Power to Do More",
    productCount: 14,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// ============================================================
// PRODUCTS (10)
// ============================================================

export const mockProducts: Product[] = [
  // ── PRODUCT 1 ─────────────────────────────────────────────
  {
    id: "prod-1",
    vendorId: "vendor-1",
    vendorName: "TechStore Pro",
    categoryId: "cat-1",
    categoryName: "Smartphones",
    brandId: "brand-1",
    brandName: "Apple",
    status: "active",
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    description:
      "Experience the pinnacle of mobile innovation with the iPhone 15 Pro Max. Crafted from aerospace-grade titanium, this device delivers an incredible strength-to-weight ratio that makes it the lightest Pro model ever. The A17 Pro chip — built on an industry-first 3-nanometer process — powers console-level gaming, professional-grade photo editing, and seamless multitasking with ease. The revolutionary 48MP main camera system captures breathtaking detail in any lighting condition, from sun-drenched landscapes to dimly-lit interiors, while the 5x optical zoom telephoto lens brings distant subjects into crystal-clear focus. A customizable Action Button puts your most-used features one press away, and USB-C with USB 3 speeds transfers a ProRes video in under three seconds. All-day battery life means you can shoot, stream, and create from dawn to dusk without reaching for a charger.",
    price: 1199.99,
    originalPrice: 1299.99,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600",
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600",
    ],
    stock: 45,
    sku: "APL-IP15PM-256",
    specifications: [
      { label: "Display", value: '6.7" Super Retina XDR OLED' },
      { label: "Chip", value: "A17 Pro (3nm)" },
      { label: "Storage", value: "256GB" },
      {
        label: "Camera",
        value: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      },
      { label: "Battery", value: "4422 mAh" },
      { label: "OS", value: "iOS 17" },
      { label: "Build", value: "Titanium frame, Ceramic Shield front" },
      { label: "Weight", value: "221g" },
      { label: "What's in the Box", value: "iPhone 15 Pro Max, USB-C Charge Cable (1m), Documentation" },
      { label: "Warranty", value: "1-year limited warranty + 90 days complimentary support" },
      { label: "Compatibility", value: "iOS 17, iCloud, Apple Watch, AirPods, MagSafe accessories" },
      { label: "Key Features", value: "A17 Pro chip, Titanium design, 48MP camera system, Action Button, USB-C with USB 3, All-day battery" },
    ],
    variants: [
      {
        id: "var-1-1",
        productId: "prod-1",
        name: "Storage",
        value: "256GB",
        priceModifier: 0,
        stock: 45,
        sku: "APL-IP15PM-256",
      },
      {
        id: "var-1-2",
        productId: "prod-1",
        name: "Storage",
        value: "512GB",
        priceModifier: 100,
        stock: 20,
        sku: "APL-IP15PM-512",
      },
      {
        id: "var-1-3",
        productId: "prod-1",
        name: "Storage",
        value: "1TB",
        priceModifier: 200,
        stock: 10,
        sku: "APL-IP15PM-1TB",
      },
    ],
    rating: 4.9,
    reviewCount: 12,
    featured: true,
    bestseller: true,
    isPublished: true,
    tags: ["flagship", "iOS", "5G", "pro camera"],
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },

  // ── PRODUCT 2 ─────────────────────────────────────────────
  {
    id: "prod-2",
    vendorId: "vendor-1",
    vendorName: "TechStore Pro",
    categoryId: "cat-2",
    categoryName: "Laptops & Computers",
    brandId: "brand-1",
    brandName: "Apple",
    status: "out-of-stock",
    name: 'MacBook Pro 14" M3 Pro',
    slug: "macbook-pro-14-m3-pro",
    description:
      "Unleash your creative and professional potential with the MacBook Pro 14-inch powered by the M3 Pro chip. This machine redefines what a laptop can do — its 11-core CPU and 14-core GPU handle everything from compiling massive codebases to rendering complex 3D scenes without breaking a sweat. The stunning 14.2-inch Liquid Retina XDR display delivers over 1,000 nits of sustained brightness and a 1,000,000:1 contrast ratio, making HDR content look absolutely phenomenal. With 18GB of unified memory and up to 18 hours of battery life, you can power through your entire workday — and then some — without hunting for an outlet. The studio-quality three-mic array and six-speaker sound system with Spatial Audio make video calls and media playback feel truly immersive. Connectivity is generous with three Thunderbolt 4 ports, HDMI, an SDXC card slot, and MagSafe charging.",
    price: 1999.99,
    originalPrice: 2199.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600",
    ],
    stock: 18,
    sku: "APL-MBP14-M3P",
    specifications: [
      { label: "Display", value: '14.2" Liquid Retina XDR (3024×1964)' },
      { label: "Chip", value: "Apple M3 Pro (11-core CPU, 14-core GPU)" },
      { label: "RAM", value: "18GB Unified Memory" },
      { label: "Storage", value: "512GB SSD" },
      { label: "Battery", value: "Up to 18 hours" },
      { label: "Ports", value: "3x Thunderbolt 4, HDMI, SD Card, MagSafe 3" },
      { label: "Weight", value: "1.61 kg" },
      { label: "What's in the Box", value: "MacBook Pro 14-inch, 70W USB-C Power Adapter, USB-C to MagSafe 3 Cable (2m), Documentation" },
      { label: "Warranty", value: "1-year limited warranty, AppleCare+ eligible" },
      { label: "Compatibility", value: "macOS Sonoma, iCloud, Continuity Camera, Universal Clipboard, AirDrop" },
      { label: "Key Features", value: "M3 Pro chip, Liquid Retina XDR display, 18-hour battery, Thunderbolt 4, MagSafe 3, Studio-quality mics" },
    ],
    rating: 4.8,
    reviewCount: 29,
    featured: true,
    bestseller: true,
    isPublished: true,
    tags: ["laptop", "macOS", "M3", "pro"],
    createdAt: "2026-01-08T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },

  // ── PRODUCT 3 ─────────────────────────────────────────────
  {
    id: "prod-3",
    vendorId: "vendor-2",
    vendorName: "GadgetZone",
    categoryId: "cat-3",
    categoryName: "Audio & Headphones",
    brandId: "brand-3",
    brandName: "Sony",
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5-wireless",
    status: "active",
    description:
      "Set a new standard for wireless audio with the Sony WH-1000XM5 — the flagship noise-canceling headphones trusted by millions worldwide. Equipped with two dedicated processors and eight microphones, these headphones deliver industry-leading noise cancellation that adapts intelligently to your environment, whether you're on a noisy commute, in a bustling café, or working from a busy open-plan office. The newly developed 30mm driver unit reproduces rich, detailed sound across an expansive frequency range of 4Hz to 40,000Hz, bringing your music to life with stunning clarity and deep, punchy bass. Enjoy up to 30 hours of continuous playback with noise canceling enabled, and when you're in a rush, a quick 3-minute charge gives you 3 hours of listening time. Multipoint connectivity lets you seamlessly switch between two Bluetooth devices, while Speak-to-Chat automatically pauses music when you start talking. Weighing just 250g with an ultra-comfortable synthetic leather headband, the WH-1000XM5 is engineered for all-day wearability.",
    price: 349.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
    ],
    stock: 67,
    sku: "SNY-WH1000XM5-BLK",
    specifications: [
      { label: "Type", value: "Over-ear, Closed-back" },
      { label: "Driver", value: "30mm" },
      { label: "Frequency Response", value: "4Hz–40,000Hz" },
      { label: "Battery Life", value: "30 hours (NC on)" },
      { label: "Charging", value: "USB-C, 3 min quick charge = 3 hrs" },
      { label: "Noise Canceling", value: "Dual Processor (V1 x2)" },
      { label: "Weight", value: "250g" },
      { label: "Connectivity", value: "Bluetooth 5.2, Multipoint" },
      { label: "What's in the Box", value: "WH-1000XM5 Headphones, USB-C Charging Cable, 3.5mm Audio Cable, Carrying Case, Airplane Adapter" },
      { label: "Warranty", value: "1-year limited warranty" },
      { label: "Compatibility", value: "Smartphones, tablets, laptops, PCs, Macs — Bluetooth or wired connection" },
      { label: "Key Features", value: "Industry-leading ANC, 30-hour battery, Speak-to-Chat, Multipoint, Hi-Res Audio, Adaptive Sound Control" },
    ],
    rating: 4.7,
    reviewCount: 12,
    featured: true,
    bestseller: true,
    isPublished: true,
    tags: ["noise canceling", "wireless", "audiophile", "ANC"],
    createdAt: "2026-01-05T10:00:00Z",
    updatedAt: "2026-01-14T10:00:00Z",
  },

  // ── PRODUCT 4 ─────────────────────────────────────────────
  {
    id: "prod-4",
    vendorId: "vendor-2",
    vendorName: "GadgetZone",
    categoryId: "cat-1",
    categoryName: "Smartphones",
    brandId: "brand-2",
    brandName: "Samsung",
    status: "out-of-stock",
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description:
      "The Samsung Galaxy S24 Ultra is the ultimate smartphone for those who demand the very best. Powered by the Snapdragon 8 Gen 3 processor, it delivers blazing-fast performance for gaming, productivity, and AI-powered features. The revolutionary 200MP main camera captures incredibly detailed photos and videos, while the built-in S Pen offers precise control for note-taking, sketching, and document annotation. Galaxy AI transforms how you interact with your phone — Circle to Search lets you find anything on-screen with a simple gesture, Live Translate breaks down language barriers in real-time during calls, and Chat Assist helps you craft the perfect message in any tone. The 6.8-inch QHD+ Dynamic AMOLED 2X display with a 120Hz adaptive refresh rate delivers buttery-smooth scrolling and vivid colors. With 5000mAh battery and 45W super-fast charging, you'll spend less time plugged in and more time doing what matters.",
    price: 1099.99,
    originalPrice: 1199.99,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
      "https://images.unsplash.com/photo-1587840171670-8b850147754e?w=600",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600",
    ],
    stock: 38,
    sku: "SAM-GS24U-256",
    specifications: [
      { label: "Display", value: '6.8" QHD+ Dynamic AMOLED 2X, 120Hz' },
      { label: "Processor", value: "Snapdragon 8 Gen 3" },
      { label: "RAM", value: "12GB" },
      { label: "Storage", value: "256GB" },
      { label: "Main Camera", value: "200MP (f/1.7) + 12MP + 10MP + 50MP" },
      { label: "Battery", value: "5000mAh, 45W wired charging" },
      { label: "S Pen", value: "Built-in, 2.8ms latency" },
      { label: "OS", value: "Android 14, One UI 6.1" },
      { label: "What's in the Box", value: "Galaxy S24 Ultra, S Pen, USB-C Cable, SIM Tray Tool, Quick Start Guide" },
      { label: "Warranty", value: "1-year manufacturer warranty, Samsung Care+ available" },
      { label: "Compatibility", value: "Android ecosystem, Galaxy Buds, Galaxy Watch, DeX-compatible displays" },
      { label: "Key Features", value: "200MP camera, S Pen, Galaxy AI, Snapdragon 8 Gen 3, 5000mAh battery, 120Hz AMOLED display" },
    ],
    rating: 4.8,
    reviewCount: 43,
    featured: true,
    bestseller: false,
    isPublished: true,
    tags: ["S Pen", "flagship", "Android", "200MP"],
    createdAt: "2026-01-12T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },

  // ── PRODUCT 5 ─────────────────────────────────────────────
  {
    id: "prod-5",
    vendorId: "vendor-1",
    vendorName: "TechStore Pro",
    categoryId: "cat-5",
    categoryName: "Wearables",
    brandId: "brand-1",
    brandName: "Apple",
    status: "active",
    name: "Apple Watch Ultra 2",
    slug: "apple-watch-ultra-2",
    description:
      "Push the boundaries of exploration with the Apple Watch Ultra 2 — the most rugged and capable Apple Watch ever built. Encased in aerospace-grade titanium at 49mm, this timepiece is engineered to withstand the most extreme conditions, from summiting mountain peaks to diving to depths of 100 meters. The S9 SiP (System in Package) delivers a blazing-fast double-tap gesture that lets you control the watch with a simple pinch of your fingers, even when your other hand is occupied. Precision dual-frequency GPS (L1 + L5) provides unmatched location accuracy in challenging urban and wilderness environments. The always-on Retina display hits an incredible 3000 nits of brightness, making it perfectly readable even under direct sunlight. With up to 72 hours of battery life in normal use and 60 hours in Low Power Mode, the Ultra 2 keeps pace with multi-day adventures. Advanced health sensors track your blood oxygen, heart rate, and temperature, while the redesigned Action Button gives you instant access to your most critical workout functions.",
    price: 799.99,
    originalPrice: 849.99,
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600",
    images: [
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600",
    ],
    stock: 22,
    sku: "APL-AWU2-49MM",
    specifications: [
      { label: "Case Size", value: "49mm Titanium" },
      { label: "Display", value: "Always-On Retina LTPO OLED" },
      { label: "Chip", value: "Apple S9 SiP" },
      { label: "Battery", value: "Up to 60 hours (Low Power Mode)" },
      { label: "Water Resistance", value: "100m (ISO 22810:2010)" },
      { label: "GPS", value: "L1 + L5 Dual-frequency" },
      { label: "Connectivity", value: "LTE, Wi-Fi 6, Bluetooth 5.3, UWB" },
      { label: "What's in the Box", value: "Apple Watch Ultra 2, Magnetic Fast Charger to USB-C Cable, Alpine Loop band, Documentation" },
      { label: "Warranty", value: "1-year limited warranty, AppleCare+ eligible" },
      { label: "Compatibility", value: "Requires iPhone Xs or later with iOS 17+; works with Apple Fitness+, Apple Pay, and all Health apps" },
      { label: "Key Features", value: "49mm Titanium case, 3000-nit display, Dual-frequency GPS, S9 SiP, Double Tap gesture, 100m water resistance" },
    ],
    rating: 4.6,
    reviewCount: 87,
    featured: false,
    bestseller: false,
    isPublished: true,
    tags: ["smartwatch", "fitness", "rugged", "GPS"],
    createdAt: "2026-01-03T10:00:00Z",
    updatedAt: "2026-01-14T10:00:00Z",
  },

  // ── PRODUCT 6 ─────────────────────────────────────────────
  {
    id: "prod-6",
    vendorId: "vendor-2",
    vendorName: "GadgetZone",
    categoryId: "cat-4",
    categoryName: "Cameras & Photography",
    brandId: "brand-3",
    brandName: "Sony",
    status: "active",
    name: "Sony Alpha A7R V Mirrorless Camera",
    slug: "sony-alpha-a7r-v",
    description:
      "Unleash your creative vision with the Sony Alpha A7R V — a full-frame mirrorless camera that combines a staggering 61MP Exmor R BSI CMOS sensor with Sony's most advanced AI-powered autofocus system ever. The dedicated AI processing unit recognizes subjects with unprecedented accuracy, tracking humans, animals, birds, insects, cars, trains, and airplanes with pinpoint precision even in complex scenes. Shoot ultra-high-resolution 61MP stills with extraordinary dynamic range, or capture cinematic 8K 24p and 4K 60p video with full pixel readout for stunning detail. The 8-stop in-body 5-axis stabilization system ensures razor-sharp handheld shots even at slow shutter speeds, while the class-leading 9.44M-dot OLED electronic viewfinder provides an immersive, lag-free composition experience. Dual card slots (CFexpress Type A / SD) offer flexible recording options, and the rugged magnesium alloy body with comprehensive weather sealing means you can shoot confidently in rain, dust, and extreme temperatures.",
    price: 3499.99,
    originalPrice: 3799.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600",
      "https://images.unsplash.com/photo-1467134983221-af4c2f75c7ba?w=600",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600",
    ],
    stock: 9,
    sku: "SNY-A7RV-BODY",
    specifications: [
      { label: "Sensor", value: "61MP Full-Frame BSI CMOS" },
      { label: "ISO Range", value: "100–32,000 (expandable 50–102,400)" },
      {
        label: "Autofocus",
        value: "693 phase-detect points, AI subject recognition",
      },
      { label: "Video", value: "8K 24fps, 4K 60fps" },
      { label: "Stabilization", value: "8-stop in-body 5-axis" },
      { label: "Viewfinder", value: "9.44M-dot OLED EVF" },
      { label: "Card Slots", value: "Dual (CFexpress Type A / SD)" },
      { label: "Weight", value: "723g" },
      { label: "What's in the Box", value: "Sony Alpha A7R V Body, Rechargeable Battery NP-FZ100, Body Cap, Shoulder Strap, USB-C Cable, Documentation" },
      { label: "Warranty", value: "1-year limited warranty, extended service plans available" },
      { label: "Compatibility", value: "E-mount lenses, Sony flash system, UHS-II SD cards, CFexpress Type A, Imaging Edge Mobile app" },
      { label: "Key Features", value: "61MP BSI CMOS sensor, AI-based autofocus, 8-stop IBIS, 8K video, 9.44M-dot EVF, Dual card slots" },
    ],
    rating: 4.9,
    reviewCount: 15,
    featured: false,
    bestseller: false,
    isPublished: true,
    tags: ["mirrorless", "full-frame", "61MP", "professional"],
    createdAt: "2026-01-06T10:00:00Z",
    updatedAt: "2026-01-13T10:00:00Z",
  },

  // ── PRODUCT 7 ─────────────────────────────────────────────
  {
    id: "prod-7",
    vendorId: "vendor-1",
    vendorName: "TechStore Pro",
    categoryId: "cat-6",
    categoryName: "Gaming",
    brandId: "brand-3",
    brandName: "Sony",
    status: "active",
    name: "PlayStation 5 Console (Slim)",
    slug: "playstation-5-slim",
    description:
      "Discover a slimmer, sleeker PlayStation 5 that doesn't compromise on power. The PS5 Slim packs the same custom AMD Zen 2 CPU and RDNA 2 GPU delivering up to 10.3 TFLOPS of graphical processing power, ensuring every game looks and plays phenomenally. The ultra-high-speed 1TB NVMe SSD slashes load times to near-instantaneous levels — boot into games in seconds, not minutes. The revolutionary DualSense wireless controller brings games to life with haptic feedback that lets you feel every raindrop, explosion, and terrain change, while adaptive triggers add real tension to bowstrings and accelerator pedals. Ray tracing support delivers lifelike reflections, shadows, and lighting that blur the line between virtual and reality. Whether you're exploring vast open worlds, competing in fast-paced multiplayer, or immersing yourself in cinematic narratives, the PS5 Slim delivers an unparalleled gaming experience at up to 4K 120fps or even 8K resolution.",
    price: 499.99,
    originalPrice: 549.99,
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600",
    images: [
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600",
    ],
    stock: 14,
    sku: "SNY-PS5-SLIM-DED",
    specifications: [
      { label: "CPU", value: "8-core AMD Zen 2, 3.5GHz" },
      { label: "GPU", value: "10.3 TFLOPS, AMD RDNA 2" },
      { label: "RAM", value: "16GB GDDR6" },
      { label: "Storage", value: "1TB NVMe SSD" },
      { label: "Optical Drive", value: "Ultra HD Blu-ray (Disc edition)" },
      { label: "Resolution", value: "Up to 8K" },
      { label: "Frame Rate", value: "Up to 120fps" },
      { label: "What's in the Box", value: "PS5 Slim Console, DualSense Wireless Controller, HDMI Cable, AC Power Cord, USB-C Cable, Horizontal Stand, Documentation" },
      { label: "Warranty", value: "1-year limited warranty" },
      { label: "Compatibility", value: "All PS5 games, 99% of PS4 games (backward compatible), PlayStation VR2, PlayStation Plus" },
      { label: "Key Features", value: "Custom SSD (near-instant loading), DualSense haptic controller, Ray tracing, 4K 120fps, 8K output, Tempest 3D AudioTech" },
    ],
    rating: 4.7,
    reviewCount: 23,
    featured: true,
    bestseller: true,
    isPublished: true,
    tags: ["console", "gaming", "PS5", "4K"],
    createdAt: "2026-01-02T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },

  // ── PRODUCT 8 ─────────────────────────────────────────────
  {
    id: "prod-8",
    vendorId: "vendor-2",
    vendorName: "GadgetZone",
    categoryId: "cat-7",
    categoryName: "Smart Home",
    brandId: "brand-1",
    status: "active",
    brandName: "Apple",
    name: "Apple HomePod (2nd Gen)",
    slug: "apple-homepod-2nd-gen",
    description:
      "Transform your living space into an immersive listening environment with the Apple HomePod (2nd generation). Powered by the Apple S7 chip, this remarkably compact speaker delivers room-filling, high-fidelity audio that automatically analyzes and adapts to the acoustics of your space using computational audio and room-sensing technology. Five beam-forming tweeters arranged in a circular array project sound precisely throughout the room, while the high-excursion 4-inch woofer delivers deep, rich bass that defies the HomePod's compact footprint. With Siri built in, you can control your smart home, set timers, play music, send messages, and get answers to questions — all hands-free. The HomePod serves as a Thread border router and Matter hub, making it the nerve center of your connected home. Seamlessly hand off audio from your iPhone or iPad, and enjoy Spatial Audio with Dolby Atmos for a truly cinematic listening experience. Available in elegant Midnight and White finishes.",
    price: 299.99,
    originalPrice: 329.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600",
    ],
    stock: 33,
    sku: "APL-HP2-WHT",
    specifications: [
      { label: "Chip", value: "Apple S7" },
      { label: "Audio", value: "4-inch high-excursion woofer, 5 tweeters" },
      { label: "Microphones", value: "6-microphone array" },
      {
        label: "Connectivity",
        value: "Wi-Fi 6 (802.11ax), Bluetooth 5.0, Thread",
      },
      { label: "Smart Home", value: "HomeKit, Matter hub built-in" },
      { label: "Temperature Sensor", value: "Yes" },
      { label: "Height", value: "168mm" },
      { label: "What's in the Box", value: "HomePod (2nd Gen), Power Cord, Quick Start Guide" },
      { label: "Warranty", value: "1-year limited warranty, AppleCare+ eligible" },
      { label: "Compatibility", value: "Requires iPhone/iPad with iOS 16.3+ or iPadOS 16.3+; works with Apple Music, Siri, HomeKit, Matter smart home devices" },
      { label: "Key Features", value: "Room-sensing audio, Spatial Audio with Dolby Atmos, Siri smart assistant, Thread/Matter hub, Temperature and humidity sensor" },
    ],
    rating: 4.5,
    reviewCount: 28,
    featured: false,
    bestseller: false,
    isPublished: true,
    tags: ["smart speaker", "HomeKit", "Siri", "hi-fi"],
    createdAt: "2026-01-04T10:00:00Z",
    updatedAt: "2026-01-13T10:00:00Z",
  },

  // ── PRODUCT 9 ─────────────────────────────────────────────
  {
    id: "prod-9",
    vendorId: "vendor-1",
    vendorName: "TechStore Pro",
    categoryId: "cat-2",
    categoryName: "Laptops & Computers",
    brandId: "brand-4",
    brandName: "Dell",
    status: "active",
    name: "Dell XPS 15 (9530)",
    slug: "dell-xps-15-9530",
    description:
      "Elevate your creative workflow with the Dell XPS 15 — a thin and light powerhouse that combines a breathtaking 15.6-inch 3.5K OLED touchscreen display with the raw computational might of Intel's 13th-generation Core i9-13900H processor and NVIDIA GeForce RTX 4070 graphics. The OLED panel delivers true-to-life colors with 100% DCI-P3 coverage and infinite contrast, making it ideal for photo editing, video production, and color-critical design work. With 32GB of DDR5 RAM and a blazing-fast 1TB NVMe PCIe Gen 4 SSD, you can edit 4K video timelines, run multiple virtual machines, or render complex 3D scenes without hesitation. The precision-crafted CNC-machined aluminum chassis houses an edge-to-edge keyboard with large, comfortable keycaps and a massive glass touchpad for effortless navigation. An 86Wh battery delivers up to 13 hours of productive use, while Thunderbolt 4 connectivity enables lightning-fast data transfer and support for up to two 4K external displays.",
    price: 1849.99,
    originalPrice: 2099.99,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600",
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600",
    ],
    stock: 11,
    sku: "DEL-XPS15-9530-I9",
    specifications: [
      { label: "Display", value: '15.6" OLED 3.5K (3456×2160) Touch' },
      { label: "Processor", value: "Intel Core i9-13900H" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4070 8GB" },
      { label: "RAM", value: "32GB DDR5 4800MHz" },
      { label: "Storage", value: "1TB NVMe PCIe Gen4 SSD" },
      { label: "Battery", value: "86Wh, up to 13 hours" },
      {
        label: "Ports",
        value: "2x Thunderbolt 4, USB-A, SD Card, headphone jack",
      },
      { label: "Weight", value: "1.86 kg" },
      { label: "What's in the Box", value: "Dell XPS 15 (9530), 130W USB-C Power Adapter, USB-C to USB-A Adapter, Documentation" },
      { label: "Warranty", value: "1-year limited hardware warranty, Dell Premium Support available" },
      { label: "Compatibility", value: "Windows 11 Pro, Thunderbolt 4 docks, Dell ecosystem, NVIDIA Studio drivers" },
      { label: "Key Features", value: "3.5K OLED touchscreen, Core i9-13900H, RTX 4070, 32GB DDR5, 1TB NVMe SSD, CNC aluminum chassis" },
    ],
    rating: 4.6,
    reviewCount: 21,
    featured: false,
    bestseller: false,
    isPublished: true,
    tags: ["laptop", "OLED", "RTX", "creator"],
    createdAt: "2026-01-07T10:00:00Z",
    updatedAt: "2026-01-14T10:00:00Z",
  },

  // ── PRODUCT 10 ─────────────────────────────────────────────
  {
    id: "prod-10",
    vendorId: "vendor-2",
    vendorName: "GadgetZone",
    categoryId: "cat-8",
    categoryName: "Accessories",
    brandId: "brand-2",
    brandName: "Samsung",
    name: "Samsung 65W USB-C Super Fast Charger Trio",
    slug: "samsung-65w-usb-c-charger-trio",
    status: "active",
    description:
      "Simplify your charging setup with the Samsung 65W USB-C Super Fast Charger Trio — the ultimate all-in-one power solution for your entire device ecosystem. This compact yet powerful charger features three ports that intelligently distribute power to deliver the optimal charging speed for each connected device. The primary USB-C port delivers up to 45W PD output, enough to fast-charge a MacBook Air or Dell XPS laptop from zero to 50% in about 30 minutes. The second USB-C port supports Samsung's Super Fast Charging 2.0 protocol at 25W, perfectly optimized for Galaxy S-series and Z-series phones. The USB-A port provides a reliable 15W charge for accessories, older devices, and wearables. All three ports can operate simultaneously, intelligently managing the 65W total output budget so every device charges as efficiently as possible. The included 1.8m USB-C to USB-C cable is rated for 5A current and E-Marker certified for safe, reliable power delivery. The foldable prong design and compact 66×66×32mm form factor make it an ideal travel companion that slips easily into any bag or pocket.",
    price: 69.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600",
    images: [
      "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600",
      "https://images.unsplash.com/photo-1583394293214-0d3f94b74b22?w=600",
    ],
    stock: 120,
    sku: "SAM-65W-TRIO-CHG",
    specifications: [
      { label: "Total Output", value: "65W" },
      { label: "Port 1", value: "USB-C 45W PD (laptop compatible)" },
      { label: "Port 2", value: "USB-C 25W Super Fast Charging 2.0" },
      { label: "Port 3", value: "USB-A 15W" },
      { label: "Compatibility", value: "Galaxy, iPhone 15, MacBook Air" },
      { label: "Cable Included", value: "USB-C to USB-C (1.8m)" },
      { label: "Size", value: "66 × 66 × 32mm" },
      { label: "What's in the Box", value: "Samsung 65W Charger Trio, 1.8m USB-C to USB-C 5A Cable (E-Marker certified), Quick Start Guide" },
      { label: "Warranty", value: "1-year limited warranty" },
      { label: "Compatibility", value: "Galaxy S/Z series, iPhone 15/Pro series, MacBook Air/Pro, Dell XPS, Nintendo Switch, and most USB-C devices" },
      { label: "Key Features", value: "65W total output, 3-port smart charging (2x USB-C + 1x USB-A), Super Fast Charging 2.0, Foldable prongs, Compact travel design" },
    ],
    rating: 4.4,
    reviewCount: 92,
    featured: false,
    bestseller: true,
    isPublished: true,
    tags: ["charger", "USB-C", "fast charging", "multiport"],
    createdAt: "2026-01-09T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
];

// ============================================================
// REVIEWS
// ============================================================

export const mockReviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    customerId: "user-cust-1",
    customerName: "John Smith",
    customerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    rating: 5,
    comment:
      "Absolutely incredible phone. The titanium build feels premium, camera in low light is unbelievably good. The USB-C switch was long overdue. Worth every penny.",
    createdAt: "2026-01-16T09:00:00Z",
    updatedAt: "2026-01-16T09:00:00Z",
  },
  {
    id: "rev-2",
    productId: "prod-1",
    customerId: "user-cust-2",
    customerName: "Emily Johnson",
    customerAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    rating: 5,
    comment:
      "Upgraded from iPhone 13 Pro and the difference is night and day. The Action Button is genius and the display is stunning. Battery easily lasts all day.",
    createdAt: "2026-01-17T11:00:00Z",
    updatedAt: "2026-01-17T11:00:00Z",
  },
  {
    id: "rev-3",
    productId: "prod-3",
    customerId: "user-cust-1",
    customerName: "John Smith",
    customerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    rating: 5,
    comment:
      "Best headphones I have ever owned. The noise canceling is so good you forget the world exists. Multipoint works flawlessly between my phone and laptop.",
    createdAt: "2026-01-14T08:00:00Z",
    updatedAt: "2026-01-14T08:00:00Z",
  },
  {
    id: "rev-4",
    productId: "prod-7",
    customerId: "user-cust-2",
    customerName: "Emily Johnson",
    customerAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    rating: 4,
    comment:
      "PS5 Slim is a great upgrade. Quieter than the original, loads games in seconds. The DualSense haptics are still the best in the industry. Minor complaint — still hard to find.",
    createdAt: "2026-01-13T15:00:00Z",
    updatedAt: "2026-01-13T15:00:00Z",
  },
];

// ============================================================
// CART (3 items for user-cust-1)
// ============================================================

export const mockCart: Cart = {
  userId: "user-cust-1",
  items: [
    {
      id: "cart-item-1",
      productId: "prod-1",
      productSlug: "iphone-15-pro-max",
      productName: "iPhone 15 Pro Max",
      productImage:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200",
      vendorId: "vendor-1",
      vendorName: "TechStore Pro",
      price: 1199.99,
      quantity: 1,
      total: 1199.99,
      stock: 45,
      variant: "256GB",
    },
    {
      id: "cart-item-2",
      productId: "prod-3",
      productSlug: "sony-wh-1000xm5-wireless-headphones",
      productName: "Sony WH-1000XM5 Wireless Headphones",
      productImage:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
      vendorId: "vendor-2",
      vendorName: "GadgetZone",
      price: 349.99,
      quantity: 1,
      total: 349.99,
      stock: 67,
    },
    {
      id: "cart-item-3",
      productId: "prod-10",
      productSlug: "samsung-65w-usb-c-super-fast-charger-trio",
      productName: "Samsung 65W USB-C Super Fast Charger Trio",
      productImage:
        "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=200",
      vendorId: "vendor-2",
      vendorName: "GadgetZone",
      price: 69.99,
      quantity: 2,
      total: 139.98,
      stock: 120,
    },
  ],
  subtotal: 1689.96,
  itemCount: 4,
  updatedAt: "2026-01-15T12:00:00Z",
};

// ============================================================
// WISHLIST
// ============================================================

export const mockWishlist: WishlistItem[] = [
  {
    id: "wish-1",
    productId: "prod-2",
    productSlug: "macbook-pro-14-m3-pro",
    productName: 'MacBook Pro 14" M3 Pro',
    productImage:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    price: 1999.99,
    originalPrice: 2199.99,
    rating: 4.8,
    stock: 18,
    addedAt: "2026-01-12T09:00:00Z",
  },
  {
    id: "wish-2",
    productId: "prod-5",
    productSlug: "apple-watch-ultra-2",
    productName: "Apple Watch Ultra 2",
    productImage:
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400",
    price: 799.99,
    originalPrice: 849.99,
    rating: 4.6,
    stock: 22,
    addedAt: "2026-01-13T14:00:00Z",
  },
  {
    id: "wish-3",
    productId: "prod-7",
    productSlug: "playstation-5-slim",
    productName: "PlayStation 5 Console (Slim)",
    productImage:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400",
    price: 499.99,
    originalPrice: 549.99,
    rating: 4.7,
    stock: 14,
    addedAt: "2026-01-14T18:00:00Z",
  },
];

// ============================================================
// ORDERS (5)
// ============================================================

export const mockOrders: Order[] = [
  // ── ORDER 1: Delivered ────────────────────────────────────
  {
    id: "order-1",
    orderNumber: "EM-2026-001",
    customerId: "user-cust-1",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1 (555) 100-0001",
    vendorId: "vendor-1",
    vendorName: "TechStore Pro",
    deliveryId: "user-delivery-1",
    deliveryPersonName: "Carlos Rivera",
    items: [
      {
        id: "oi-1",
        productId: "prod-3",
        productName: "Sony WH-1000XM5 Wireless Headphones",
        productImage:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
        vendorId: "vendor-2",
        vendorName: "GadgetZone",
        quantity: 1,
        price: 349.99,
        total: 349.99,
      },
      {
        id: "oi-2",
        productId: "prod-10",
        productName: "Samsung 65W USB-C Super Fast Charger Trio",
        productImage:
          "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=200",
        vendorId: "vendor-2",
        vendorName: "GadgetZone",
        quantity: 2,
        price: 69.99,
        total: 139.98,
      },
    ],
    subtotal: 489.97,
    shippingCost: 9.99,
    tax: 44.1,
    discount: 0,
    total: 544.06,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "SSLCommerz",
    shippingAddress: {
      label: "home",
      fullName: "John Smith",
      phone: "+1 (555) 100-0001",
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingNumber: "EM-TRK-2026-001",
    estimatedDelivery: "2026-01-14T00:00:00Z",
    createdAt: "2026-01-10T14:30:00Z",
    updatedAt: "2026-01-14T11:00:00Z",
  },

  // ── ORDER 2: Shipped ──────────────────────────────────────
  {
    id: "order-2",
    orderNumber: "EM-2026-002",
    customerId: "user-cust-1",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1 (555) 100-0001",
    vendorId: "vendor-1",
    vendorName: "TechStore Pro",
    deliveryId: "user-delivery-1",
    deliveryPersonName: "Carlos Rivera",
    items: [
      {
        id: "oi-3",
        productId: "prod-2",
        productName: 'MacBook Pro 14" M3 Pro',
        productImage:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
        vendorId: "vendor-1",
        vendorName: "TechStore Pro",
        quantity: 1,
        price: 1999.99,
        total: 1999.99,
      },
    ],
    subtotal: 1999.99,
    shippingCost: 0,
    tax: 180.0,
    discount: 200.0,
    total: 1979.99,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "SSLCommerz",
    shippingAddress: {
      label: "home",
      fullName: "John Smith",
      phone: "+1 (555) 100-0001",
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingNumber: "EM-TRK-2026-002",
    estimatedDelivery: "2026-01-18T00:00:00Z",
    createdAt: "2026-01-14T09:00:00Z",
    updatedAt: "2026-01-15T08:00:00Z",
  },

  // ── ORDER 3: Processing ───────────────────────────────────
  {
    id: "order-3",
    orderNumber: "EM-2026-003",
    customerId: "user-cust-2",
    customerName: "Emily Johnson",
    customerEmail: "emily.johnson@email.com",
    customerPhone: "+1 (555) 100-0002",
    vendorId: "vendor-2",
    vendorName: "GadgetZone",
    items: [
      {
        id: "oi-4",
        productId: "prod-4",
        productName: "Samsung Galaxy S24 Ultra",
        productImage:
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200",
        vendorId: "vendor-2",
        vendorName: "GadgetZone",
        quantity: 1,
        price: 1099.99,
        total: 1099.99,
        variant: "256GB / Titanium Black",
      },
    ],
    subtotal: 1099.99,
    shippingCost: 0,
    tax: 98.99,
    discount: 0,
    total: 1198.98,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "SSLCommerz",
    shippingAddress: {
      label: "home",
      fullName: "Emily Johnson",
      phone: "+1 (555) 100-0002",
      street: "789 Oak Lane",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    estimatedDelivery: "2026-01-20T00:00:00Z",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T11:00:00Z",
  },

  // ── ORDER 4: Pending ──────────────────────────────────────
  {
    id: "order-4",
    orderNumber: "EM-2026-004",
    customerId: "user-cust-2",
    customerName: "Emily Johnson",
    customerEmail: "emily.johnson@email.com",
    customerPhone: "+1 (555) 100-0002",
    vendorId: "vendor-1",
    vendorName: "TechStore Pro",
    items: [
      {
        id: "oi-5",
        productId: "prod-7",
        productName: "PlayStation 5 Console (Slim)",
        productImage:
          "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=200",
        vendorId: "vendor-1",
        vendorName: "TechStore Pro",
        quantity: 1,
        price: 499.99,
        total: 499.99,
      },
    ],
    subtotal: 499.99,
    shippingCost: 14.99,
    tax: 45.0,
    discount: 0,
    total: 559.98,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: "Cash on Delivery",
    shippingAddress: {
      label: "home",
      fullName: "Emily Johnson",
      phone: "+1 (555) 100-0002",
      street: "789 Oak Lane",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    note: "Please call before delivery",
    createdAt: "2026-01-15T16:00:00Z",
    updatedAt: "2026-01-15T16:00:00Z",
  },

  // ── ORDER 5: Cancelled ────────────────────────────────────
  {
    id: "order-5",
    orderNumber: "EM-2026-005",
    customerId: "user-cust-1",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1 (555) 100-0001",
    vendorId: "vendor-2",
    vendorName: "GadgetZone",
    items: [
      {
        id: "oi-6",
        productId: "prod-6",
        productName: "Sony Alpha A7R V Mirrorless Camera",
        productImage:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200",
        vendorId: "vendor-2",
        vendorName: "GadgetZone",
        quantity: 1,
        price: 3499.99,
        total: 3499.99,
      },
    ],
    subtotal: 3499.99,
    shippingCost: 0,
    tax: 315.0,
    discount: 300.0,
    total: 3514.99,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "SSLCommerz",
    shippingAddress: {
      label: "office",
      fullName: "John Smith",
      phone: "+1 (555) 100-0001",
      street: "456 Business Ave, Floor 12",
      city: "New York",
      state: "NY",
      zipCode: "10005",
      country: "USA",
    },
    note: "Customer changed mind — full refund issued",
    createdAt: "2026-01-08T13:00:00Z",
    updatedAt: "2026-01-09T09:00:00Z",
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-cust-1",
    type: "order",
    title: "Order Shipped!",
    message:
      'Your order EM-2026-002 (MacBook Pro 14") has been shipped. Estimated delivery: Jan 18.',
    isRead: false,
    link: "/customer/orders/order-2",
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: "notif-2",
    userId: "user-cust-1",
    type: "promotion",
    title: "Flash Sale — 20% off Gaming",
    message:
      "Today only! Get 20% off all Gaming products. Use code GAME20 at checkout.",
    isRead: false,
    link: "/products?category=gaming",
    createdAt: "2026-01-15T07:00:00Z",
  },
  {
    id: "notif-3",
    userId: "user-cust-1",
    type: "order",
    title: "Order Delivered",
    message:
      "Your order EM-2026-001 has been delivered successfully. Enjoy your Sony headphones!",
    isRead: true,
    link: "/customer/orders/order-1",
    createdAt: "2026-01-14T11:00:00Z",
  },
  {
    id: "notif-4",
    userId: "user-vendor-1",
    type: "order",
    title: "New Order Received",
    message:
      'You have a new order (EM-2026-002) for MacBook Pro 14" M3 Pro worth $1,999.99.',
    isRead: false,
    link: "/vendor/orders",
    createdAt: "2026-01-14T09:00:00Z",
  },
  {
    id: "notif-5",
    userId: "user-delivery-1",
    type: "delivery",
    title: "New Delivery Assigned",
    message:
      "Order EM-2026-002 has been assigned to you. Pickup from TechStore Pro, 456 Tech Ave.",
    isRead: false,
    link: "/delivery/assigned",
    createdAt: "2026-01-15T08:30:00Z",
  },
];

// ============================================================
// ADMIN ANALYTICS
// ============================================================

export const mockAdminAnalytics: AdminAnalytics = {
  totalRevenue: 142850.75,
  totalOrders: 1247,
  totalUsers: 3841,
  totalProducts: 216,
  revenueData: [
    { month: "Aug", revenue: 9200, orders: 87 },
    { month: "Sep", revenue: 11400, orders: 102 },
    { month: "Oct", revenue: 13800, orders: 124 },
    { month: "Nov", revenue: 18900, orders: 171 },
    { month: "Dec", revenue: 24500, orders: 221 },
    { month: "Jan", revenue: 21300, orders: 193 },
  ],
  topProducts: [
    {
      id: "prod-1",
      name: "iPhone 15 Pro Max",
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100",
      price: 1199.99,
      reviewCount: 12,
    },
    {
      id: "prod-7",
      name: "PlayStation 5 Console (Slim)",
      image:
        "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=100",
      price: 499.99,
      reviewCount: 23,
    },
    {
      id: "prod-3",
      name: "Sony WH-1000XM5",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
      price: 349.99,
      reviewCount: 12,
    },
    {
      id: "prod-2",
      name: 'MacBook Pro 14" M3 Pro',
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100",
      price: 1999.99,
      reviewCount: 29,
    },
  ],
};

// ============================================================
// HELPER — get product by id
// ============================================================

export const getProductById = (id: string): Product | undefined =>
  mockProducts.find((p) => p.id === id);

export const getProductBySlug = (slug: string): Product | undefined =>
  mockProducts.find((p) => p.slug === slug);

export const getProductsByCategory = (categoryId: string): Product[] =>
  mockProducts.filter((p) => p.categoryId === categoryId);

export const getFeaturedProducts = (): Product[] =>
  mockProducts.filter((p) => p.featured);

export const getBestsellerProducts = (): Product[] =>
  mockProducts.filter((p) => p.bestseller);

export const getOrdersByCustomer = (customerId: string): Order[] =>
  mockOrders.filter((o) => o.customerId === customerId);

export const getNotificationsByUser = (userId: string): Notification[] =>
  mockNotifications.filter((n) => n.userId === userId);
