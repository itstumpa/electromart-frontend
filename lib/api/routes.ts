const getApiBase = (): string => {
  if (typeof window === "undefined") {
    const backend = process.env.BACKEND_URL || "";
    return backend ? `${backend.replace(/\/$/, "")}/api/v1` : "/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
};

export const API_BASE = getApiBase();

export const ROUTES = {
  // Auth
  auth: {
    signup: '/auth/signup',
    signin: '/auth/signin',
    me: '/auth/me',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    changePassword: '/auth/change-password',
  },
  
  // Products
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    search: '/products/search',
    myProducts: '/products/my/products',
  },
  
  // Orders
  orders: {
    list: '/orders',
    myOrders: '/orders/my',
    detail: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  
  // Cart
  cart: {
    get: '/cart',
    add: (productId: string) => `/cart/${productId}`,
  },
  
  // Add more as needed...
} as const;