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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في المنتجات..."
            className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-xl pr-11 pl-4 py-3 focus:outline-none focus:border-gold-400"
          />
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          إضافة منتج
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="لا توجد منتجات بعد"
          description="ابدأ بإضافة منتجاتك لجذب العملاء وزيادة مبيعاتك"
          action={
            <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
              إضافة منتج جديد
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <GlassCard key={product.id} hover>
              <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-white/5">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold mb-1 line-clamp-1">{product.title}</h3>
              <p className="text-sm text-dark-400 mb-3 line-clamp-2">{product.shortDescription}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-black text-gold-400">{formatDZD(product.price)}</span>
                <Badge>المخزون: {product.stock}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" icon={<Edit2 className="w-3 h-3" />}>
                  تعديل
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(product.id)}
                  icon={<Trash2 className="w-3 h-3" />}
                  className="text-red-400 hover:text-red-300"
                />
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="تأكيد الحذف" size="sm">
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="mb-6">هل أنت متأكد من حذف هذا المنتج؟ هذا الإجراء لا يمكن التراجع عنه.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)} className="flex-1">
              إلغاء
            </Button>
            <Button variant="primary" onClick={() => handleDelete(showDeleteConfirm!)} className="flex-1 bg-red-500 hover:bg-red-600">
              حذف
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Product Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إضافة منتج جديد" size="lg">
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-l from-gold-400/10 to-royal-600/10 border border-gold-400/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span className="font-bold">توليد بالذكاء الاصطناعي</span>
            </div>
            <p className="text-sm text-dark-300 mb-3">اكتب اسم المنتج فقط، واترك AI يكتب الوصف الاحترافي!</p>
            <div className="flex gap-2">
              <select
                value={aiStyle}
                onChange={(e) => setAiStyle(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              >
                <option value="marketing">تسويقي قوي</option>
                <option value="luxury">فاخر</option>
                <option value="youth">شبابي</option>
                <option value="professional">احترافي</option>
              </select>
              <Button
                variant="gold"
                size="sm"
                onClick={handleGenerateAI}
                isLoading={generatingAI}
                icon={<Sparkles className="w-4 h-4" />}
              >
                توليد الوصف
              </Button>
            </div>
          </div>

          <Input
            label="اسم المنتج *"
            value={currentProduct.title || ""}
            onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
            placeholder="مثال: ساعة يد فاخرة"
          />
          <Input
            label="السعر (د.ج) *"
            type="number"
            value={currentProduct.price || ""}
            onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
            placeholder="3500"
          />
          <Input
            label="الوصف القصير"
            value={currentProduct.shortDescription || ""}
            onChange={(e) => setCurrentProduct({ ...currentProduct, shortDescription: e.target.value })}
          />
          <Textarea
            label="الوصف التفصيلي"
            value={currentProduct.description || ""}
            onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
            rows={5}
          />
          <Select
            label="التصنيف"
            value={currentProduct.category || ""}
            onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
            options={[{ value: "", label: "اختر التصنيف" }, ...PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))]}
          />
          <Input
            label="المخزون"
            type="number"
            value={currentProduct.stock || ""}
            onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })}
          />

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button onClick={handleSave} className="flex-1">حفظ المنتج</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function OrdersTab({ store }: { store: any }) {
  const { orders, updateOrder } = useStore();
  const [filter, setFilter] = useState<string>("all");
  const storeOrders = orders.filter((o) => o.storeId === store.id);
  const filtered = filter === "all" ? storeOrders : storeOrders.filter((o) => o.status === filter);

  const statuses = [
    { id: "all", label: "الكل" },
    { id: "pending", label: "معلقة" },
    { id: "confirmed", label: "مؤكدة" },
    { id: "shipped", label: "تم الشحن" },
    { id: "delivered", label: "تم التوصيل" },
  ];

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrder(orderId, { status: newStatus });
    toast.success("تم تحديث حالة الطلب");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              filter === s.id
                ? "bg-gradient-to-l from-gold-400 to-royal-600 text-white"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="لا توجد طلبات"
          description="ستظهر الطلبات هنا عندما يبدأ العملاء بالشراء من متجرك"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <GlassCard key={order.id}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-dark-400">#{order.id.slice(-6)}</span>
                    <Badge variant={
                      order.status === "pending" ? "warning" :
                      order.status === "delivered" ? "success" :
                      order.status === "cancelled" ? "error" : "default"
                    }>
                      {order.status === "pending" ? "معلق" :
                       order.status === "confirmed" ? "مؤكد" :
                       order.status === "shipped" ? "تم الشحن" :
                       order.status === "delivered" ? "تم التوصيل" : "ملغي"}
                    </Badge>
                  </div>
                  <div className="font-bold">{order.customerName}</div>
                  <div className="text-sm text-dark-400">{order.customerPhone}</div>
                  <div className="text-xs text-dark-400 mt-1">{order.wilaya} - {order.commune}</div>
                </div>
                <div className="text-left">
                  <div className="text-xl font-black text-gold-400">{formatDZD(order.total)}</div>
                  <div className="text-xs text-dark-400">{formatDate(order.createdAt)}</div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="pending">معلق</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

function CouponsTab({ store }: { store: any }) {
  const { coupons, addCoupon, deleteCoupon } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", discount: 10, type: "percentage" as const, usageLimit: 100 });
  const storeCoupons = coupons.filter((c) => c.storeId === store.id);

  const handleAdd = () => {
    if (!form.code) {
      toast.error("الرجاء إدخال كود الكوبون");
      return;
    }
    addCoupon({
      id: genId(),
      storeId: store.id,
      code: form.code.toUpperCase(),
      discount: form.discount,
      type: form.type,
      usageLimit: form.usageLimit,
      usedCount: 0,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      active: true,
    });
    setShowModal(false);
    setForm({ code: "", discount: 10, type: "percentage", usageLimit: 100 });
    toast.success("تم إنشاء الكوبون بنجاح!");
  };

  const handleDelete = (id: string) => {
    deleteCoupon(id);
    toast.success("تم حذف الكوبون");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          إنشاء كوبون
        </Button>
      </div>

      {storeCoupons.length === 0 ? (
        <EmptyState
          icon={<Tag className="w-8 h-8" />}
          title="لا توجد كوبونات"
          description="أنشئ كوبونات خصم لزيادة مبيعاتك وجذب المزيد من العملاء"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storeCoupons.map((coupon) => (
            <GlassCard key={coupon.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-black text-gold-400 mb-1">{coupon.code}</div>
                  <div className="text-sm text-dark-400 mb-2">
                    خصم {coupon.discount}{coupon.type === "percentage" ? "%" : " د.ج"}
                  </div>
                  <div className="text-xs text-dark-400">
                    استخدام {coupon.usedCount}/{coupon.usageLimit}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إنشاء كوبون جديد">
        <div className="space-y-4">
          <Input
            label="كود الكوبون"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="WELCOME20"
          />
          <Input
            label="قيمة الخصم"
            type="number"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
          />
          <Select
            label="نوع الخصم"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as any })}
            options={[
              { value: "percentage", label: "نسبة مئوية %" },
              { value: "fixed", label: "قيمة ثابتة (د.ج)" },
            ]}
          />
          <Input
            label="حد الاستخدام"
            type="number"
            value={form.usageLimit}
            onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
          />
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button onClick={handleAdd} className="flex-1">إنشاء الكوبون</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>إلغاء</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ShippingTab() {
  return (
    <GlassCard>
      <h3 className="font-bold mb-4">إعدادات الشحن</h3>
      <p className="text-dark-400 mb-4">أسعار الشحن التلقائية لجميع الولايات الجزائرية (58 ولاية)</p>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {ALGERIAN_WILAYAS.map((w, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span>{w}</span>
            <span className="text-gold-400 font-bold">{i < 16 ? "400" : i < 32 ? "550" : "700"} د.ج</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function AnalyticsTab({ store }: { store: any }) {
  const { products, orders } = useStore();
  const storeOrders = orders.filter((o) => o.storeId === store.id);
  const totalRevenue = storeOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = storeOrders.length ? totalRevenue / storeOrders.length : 0;

  const monthlyData = Array.from({ length: 7 }, (_, i) => ({
    day: ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"][i],
    value: Math.floor(Math.random() * 50000) + 10000,
  }));

  const maxValue = Math.max(...monthlyData.map((d) => d.value));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <div className="text-sm text-dark-400 mb-1">إجمالي المبيعات</div>
          <div className="text-2xl font-black text-gold-400">{formatDZD(totalRevenue)}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-dark-400 mb-1">متوسط الطلب</div>
          <div className="text-2xl font-black">{formatDZD(Math.round(avgOrder))}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-dark-400 mb-1">عدد الطلبات</div>
          <div className="text-2xl font-black">{storeOrders.length}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-dark-400 mb-1">المنتجات النشطة</div>
          <div className="text-2xl font-black">{products.filter((p) => p.storeId === store.id).length}</div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="font-bold mb-6">المبيعات - آخر 7 أيام</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxValue) * 200}px` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-gold-400 to-royal-600 rounded-t-lg"
                  style={{ height: `${(d.value / maxValue) * 200}px` }}
                />
              </div>
              <span className="text-xs text-dark-400">{d.day}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function SettingsTab({ store }: { store: any }) {
  const { updateStore } = useStore();
  const [form, setForm] = useState({
    name: store.name,
    description: store.description,
    whatsapp: store.whatsapp,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateStore(store.id, form);
    setSaving(false);
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  return (
    <GlassCard>
      <h3 className="font-bold mb-6">إعدادات المتجر</h3>
      <div className="space-y-4 max-w-xl">
        <Input
          label="اسم المتجر"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Textarea
          label="الوصف"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
        />
        <Input
          label="رقم واتساب"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />
        <Button onClick={handleSave} isLoading={saving}>حفظ التغييرات</Button>
      </div>
    </GlassCard>
  );
}

function AIChatbot({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { chatMessages, addChatMessage, clearChat } = useStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    addChatMessage({
      id: genId(),
      role: "user",
      content: userMsg,
      timestamp: Date.now(),
    });
    setIsTyping(true);
    const response = await ChatbotAI.getResponse(userMsg);
    setIsTyping(false);
    addChatMessage({
      id: genId(),
      role: "assistant",
      content: response,
      timestamp: Date.now(),
    });
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-gradient-to-l from-gold-400 to-royal-600 flex items-center justify-center shadow-2xl shadow-gold-400/30 z-40"
      >
        {open ? <Bot className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 w-[calc(100vw-3rem)] sm:w-96 h-[500px] glass rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-l from-gold-400/20 to-royal-600/20 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-l from-gold-400 to-royal-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold">مساعد متجري الذكي</div>
                  <div className="text-xs text-dark-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    متصل الآن
                  </div>
                </div>
              </div>
              <button onClick={clearChat} className="text-xs text-dark-400 hover:text-white">
                مسح
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-2" />
                  <p className="font-bold mb-1">مرحباً! 👋</p>
                  <p className="text-sm text-dark-400">كيف يمكنني مساعدتك في إدارة متجرك؟</p>
                </div>
              )}
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user" ? "bg-royal-600" : "bg-gold-400/20"
                  }`}>
                    {msg.role === "user" ? (
                      <Users className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-gold-400" />
                    )}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-royal-600/30 rounded-tr-none"
                      : "bg-white/5 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="اسألني أي شيء..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-gold-400"
                />
                <Button onClick={handleSend} disabled={!input.trim()}>
                  إرسال
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
