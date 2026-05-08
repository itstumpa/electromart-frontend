export const API_BASE = "https://electromart-backend-three.vercel.app/api/v1";

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