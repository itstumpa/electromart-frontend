// ============================================================
// ElectroMart — Complete Mock Data
// All data is typed and ready to swap with real API calls
// ============================================================

import type {
  User,
  VendorProfile,
  DeliveryProfile,
  Category,
  Brand,
  Product,
  Review,
  Cart,
  WishlistItem,
  Order,
  Notification,
  AdminAnalytics,
  Address,
} from './types';

// ============================================================
// USERS
// ============================================================

export const mockUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@electromart.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'SUPER_ADMIN',
    isVerified: true,
    isBanned: false,
    phone: '+1 (555) 000-0001',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-vendor-1',
    name: 'Marcus Chen',
    email: 'marcus.chen@techstore.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    role: 'VENDOR',
    isVerified: true,
    isBanned: false,
    phone: '+1 (555) 000-0002',
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'user-vendor-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@gadgetzone.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    role: 'VENDOR',
    isVerified: true,
    isBanned: false,
    phone: '+1 (555) 000-0003',
    createdAt: '2023-04-20T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: 'user-cust-1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    role: 'CUSTOMER',
    isVerified: true,
    isBanned: false,
    phone: '+1 (555) 100-0001',
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
  {
    id: 'user-cust-2',
    name: 'Emily Johnson',
    email: 'emily.johnson@email.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    role: 'CUSTOMER',
    isVerified: true,
    isBanned: false,
    phone: '+1 (555) 100-0002',
    createdAt: '2023-07-22T00:00:00Z',
    updatedAt: '2024-01-13T00:00:00Z',
  },
  {
    id: 'user-delivery-1',
    name: 'Carlos Rivera',
    email: 'carlos.rivera@delivery.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    role: 'DELIVERY',
    isVerified: true,
    isBanned: false,
    phone: '+1 (555) 200-0001',
    createdAt: '2023-05-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

// ============================================================
// VENDOR PROFILES
// ============================================================

export const mockVendorProfiles: VendorProfile[] = [
  {
    id: 'vendor-1',
    userId: 'user-vendor-1',
    storeName: 'TechStore Pro',
    logo: 'https://images.unsplash.com/photo-1612838320302-4b3b3996e01e?w=100',
    bio: 'Premium electronics and gadgets since 2015. Authorized reseller for major brands.',
    isApproved: true,
    totalProducts: 48,
    totalSales: 1240,
    rating: 4.8,
    createdAt: '2023-03-15T00:00:00Z',
  },
  {
    id: 'vendor-2',
    userId: 'user-vendor-2',
    storeName: 'GadgetZone',
    logo: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=100',
    bio: 'Your one-stop shop for the latest gadgets, accessories, and smart home devices.',
    isApproved: true,
    totalProducts: 32,
    totalSales: 870,
    rating: 4.6,
    createdAt: '2023-04-20T00:00:00Z',
  },
];

// ============================================================
// DELIVERY PROFILES
// ============================================================

export const mockDeliveryProfiles: DeliveryProfile[] = [
  {
    id: 'delivery-1',
    userId: 'user-delivery-1',
    vehicleType: 'bike',
    isAvailable: true,
    totalDeliveries: 312,
    createdAt: '2023-05-05T00:00:00Z',
  },
];

// ============================================================
// ADDRESSES
// ============================================================

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    userId: 'user-cust-1',
    label: 'home',
    fullName: 'John Smith',
    phone: '+1 (555) 100-0001',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    isDefault: true,
  },
  {
    id: 'addr-2',
    userId: 'user-cust-1',
    label: 'office',
    fullName: 'John Smith',
    phone: '+1 (555) 100-0001',
    street: '456 Business Ave, Floor 12',
    city: 'New York',
    state: 'NY',
    zipCode: '10005',
    country: 'USA',
    isDefault: false,
  },
  {
    id: 'addr-3',
    userId: 'user-cust-2',
    label: 'home',
    fullName: 'Emily Johnson',
    phone: '+1 (555) 100-0002',
    street: '789 Oak Lane',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    isDefault: true,
  },
];

