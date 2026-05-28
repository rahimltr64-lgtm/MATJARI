import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Truck, BarChart3,
  Settings, MessageCircle, Plus, Eye, TrendingUp, DollarSign,
  Users, ShoppingCart, Sparkles, Edit2, Trash2, Search, Filter,
  Bell, Store, ExternalLink, Bot, AlertCircle
} from "lucide-react";
import { Button } from "../components/Button";
import { Input, Textarea, Select } from "../components/Form";
import { GlassCard, Modal, Badge, EmptyState } from "../components/UI";
import { useStore, genId, formatDZD, formatDate } from "../store";
import { PRODUCT_CATEGORIES, ALGERIAN_WILAYAS } from "../data";
import { AIService, ChatbotAI } from "../ai";
import type { Product, Order } from "../types";
import { toast } from "sonner";

type Tab = "overview" | "products" | "orders" | "coupons" | "shipping" | "analytics" | "settings" | "store";

export function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, stores, currentStoreId, setCurrentStore } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [chatOpen, setChatOpen] = useState(false);
  const [welcomeToast, setWelcomeToast] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const userStores = stores.filter((s) => s.ownerId === currentUser.id);
    if (userStores.length === 0) {
      navigate("/create");
      return;
    }
    if (!currentStoreId) {
      setCurrentStore(userStores[0].id);
    }

    // Show welcome toast
    const params = new URLSearchParams(window.location.search);
    if (params.get("welcome") === "1" && !welcomeToast) {
      toast.success("🎉 مرحباً بك في لوحة التحكم! ابدأ بإضافة منتجاتك الآن.");
      setWelcomeToast(true);
    }
  }, [currentUser, stores, currentStoreId, navigate, setCurrentStore, welcomeToast]);

  const store = stores.find((s) => s.id === currentStoreId);
  if (!store) return null;

  const tabs = [
    { id: "overview" as Tab, label: "نظرة عامة", icon: LayoutDashboard },
    { id: "products" as Tab, label: "المنتجات", icon: Package },
    { id: "orders" as Tab, label: "الطلبات", icon: ShoppingBag },
    { id: "coupons" as Tab, label: "الكوبونات", icon: Tag },
    { id: "shipping" as Tab, label: "الشحن", icon: Truck },
    { id: "analytics" as Tab, label: "التحليلات", icon: BarChart3 },
    { id: "settings" as Tab, label: "الإعدادات", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Store Header */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${store.primaryColor}, ${store.accentColor})` }}
              >
                {store.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-black">{store.name}</h1>
                <div className="flex items-center gap-2 text-sm text-dark-400">
                  <Badge variant={store.status === "active" ? "success" : "warning"}>
                    {store.status === "active" ? "نشط" : "بانتظار التفعيل"}
                  </Badge>
                  <span>•</span>
                  <span>{store.wilaya}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(`/store/${store.slug}`, "_blank")}
                icon={<ExternalLink className="w-4 h-4" />}
              >
                معاينة المتجر
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="glass rounded-2xl p-4 h-fit sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-l from-gold-400/20 to-royal-600/20 text-gold-400 border border-gold-400/30"
                      : "hover:bg-white/5 text-dark-300"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-bold">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {activeTab === "overview" && <OverviewTab store={store} />}
                {activeTab === "products" && <ProductsTab store={store} />}
                {activeTab === "orders" && <OrdersTab store={store} />}
                {activeTab === "coupons" && <CouponsTab store={store} />}
                {activeTab === "shipping" && <ShippingTab />}
                {activeTab === "analytics" && <AnalyticsTab store={store} />}
                {activeTab === "settings" && <SettingsTab store={store} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  );
}

function OverviewTab({ store }: { store: any }) {
  const { products, orders } = useStore();
  const storeProducts = products.filter((p) => p.storeId === store.id);
  const storeOrders = orders.filter((o) => o.storeId === store.id);
  const totalRevenue = storeOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = storeOrders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "إجمالي المبيعات", value: formatDZD(totalRevenue), icon: DollarSign, trend: "+23%" },
    { label: "الطلبات", value: storeOrders.length, icon: ShoppingCart, trend: "+12%" },
    { label: "المنتجات", value: storeProducts.length, icon: Package, trend: "+5%" },
    { label: "طلبات معلقة", value: pendingOrders, icon: Bell, trend: "" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard>
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-l from-gold-400/20 to-royal-600/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-gold-400" />
                </div>
                {stat.trend && (
                  <span className="text-xs text-green-400 font-bold">{stat.trend}</span>
                )}
              </div>
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-sm text-dark-400">{stat.label}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold-400" />
            آخر الطلبات
          </h3>
          {storeOrders.slice(0, 5).length > 0 ? (
            <div className="space-y-2">
              {storeOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <div className="font-bold text-sm">{order.customerName}</div>
                    <div className="text-xs text-dark-400">{order.productName}</div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gold-400 text-sm">{formatDZD(order.total)}</div>
                    <Badge variant={order.status === "pending" ? "warning" : "success"}>
                      {order.status === "pending" ? "معلق" : "مؤكد"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-400 text-center py-8">لا توجد طلبات بعد</p>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            نصائح ذكية
          </h3>
          <div className="space-y-3">
            {[
              "أضف منتجات جديدة بانتظام لجذب الزوار",
              "استخدم ميزة AI لتوليد وصف احترافي للمنتجات",
              "أنشئ كوبونات خصم لزيادة المبيعات",
              "تفاعل مع العملاء عبر واتساب بسرعة",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gold-400/5 border border-gold-400/20 rounded-xl">
                <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function ProductsTab({ store }: { store: any }) {
  const { products, addProduct, deleteProduct } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    title: "",
    description: "",
    shortDescription: "",
    price: 0,
    category: "",
    tags: [],
    stock: 100,
    images: [],
  });
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiStyle, setAiStyle] = useState<"luxury" | "youth" | "professional" | "marketing">("marketing");

  const storeProducts = products.filter((p) => p.storeId === store.id);
  const filtered = storeProducts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateAI = async () => {
    if (!currentProduct.title) {
      toast.error("الرجاء إدخال اسم المنتج أولاً");
      return;
    }
    setGeneratingAI(true);
    try {
      const result = await AIService.generateProductDescription(currentProduct.title, aiStyle);
      setCurrentProduct({
        ...currentProduct,
        description: result.description,
        shortDescription: result.shortDescription,
        tags: result.hashtags,
      });
      toast.success("تم توليد الوصف بنجاح!");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء توليد الوصف");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSave = () => {
    if (!currentProduct.title || !currentProduct.price) {
      toast.error("الرجاء إدخال اسم المنتج والسعر");
      return;
    }
    addProduct({
      id: genId(),
      storeId: store.id,
      title: currentProduct.title!,
      description: currentProduct.description || "",
      shortDescription: currentProduct.shortDescription || "",
      price: Number(currentProduct.price),
      images: currentProduct.images?.length ? currentProduct.images : [`https://picsum.photos/seed/${genId()}/600/600`],
      category: currentProduct.category || "",
      tags: currentProduct.tags || [],
      stock: Number(currentProduct.stock) || 100,
      featured: false,
      rating: 5,
      sold: 0,
      createdAt: Date.now(),
    });
    setShowModal(false);
    setCurrentProduct({
      title: "", description: "", shortDescription: "", price: 0,
      category: "", tags: [], stock: 100, images: [],
    });
    toast.success("تم إضافة المنتج بنجاح!");
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setShowDeleteConfirm(null);
    toast.success("تم حذف المنتج بنجاح");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between
