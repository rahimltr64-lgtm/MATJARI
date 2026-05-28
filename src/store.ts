import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, User, Store, Product, Order, Coupon, Subscription, ChatMessage, Notification } from "./types";

// Sample data for first-time users
const SAMPLE_STORE_ID = "sample-store-1";
const SAMPLE_USER_ID = "sample-user-1";

const sampleData = {
  user: {
    id: SAMPLE_USER_ID,
    name: "أحمد التاجر",
    email: "ahmed@matjari.dz",
    phone: "0555123456",
    role: "merchant" as const,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  store: {
    id: SAMPLE_STORE_ID,
    ownerId: SAMPLE_USER_ID,
    name: "بوتيك الأناقة",
    slug: "boutik-elegance",
    description: "أفضل المنتجات العصرية والأنيقة بأسعار منافسة في الجزائر",
    whatsapp: "213555123456",
    wilaya: "الجزائر",
    theme: "luxury" as const,
    primaryColor: "#D4AF37",
    accentColor: "#8B5CF6",
    category: "ملابس",
    status: "active" as const,
    plan: "pro" as const,
    activatedAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    social: { facebook: "", instagram: "" },
    views: 1250,
    orders: 45,
  },
  products: [
    {
      id: "prod-1",
      storeId: SAMPLE_STORE_ID,
      title: "ساعة يد فاخرة كلاسيكية",
      description: "ساعة يد فاخرة بتصميم كلاسيكي أنيق، مصنوعة من الفولاذ المقاوم للصدأ مع حزام جلد طبيعي. مقاومة للماء حتى 50 متر. مثالية للمناسبات الرسمية والاستخدام اليومي. تأتي مع علبة هدية فاخرة وضمان سنة كاملة.",
      shortDescription: "ساعة يد فاخرة بتصميم كلاسيكي وأنيق",
      price: 8500,
      compareAtPrice: 12000,
      images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"],
      category: "مجوهرات",
      tags: ["جديد", "مميز", "عرض"],
      stock: 25,
      featured: true,
      rating: 4.9,
      sold: 124,
      createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    },
    {
      id: "prod-2",
      storeId: SAMPLE_STORE_ID,
      title: "حقيبة يد جلد طبيعي",
      description: "حقيبة يد فاخرة مصنوعة من أجود أنواع الجلد الطبيعي. تصميم عصري وأنيق مع مساحات تخزين واسعة. مثالية للعمل والخروجات اليومية.",
      shortDescription: "حقيبة جلد طبيعي بتصميم عصري",
      price: 6500,
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"],
      category: "ملابس",
      tags: ["جديد"],
      stock: 15,
      featured: true,
      rating: 4.8,
      sold: 89,
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    },
    {
      id: "prod-3",
      storeId: SAMPLE_STORE_ID,
      title: "عطر فاخر 100 مل",
      description: "عطر فاخر بتركيبة فرنسية مميزة. رائحة ثابتة طوال اليوم تجمع بين نوتات الورد والعنبر والمسك. مناسب لجميع المناسبات.",
      shortDescription: "عطر فاخر بتركيبة فرنسية",
      price: 4500,
      compareAtPrice: 6000,
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600"],
      category: "عطور",
      tags: ["الأكثر مبيعاً"],
      stock: 40,
      featured: false,
      rating: 4.7,
      sold: 256,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    },
    {
      id: "prod-4",
      storeId: SAMPLE_STORE_ID,
      title: "نظارة شمسية أنيقة",
      description: "نظارة شمسية عصرية بتصميم أنيق مع عدسات مستقطبة لحماية فائقة من الأشعة فوق البنفسجية. إطار خفيف ومتين.",
      shortDescription: "نظارة شمسية بعدسات مستقطبة",
      price: 2800,
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"],
      category: "ملابس",
      tags: ["صيفي"],
      stock: 60,
      featured: false,
      rating: 4.6,
      sold: 178,
      createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    },
  ],
  orders: [
    {
      id: "order-1",
      storeId: SAMPLE_STORE_ID,
      productId: "prod-1",
      productName: "ساعة يد فاخرة كلاسيكية",
      customerName: "محمد بوزيد",
      customerPhone: "0666123456",
      wilaya: "وهران",
      commune: "وهران المدينة",
      address: "شارع الأمير عبد القادر",
      quantity: 1,
      total: 8500,
      shippingFee: 550,
      status: "pending" as const,
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      id: "order-2",
      storeId: SAMPLE_STORE_ID,
      productId: "prod-3",
      productName: "عطر فاخر 100 مل",
      customerName: "فاطمة الزهراء",
      customerPhone: "0777123456",
      wilaya: "قسنطينة",
      commune: "قسنطينة",
      address: "حي سيدي مبروك",
      quantity: 2,
      total: 9000,
      shippingFee: 550,
      status: "confirmed" as const,
      createdAt: Date.now() - 5 * 60 * 60 * 1000,
    },
    {
      id: "order-3",
      storeId: SAMPLE_STORE_ID,
      productId: "prod-2",
      productName: "حقيبة يد جلد طبيعي",
      customerName: "ياسمين بوعلام",
      customerPhone: "0555123457",
      wilaya: "الجزائر",
      commune: "باب الزوار",
      address: "حي 1000 مسكن",
      quantity: 1,
      total: 6500,
      shippingFee: 400,
      status: "delivered" as const,
      createdAt: Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      id: "order-4",
      storeId: SAMPLE_STORE_ID,
      productId: "prod-4",
      productName: "نظارة شمسية أنيقة",
      customerName: "كريم سعيدي",
      customerPhone: "0666987654",
      wilaya: "عنابة",
      commune: "عنابة المدينة",
      address: "شارع الثورة",
      quantity: 1,
      total: 2800,
      shippingFee: 550,
      status: "shipped" as const,
      createdAt: Date.now() - 48 * 60 * 60 * 1000,
    },
  ],
  coupons: [
    {
      id: "coupon-1",
      storeId: SAMPLE_STORE_ID,
      code: "WELCOME20",
      discount: 20,
      type: "percentage" as const,
      usageLimit: 100,
      usedCount: 23,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      active: true,
    },
    {
      id: "coupon-2",
      storeId: SAMPLE_STORE_ID,
      code: "SUMMER500",
      discount: 500,
      type: "fixed" as const,
      usageLimit: 50,
      usedCount: 12,
      expiresAt: Date.now() + 15 * 24 * 60 * 60 * 1000,
      active: true,
    },
  ],
};

interface AppState {
  theme: Theme;
  currentUser: User | null;
  stores: Store[];
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  subscriptions: Subscription[];
  chatMessages: ChatMessage[];
  notifications: Notification[];
  currentStoreId: string | null;
  initialized?: boolean;

  // Theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Auth
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;

  // Stores
  createStore: (store: Store) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  setCurrentStore: (id: string | null) => void;

  // Products
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;

  // Coupons
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Subscriptions
  addSubscription: (sub: Subscription) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;

  // Chat
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // Notifications
  addNotification: (notif: Notification) => void;
  markNotificationRead: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "dark",
      currentUser: null,
      stores: [],
      products: [],
      orders: [],
      coupons: [],
      subscriptions: [],
      chatMessages: [],
      notifications: [],
      currentStoreId: null,

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle("dark", theme === "dark");
      },

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === "dark" ? "light" : "dark";
          document.documentElement.classList.toggle("dark", newTheme === "dark");
          return { theme: newTheme };
        });
      },

      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null, currentStoreId: null }),
      register: (user) => set({ currentUser: user }),

      createStore: (store) => set((s) => ({ stores: [...s.stores, store] })),
      updateStore: (id, updates) => set((s) => ({
        stores: s.stores.map((st) => st.id === id ? { ...st, ...updates } : st)
      })),
      deleteStore: (id) => set((s) => ({
        stores: s.stores.filter((st) => st.id !== id),
        products: s.products.filter((p) => p.storeId !== id),
        orders: s.orders.filter((o) => o.storeId !== id),
      })),
      setCurrentStore: (id) => set({ currentStoreId: id }),

      addProduct: (product) => set((s) => ({ products: [...s.products, product] })),
      updateProduct: (id, updates) => set((s) => ({
        products: s.products.map((p) => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProduct: (id) => set((s) => ({
        products: s.products.filter((p) => p.id !== id)
      })),

      addOrder: (order) => set((s) => ({ orders: [...s.orders, order] })),
      updateOrder: (id, updates) => set((s) => ({
        orders: s.orders.map((o) => o.id === id ? { ...o, ...updates } : o)
      })),

      addCoupon: (coupon) => set((s) => ({ coupons: [...s.coupons, coupon] })),
      updateCoupon: (id, updates) => set((s) => ({
        coupons: s.coupons.map((c) => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCoupon: (id) => set((s) => ({
        coupons: s.coupons.filter((c) => c.id !== id)
      })),

      addSubscription: (sub) => set((s) => ({ subscriptions: [...s.subscriptions, sub] })),
      updateSubscription: (id, updates) => set((s) => ({
        subscriptions: s.subscriptions.map((sub) => sub.id === id ? { ...sub, ...updates } : sub)
      })),

      addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
      clearChat: () => set({ chatMessages: [] }),

      addNotification: (notif) => set((s) => ({ notifications: [notif, ...s.notifications] })),
      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
      })),
    }),
    {
      name: "matjari-storage",
      partialize: (state) => ({
        theme: state.theme,
        currentUser: state.currentUser,
        stores: state.stores,
        products: state.products,
        orders: state.orders,
        coupons: state.coupons,
        subscriptions: state.subscriptions,
        notifications: state.notifications,
        currentStoreId: state.currentStoreId,
        initialized: true,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle("dark", state.theme === "dark");
          // Initialize sample data on first load
          if (!(state as any).initialized && state.stores.length === 0) {
            useStore.setState({
              currentUser: sampleData.user,
              stores: [sampleData.store as any],
              products: sampleData.products,
              orders: sampleData.orders,
              coupons: sampleData.coupons,
              currentStoreId: SAMPLE_STORE_ID,
              initialized: true,
            });
          }
        }
      }
    }
  )
);

// Helper to generate unique IDs
export const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Format currency (DZD)
export const formatDZD = (amount: number) => `${amount.toLocaleString("ar-DZ")} د.ج`;

// Format date
export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