// ============================================================
// CATEGORIES (8)
// ============================================================

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Latest flagship and budget smartphones from top brands worldwide',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    parentId: null,
    productCount: 32,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Laptops & Computers',
    slug: 'laptops-computers',
    description: 'Powerful laptops, desktops, and accessories for work and gaming',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    parentId: null,
    productCount: 28,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Audio & Headphones',
    slug: 'audio-headphones',
    description: 'Premium headphones, earbuds, speakers and audiophile equipment',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    parentId: null,
    productCount: 24,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Cameras & Photography',
    slug: 'cameras-photography',
    description: 'DSLR, mirrorless cameras, lenses and photography accessories',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    parentId: null,
    productCount: 18,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smart watches, fitness trackers, AR glasses and wearable tech',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    parentId: null,
    productCount: 16,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-6',
    name: 'Gaming',
    slug: 'gaming',
    description: 'Consoles, controllers, gaming peripherals and accessories',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400',
    parentId: null,
    productCount: 22,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-7',
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Smart speakers, home automation, security cameras and IoT devices',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    parentId: null,
    productCount: 20,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-8',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Cables, chargers, cases, stands and all essential tech accessories',
    image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400',
    parentId: null,
    productCount: 56,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================================
// BRANDS
// ============================================================

export const mockBrands: Brand[] = [
  {
    id: 'brand-1',
    name: 'Apple',
    slug: 'apple',
    logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100',
    description: 'Think Different',
    productCount: 24,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'brand-2',
    name: 'Samsung',
    slug: 'samsung',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100',
    description: 'Inspire the World, Create the Future',
    productCount: 31,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'brand-3',
    name: 'Sony',
    slug: 'sony',
    logo: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=100',
    description: 'Be Moved',
    productCount: 18,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'brand-4',
    name: 'Dell',
    slug: 'dell',
    logo: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=100',
    description: 'The Power to Do More',
    productCount: 14,
    createdAt: '2023-01-01T00:00:00Z',
  },
];

// ============================================================
// PRODUCTS (10)
// ============================================================

