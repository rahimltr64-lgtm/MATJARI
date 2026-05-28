export type Theme = "light" | "dark";
export type Language = "ar" | "fr" | "en";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "merchant" | "admin";
  avatar?: string;
  createdAt: number;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description: string;
  whatsapp: string;
  wilaya: string;
  theme: "luxury" | "modern" | "classic" | "sport";
  primaryColor: string;
  accentColor: string;
  category: string;
  status: "active" | "pending" | "suspended";
  plan: "starter" | "pro" | "enterprise";
  activatedAt?: number;
  createdAt: number;
  social: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  views: number;
  orders: number;
}

export interface Product {
  id: string;
  storeId: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  featured: boolean;
  rating: number;
  sold: number;
  createdAt: number;
}

export interface Order {
  id: string;
  storeId: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  wilaya: string;
  commune: string;
  address: string;
  quantity: number;
  total: number;
  shippingFee: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  coupon?: string;
  createdAt: number;
}

export interface Coupon {
  id: string;
  storeId: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  usageLimit: number;
  usedCount: number;
  expiresAt: number;
  active: boolean;
}

export interface ShippingZone {
  wilaya: string;
  fee: number;
  feeHome: number;
  estimate: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number; // days
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  storeId: string;
  planId: string;
  status: "pending" | "active" | "expired";
  paymentProof?: string;
  activationCode?: string;
  startsAt?: number;
  endsAt?: number;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  storeId?: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: number;
}