export const mockProducts: Product[] = [
  // ── PRODUCT 1 ─────────────────────────────────────────────
  {
    id: 'prod-1',
    vendorId: 'vendor-1',
    vendorName: 'TechStore Pro',
    categoryId: 'cat-1',
    categoryName: 'Smartphones',
    brandId: 'brand-1',
    brandName: 'Apple',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description:
      'The most powerful iPhone ever. Titanium design, A17 Pro chip, and a 48MP camera system that captures stunning detail in any light. With USB-C and Action Button, this is the future of smartphones.',
    price: 1199.99,
    originalPrice: 1299.99,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600',
      'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600',
    ],
    stock: 45,
    sku: 'APL-IP15PM-256',
    specifications: [
      { label: 'Display', value: '6.7" Super Retina XDR OLED' },
      { label: 'Chip', value: 'A17 Pro (3nm)' },
      { label: 'Storage', value: '256GB' },
      { label: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto' },
      { label: 'Battery', value: '4422 mAh' },
      { label: 'OS', value: 'iOS 17' },
      { label: 'Build', value: 'Titanium frame, Ceramic Shield front' },
      { label: 'Weight', value: '221g' },
    ],
    variants: [
      { id: 'var-1-1', productId: 'prod-1', name: 'Storage', value: '256GB', priceModifier: 0, stock: 45, sku: 'APL-IP15PM-256' },
      { id: 'var-1-2', productId: 'prod-1', name: 'Storage', value: '512GB', priceModifier: 100, stock: 20, sku: 'APL-IP15PM-512' },
      { id: 'var-1-3', productId: 'prod-1', name: 'Storage', value: '1TB', priceModifier: 200, stock: 10, sku: 'APL-IP15PM-1TB' },
    ],
    rating: 4.9,
    reviewCount: 512,
    featured: true,
    bestseller: true,
    isPublished: true,
    tags: ['flagship', 'iOS', '5G', 'pro camera'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },

  // ── PRODUCT 2 ─────────────────────────────────────────────
  {
    id: 'prod-2',
    vendorId: 'vendor-1',
    vendorName: 'TechStore Pro',
    categoryId: 'cat-2',
    categoryName: 'Laptops & Computers',
    brandId: 'brand-1',
    brandName: 'Apple',
    name: 'MacBook Pro 14" M3 Pro',
    slug: 'macbook-pro-14-m3-pro',
    description:
      'Supercharged by M3 Pro chip, the MacBook Pro 14" delivers exceptional performance for demanding workflows. With up to 18 hours of battery life, Liquid Retina XDR display, and a stunning all-day battery — this is the pro laptop redefined.',
    price: 1999.99,
    originalPrice: 2199.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600',
    ],
    stock: 18,
    sku: 'APL-MBP14-M3P',
    specifications: [
      { label: 'Display', value: '14.2" Liquid Retina XDR (3024×1964)' },
      { label: 'Chip', value: 'Apple M3 Pro (11-core CPU, 14-core GPU)' },
      { label: 'RAM', value: '18GB Unified Memory' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Battery', value: 'Up to 18 hours' },
      { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD Card, MagSafe 3' },
      { label: 'Weight', value: '1.61 kg' },
    ],
    rating: 4.8,
    reviewCount: 289,
    featured: true,
    bestseller: true,
    isPublished: true,
    tags: ['laptop', 'macOS', 'M3', 'pro'],
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },

  // ── PRODUCT 3 ─────────────────────────────────────────────
  {
    id: 'prod-3',
    vendorId: 'vendor-2',
    vendorName: 'GadgetZone',
    categoryId: 'cat-3',
    categoryName: 'Audio & Headphones',
    brandId: 'brand-3',
    brandName: 'Sony',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5-wireless',
    description:
      'Industry-leading noise canceling with two processors and eight microphones. Crystal clear hands-free calling, 30-hour battery, and multipoint connection. The WH-1000XM5 is the gold standard in wireless headphones.',
    price: 349.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600',
    ],
    stock: 67,
    sku: 'SNY-WH1000XM5-BLK',
    specifications: [
      { label: 'Type', value: 'Over-ear, Closed-back' },
      { label: 'Driver', value: '30mm' },
      { label: 'Frequency Response', value: '4Hz–40,000Hz' },
      { label: 'Battery Life', value: '30 hours (NC on)' },
      { label: 'Charging', value: 'USB-C, 3 min quick charge = 3 hrs' },
      { label: 'Noise Canceling', value: 'Dual Processor (V1 x2)' },
      { label: 'Weight', value: '250g' },
      { label: 'Connectivity', value: 'Bluetooth 5.2, Multipoint' },
    ],
    rating: 4.7,
    reviewCount: 1204,
    featured: true,
    bestseller: true,
    isPublished: true,
    tags: ['noise canceling', 'wireless', 'audiophile', 'ANC'],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },

  // ── PRODUCT 4 ─────────────────────────────────────────────
  {
    id: 'prod-4',
    vendorId: 'vendor-2',
    vendorName: 'GadgetZone',
    categoryId: 'cat-1',
    categoryName: 'Smartphones',
    brandId: 'brand-2',
    brandName: 'Samsung',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description:
      'Galaxy AI is here. The Galaxy S24 Ultra features a built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3. Experience the future of mobile AI with Circle to Search, Live Translate, and more.',
    price: 1099.99,
    originalPrice: 1199.99,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
      'https://images.unsplash.com/photo-1587840171670-8b850147754e?w=600',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600',
    ],
    stock: 38,
    sku: 'SAM-GS24U-256',
    specifications: [
      { label: 'Display', value: '6.8" QHD+ Dynamic AMOLED 2X, 120Hz' },
      { label: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { label: 'RAM', value: '12GB' },
      { label: 'Storage', value: '256GB' },
      { label: 'Main Camera', value: '200MP (f/1.7) + 12MP + 10MP + 50MP' },
      { label: 'Battery', value: '5000mAh, 45W wired charging' },
      { label: 'S Pen', value: 'Built-in, 2.8ms latency' },
      { label: 'OS', value: 'Android 14, One UI 6.1' },
    ],
    rating: 4.8,
    reviewCount: 743,
    featured: true,
    bestseller: false,
    isPublished: true,
    tags: ['S Pen', 'flagship', 'Android', '200MP'],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },

  // ── PRODUCT 5 ─────────────────────────────────────────────
  {
    id: 'prod-5',
    vendorId: 'vendor-1',
    vendorName: 'TechStore Pro',
    categoryId: 'cat-5',
    categoryName: 'Wearables',
    brandId: 'brand-1',
    brandName: 'Apple',
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    description:
      'The most rugged and capable Apple Watch ever. Precision dual-frequency GPS, up to 60 hours of battery life, and the new S9 chip. Built for extreme athletes and adventurers — rated to 100m water resistance.',
    price: 799.99,
    originalPrice: 849.99,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600',
    images: [
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600',
    ],
    stock: 22,
    sku: 'APL-AWU2-49MM',
    specifications: [
      { label: 'Case Size', value: '49mm Titanium' },
      { label: 'Display', value: 'Always-On Retina LTPO OLED' },
      { label: 'Chip', value: 'Apple S9 SiP' },
      { label: 'Battery', value: 'Up to 60 hours (Low Power Mode)' },
      { label: 'Water Resistance', value: '100m (ISO 22810:2010)' },
      { label: 'GPS', value: 'L1 + L5 Dual-frequency' },
      { label: 'Connectivity', value: 'LTE, Wi-Fi 6, Bluetooth 5.3, UWB' },
    ],
    rating: 4.6,
    reviewCount: 387,
    featured: false,
    bestseller: false,
    isPublished: true,
    tags: ['smartwatch', 'fitness', 'rugged', 'GPS'],
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },

  // ── PRODUCT 6 ─────────────────────────────────────────────
  {
    id: 'prod-6',
    vendorId: 'vendor-2',
    vendorName: 'GadgetZone',
    categoryId: 'cat-4',
    categoryName: 'Cameras & Photography',
    brandId: 'brand-3',
    brandName: 'Sony',
    name: 'Sony Alpha A7R V Mirrorless Camera',
    slug: 'sony-alpha-a7r-v',
    description:
      'The Sony Alpha A7R V features a 61MP full-frame sensor, AI-powered autofocus, and 8K video recording. With the world\'s most advanced autofocus system and stunning image quality, this is a photographer\'s dream.',
    price: 3499.99,
    originalPrice: 3799.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600',
      'https://images.unsplash.com/photo-1467134983221-af4c2f75c7ba?w=600',
      'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600',
    ],
    stock: 9,
    sku: 'SNY-A7RV-BODY',
    specifications: [
      { label: 'Sensor', value: '61MP Full-Frame BSI CMOS' },
      { label: 'ISO Range', value: '100–32,000 (expandable 50–102,400)' },
      { label: 'Autofocus', value: '693 phase-detect points, AI subject recognition' },
      { label: 'Video', value: '8K 24fps, 4K 60fps' },
      { label: 'Stabilization', value: '8-stop in-body 5-axis' },
      { label: 'Viewfinder', value: '9.44M-dot OLED EVF' },
      { label: 'Card Slots', value: 'Dual (CFexpress Type A / SD)' },
      { label: 'Weight', value: '723g' },
    ],
    rating: 4.9,
    reviewCount: 156,
    featured: false,
    bestseller: false,
    isPublished: true,
    tags: ['mirrorless', 'full-frame', '61MP', 'professional'],
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
  },

  // ── PRODUCT 7 ─────────────────────────────────────────────
  {
    id: 'prod-7',
    vendorId: 'vendor-1',
    vendorName: 'TechStore Pro',
    categoryId: 'cat-6',
    categoryName: 'Gaming',
    brandId: 'brand-3',
    brandName: 'Sony',
    name: 'PlayStation 5 Console (Slim)',
    slug: 'playstation-5-slim',
    description:
      'The PS5 Slim features a sleeker design with the same powerhouse hardware. Experience lightning-fast loading with the ultra-high speed SSD, deeper immersion with the DualSense controller, and a new generation of incredible PlayStation games.',
    price: 499.99,
    originalPrice: 549.99,
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600',
    images: [
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600',
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600',
    ],
    stock: 14,
    sku: 'SNY-PS5-SLIM-DED',
    specifications: [
      { label: 'CPU', value: '8-core AMD Zen 2, 3.5GHz' },
      { label: 'GPU', value: '10.3 TFLOPS, AMD RDNA 2' },
      { label: 'RAM', value: '16GB GDDR6' },
      { label: 'Storage', value: '1TB NVMe SSD' },
      { label: 'Optical Drive', value: 'Ultra HD Blu-ray (Disc edition)' },
      { label: 'Resolution', value: 'Up to 8K' },
      { label: 'Frame Rate', value: 'Up to 120fps' },
    ],
    rating: 4.7,
    reviewCount: 2341,
    featured: true,
    bestseller: true,
    isPublished: true,
    tags: ['console', 'gaming', 'PS5', '4K'],
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },

  // ── PRODUCT 8 ─────────────────────────────────────────────
  {
    id: 'prod-8',
    vendorId: 'vendor-2',
    vendorName: 'GadgetZone',
    categoryId: 'cat-7',
    categoryName: 'Smart Home',
    brandId: 'brand-1',
    brandName: 'Apple',
    name: 'Apple HomePod (2nd Gen)',
    slug: 'apple-homepod-2nd-gen',
    description:
      'Stunning high-fidelity audio with room-sensing technology. Built-in intelligence of Siri. With S7 chip, the HomePod delivers a groundbreaking listening experience that automatically adapts to its location for a rich, immersive sound.',
    price: 299.99,
    originalPrice: 329.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
    ],
    stock: 33,
    sku: 'APL-HP2-WHT',
    specifications: [
      { label: 'Chip', value: 'Apple S7' },
      { label: 'Audio', value: '4-inch high-excursion woofer, 5 tweeters' },
      { label: 'Microphones', value: '6-microphone array' },
      { label: 'Connectivity', value: 'Wi-Fi 6 (802.11ax), Bluetooth 5.0, Thread' },
      { label: 'Smart Home', value: 'HomeKit, Matter hub built-in' },
      { label: 'Temperature Sensor', value: 'Yes' },
      { label: 'Height', value: '168mm' },
    ],
    rating: 4.5,
    reviewCount: 428,
    featured: false,
    bestseller: false,
    isPublished: true,
    tags: ['smart speaker', 'HomeKit', 'Siri', 'hi-fi'],
    createdAt: '2024-01-04T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
  },

  // ── PRODUCT 9 ─────────────────────────────────────────────
  {
    id: 'prod-9',
    vendorId: 'vendor-1',
    vendorName: 'TechStore Pro',
    categoryId: 'cat-2',
    categoryName: 'Laptops & Computers',
    brandId: 'brand-4',
    brandName: 'Dell',
    name: 'Dell XPS 15 (9530)',
    slug: 'dell-xps-15-9530',
    description:
      'The Dell XPS 15 combines stunning OLED display technology with Intel Core i9 performance and NVIDIA RTX graphics. A thin and light powerhouse designed for creators who demand the best display and performance.',
    price: 1849.99,
    originalPrice: 2099.99,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600',
    ],
    stock: 11,
    sku: 'DEL-XPS15-9530-I9',
    specifications: [
      { label: 'Display', value: '15.6" OLED 3.5K (3456×2160) Touch' },
      { label: 'Processor', value: 'Intel Core i9-13900H' },
      { label: 'GPU', value: 'NVIDIA GeForce RTX 4070 8GB' },
      { label: 'RAM', value: '32GB DDR5 4800MHz' },
      { label: 'Storage', value: '1TB NVMe PCIe Gen4 SSD' },
      { label: 'Battery', value: '86Wh, up to 13 hours' },
      { label: 'Ports', value: '2x Thunderbolt 4, USB-A, SD Card, headphone jack' },
      { label: 'Weight', value: '1.86 kg' },
    ],
    rating: 4.6,
    reviewCount: 217,
    featured: false,
    bestseller: false,
    isPublished: true,
    tags: ['laptop', 'OLED', 'RTX', 'creator'],
    createdAt: '2024-01-07T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },

  // ── PRODUCT 10 ─────────────────────────────────────────────
  {
    id: 'prod-10',
    vendorId: 'vendor-2',
    vendorName: 'GadgetZone',
    categoryId: 'cat-8',
    categoryName: 'Accessories',
    brandId: 'brand-2',
    brandName: 'Samsung',
    name: 'Samsung 65W USB-C Super Fast Charger Trio',
    slug: 'samsung-65w-usb-c-charger-trio',
    description:
      'Charge three devices simultaneously at blazing fast speeds. The 65W trio charger delivers Super Fast Charging 2.0 for Galaxy devices, 45W PD for laptops, and 15W wireless. One brick to rule them all.',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600',
    images: [
      'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600',
      'https://images.unsplash.com/photo-1583394293214-0d3f94b74b22?w=600',
    ],
    stock: 120,
    sku: 'SAM-65W-TRIO-CHG',
    specifications: [
      { label: 'Total Output', value: '65W' },
      { label: 'Port 1', value: 'USB-C 45W PD (laptop compatible)' },
      { label: 'Port 2', value: 'USB-C 25W Super Fast Charging 2.0' },
      { label: 'Port 3', value: 'USB-A 15W' },
      { label: 'Compatibility', value: 'Galaxy, iPhone 15, MacBook Air' },
      { label: 'Cable Included', value: 'USB-C to USB-C (1.8m)' },
      { label: 'Size', value: '66 × 66 × 32mm' },
    ],
    rating: 4.4,
    reviewCount: 892,
    featured: false,
    bestseller: true,
    isPublished: true,
    tags: ['charger', 'USB-C', 'fast charging', 'multiport'],
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

// ============================================================
// REVIEWS
// ============================================================

export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerId: 'user-cust-1',
    customerName: 'John Smith',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    rating: 5,
    comment: 'Absolutely incredible phone. The titanium build feels premium, camera in low light is unbelievably good. The USB-C switch was long overdue. Worth every penny.',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    customerId: 'user-cust-2',
    customerName: 'Emily Johnson',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    comment: 'Upgraded from iPhone 13 Pro and the difference is night and day. The Action Button is genius and the display is stunning. Battery easily lasts all day.',
    createdAt: '2024-01-17T11:00:00Z',
    updatedAt: '2024-01-17T11:00:00Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    customerId: 'user-cust-1',
    customerName: 'John Smith',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    rating: 5,
    comment: 'Best headphones I have ever owned. The noise canceling is so good you forget the world exists. Multipoint works flawlessly between my phone and laptop.',
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-14T08:00:00Z',
  },
  {
    id: 'rev-4',
    productId: 'prod-7',
    customerId: 'user-cust-2',
    customerName: 'Emily Johnson',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 4,
    comment: 'PS5 Slim is a great upgrade. Quieter than the original, loads games in seconds. The DualSense haptics are still the best in the industry. Minor complaint — still hard to find.',
    createdAt: '2024-01-13T15:00:00Z',
    updatedAt: '2024-01-13T15:00:00Z',
  },
];

// ============================================================
// CART (3 items for user-cust-1)
// ============================================================

export const mockCart: Cart = {
  userId: 'user-cust-1',
  items: [
    {
      id: 'cart-item-1',
      productId: 'prod-1',
      productName: 'iPhone 15 Pro Max',
      productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200',
      vendorId: 'vendor-1',
      vendorName: 'TechStore Pro',
      price: 1199.99,
      quantity: 1,
      total: 1199.99,
      stock: 45,
      variant: '256GB',
    },
    {
      id: 'cart-item-2',
      productId: 'prod-3',
      productName: 'Sony WH-1000XM5 Wireless Headphones',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
      vendorId: 'vendor-2',
      vendorName: 'GadgetZone',
      price: 349.99,
      quantity: 1,
      total: 349.99,
      stock: 67,
    },
    {
      id: 'cart-item-3',
      productId: 'prod-10',
      productName: 'Samsung 65W USB-C Super Fast Charger Trio',
      productImage: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=200',
      vendorId: 'vendor-2',
      vendorName: 'GadgetZone',
      price: 69.99,
      quantity: 2,
      total: 139.98,
      stock: 120,
    },
  ],
  subtotal: 1689.96,
  itemCount: 4,
  updatedAt: '2024-01-15T12:00:00Z',
};

// ============================================================
// WISHLIST
// ============================================================

export const mockWishlist: WishlistItem[] = [
  {
    id: 'wish-1',
    productId: 'prod-2',
    productName: 'MacBook Pro 14" M3 Pro',
    productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    price: 1999.99,
    originalPrice: 2199.99,
    rating: 4.8,
    stock: 18,
    addedAt: '2024-01-12T09:00:00Z',
  },
  {
    id: 'wish-2',
    productId: 'prod-5',
    productName: 'Apple Watch Ultra 2',
    productImage: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
    price: 799.99,
    originalPrice: 849.99,
    rating: 4.6,
    stock: 22,
    addedAt: '2024-01-13T14:00:00Z',
  },
  {
    id: 'wish-3',
    productId: 'prod-7',
    productName: 'PlayStation 5 Console (Slim)',
    productImage: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400',
    price: 499.99,
    originalPrice: 549.99,
    rating: 4.7,
    stock: 14,
    addedAt: '2024-01-14T18:00:00Z',
  },
];

// ============================================================
// ORDERS (5)
// ============================================================

export const mockOrders: Order[] = [
  // ── ORDER 1: Delivered ────────────────────────────────────
  {
    id: 'order-1',
    orderNumber: 'EM-2024-001',
    customerId: 'user-cust-1',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1 (555) 100-0001',
    vendorId: 'vendor-1',
    vendorName: 'TechStore Pro',
    deliveryId: 'user-delivery-1',
    deliveryPersonName: 'Carlos Rivera',
    items: [
      {
        productId: 'prod-3',
        productName: 'Sony WH-1000XM5 Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
        vendorId: 'vendor-2',
        vendorName: 'GadgetZone',
        quantity: 1,
        price: 349.99,
        total: 349.99,
      },
      {
        productId: 'prod-10',
        productName: 'Samsung 65W USB-C Super Fast Charger Trio',
        productImage: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=200',
        vendorId: 'vendor-2',
        vendorName: 'GadgetZone',
        quantity: 2,
        price: 69.99,
        total: 139.98,
      },
    ],
    subtotal: 489.97,
    shippingCost: 9.99,
    tax: 44.10,
    discount: 0,
    total: 544.06,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'SSLCommerz',
    shippingAddress: {
      label: 'home',
      fullName: 'John Smith',
      phone: '+1 (555) 100-0001',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    trackingNumber: 'EM-TRK-2024-001',
    estimatedDelivery: '2024-01-14T00:00:00Z',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-14T11:00:00Z',
  },

  // ── ORDER 2: Shipped ──────────────────────────────────────
  {
    id: 'order-2',
    orderNumber: 'EM-2024-002',
    customerId: 'user-cust-1',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1 (555) 100-0001',
    vendorId: 'vendor-1',
    vendorName: 'TechStore Pro',
    deliveryId: 'user-delivery-1',
    deliveryPersonName: 'Carlos Rivera',
    items: [
      {
        productId: 'prod-2',
        productName: 'MacBook Pro 14" M3 Pro',
        productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200',
        vendorId: 'vendor-1',
        vendorName: 'TechStore Pro',
        quantity: 1,
        price: 1999.99,
        total: 1999.99,
      },
    ],
    subtotal: 1999.99,
    shippingCost: 0,
    tax: 180.00,
    discount: 200.00,
    total: 1979.99,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'SSLCommerz',
    shippingAddress: {
      label: 'home',
      fullName: 'John Smith',
      phone: '+1 (555) 100-0001',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    trackingNumber: 'EM-TRK-2024-002',
    estimatedDelivery: '2024-01-18T00:00:00Z',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },

  // ── ORDER 3: Processing ───────────────────────────────────
  {
    id: 'order-3',
    orderNumber: 'EM-2024-003',
    customerId: 'user-cust-2',
    customerName: 'Emily Johnson',
    customerEmail: 'emily.johnson@email.com',
    customerPhone: '+1 (555) 100-0002',
    vendorId: 'vendor-2',
    vendorName: 'GadgetZone',
    items: [
      {
        productId: 'prod-4',
        productName: 'Samsung Galaxy S24 Ultra',
        productImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200',
        vendorId: 'vendor-2',
        vendorName: 'GadgetZone',
        quantity: 1,
        price: 1099.99,
        total: 1099.99,
        variant: '256GB / Titanium Black',
      },
    ],
    subtotal: 1099.99,
    shippingCost: 0,
    tax: 98.99,
    discount: 0,
    total: 1198.98,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'SSLCommerz',
    shippingAddress: {
      label: 'home',
      fullName: 'Emily Johnson',
      phone: '+1 (555) 100-0002',
      street: '789 Oak Lane',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    estimatedDelivery: '2024-01-20T00:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },

  // ── ORDER 4: Pending ──────────────────────────────────────
  {
    id: 'order-4',
    orderNumber: 'EM-2024-004',
    customerId: 'user-cust-2',
    customerName: 'Emily Johnson',
    customerEmail: 'emily.johnson@email.com',
    customerPhone: '+1 (555) 100-0002',
    vendorId: 'vendor-1',
    vendorName: 'TechStore Pro',
    items: [
      {
        productId: 'prod-7',
        productName: 'PlayStation 5 Console (Slim)',
        productImage: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=200',
        vendorId: 'vendor-1',
        vendorName: 'TechStore Pro',
        quantity: 1,
        price: 499.99,
        total: 499.99,
      },
    ],
    subtotal: 499.99,
    shippingCost: 14.99,
    tax: 45.00,
    discount: 0,
    total: 559.98,
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: 'Cash on Delivery',
    shippingAddress: {
      label: 'home',
      fullName: 'Emily Johnson',
      phone: '+1 (555) 100-0002',
      street: '789 Oak Lane',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    note: 'Please call before delivery',
    createdAt: '2024-01-15T16:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
  },

  // ── ORDER 5: Cancelled ────────────────────────────────────
  {
    id: 'order-5',
    orderNumber: 'EM-2024-005',
    customerId: 'user-cust-1',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1 (555) 100-0001',
    vendorId: 'vendor-2',
    vendorName: 'GadgetZone',
    items: [
      {
        productId: 'prod-6',
        productName: 'Sony Alpha A7R V Mirrorless Camera',
        productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200',
        vendorId: 'vendor-2',
        vendorName: 'GadgetZone',
        quantity: 1,
        price: 3499.99,
        total: 3499.99,
      },
    ],
    subtotal: 3499.99,
    shippingCost: 0,
    tax: 315.00,
    discount: 300.00,
    total: 3514.99,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'SSLCommerz',
    shippingAddress: {
      label: 'office',
      fullName: 'John Smith',
      phone: '+1 (555) 100-0001',
      street: '456 Business Ave, Floor 12',
      city: 'New York',
      state: 'NY',
      zipCode: '10005',
      country: 'USA',
    },
    note: 'Customer changed mind — full refund issued',
    createdAt: '2024-01-08T13:00:00Z',
    updatedAt: '2024-01-09T09:00:00Z',
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-cust-1',
    type: 'order',
    title: 'Order Shipped!',
    message: 'Your order EM-2024-002 (MacBook Pro 14") has been shipped. Estimated delivery: Jan 18.',
    isRead: false,
    link: '/customer/orders/order-2',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-cust-1',
    type: 'promotion',
    title: 'Flash Sale — 20% off Gaming',
    message: 'Today only! Get 20% off all Gaming products. Use code GAME20 at checkout.',
    isRead: false,
    link: '/products?category=gaming',
    createdAt: '2024-01-15T07:00:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-cust-1',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order EM-2024-001 has been delivered successfully. Enjoy your Sony headphones!',
    isRead: true,
    link: '/customer/orders/order-1',
    createdAt: '2024-01-14T11:00:00Z',
  },
  {
    id: 'notif-4',
    userId: 'user-vendor-1',
    type: 'order',
    title: 'New Order Received',
    message: 'You have a new order (EM-2024-002) for MacBook Pro 14" M3 Pro worth $1,999.99.',
    isRead: false,
    link: '/vendor/orders',
    createdAt: '2024-01-14T09:00:00Z',
  },
  {
    id: 'notif-5',
    userId: 'user-delivery-1',
    type: 'delivery',
    title: 'New Delivery Assigned',
    message: 'Order EM-2024-002 has been assigned to you. Pickup from TechStore Pro, 456 Tech Ave.',
    isRead: false,
    link: '/delivery/assigned',
    createdAt: '2024-01-15T08:30:00Z',
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
    { month: 'Aug', revenue: 9200, orders: 87 },
    { month: 'Sep', revenue: 11400, orders: 102 },
    { month: 'Oct', revenue: 13800, orders: 124 },
    { month: 'Nov', revenue: 18900, orders: 171 },
    { month: 'Dec', revenue: 24500, orders: 221 },
    { month: 'Jan', revenue: 21300, orders: 193 },
  ],
  topProducts: [
    { id: 'prod-1', name: 'iPhone 15 Pro Max', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100', price: 1199.99, reviewCount: 512 },
    { id: 'prod-7', name: 'PlayStation 5 Console (Slim)', image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=100', price: 499.99, reviewCount: 2341 },
    { id: 'prod-3', name: 'Sony WH-1000XM5', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100', price: 349.99, reviewCount: 1204 },
    { id: 'prod-2', name: 'MacBook Pro 14" M3 Pro', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100', price: 1999.99, reviewCount: 289 },
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