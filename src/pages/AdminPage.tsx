import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Store, Users, Package, ShoppingBag, DollarSign,
  TrendingUp, CheckCircle, XCircle, Eye, Trash2, Bell, Shield,
  Activity, Database, Globe, Zap
} from "lucide-react";
import { Button } from "../components/Button";
import { GlassCard, Badge } from "../components/UI";
import { useStore, formatDZD, formatDate } from "../store";

type Tab = "overview" | "stores" | "users" | "orders" | "subscriptions" | "notifications";

export function AdminPage() {
  const navigate = useNavigate();
  const { currentUser, stores, orders, subscriptions, updateStore, addNotification } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (!currentUser || currentUser.role !== "admin") {
    navigate("/login");
    return null;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeStores = stores.filter((s) => s.status === "active").length;

  const tabs = [
    { id: "overview" as Tab, label: "نظرة عامة", icon: LayoutDashboard },
    { id: "stores" as Tab, label: "المتاجر", icon: Store },
    { id: "orders" as Tab, label: "الطلبات", icon: ShoppingBag },
    { id: "subscriptions" as Tab, label: "الاشتراكات", icon: DollarSign },
    { id: "notifications" as Tab, label: "الإشعارات", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-12 px-4 relative">
      {/* Cyber Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-royal-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold-400/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-royal-600/5 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-l from-gold-400 to-royal-600 flex items-center justify-center shadow-lg shadow-gold-400/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black">لوحة تحكم المدير</h1>
              <p className="text-sm text-dark-400">Super Admin Dashboard</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-l from-gold-400 to-royal-600 text-white"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-bold text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "المتاجر النشطة", value: activeStores, icon: Store, color: "text-green-400" },
                    { label: "إجمالي المتاجر", value: stores.length, icon: Database, color: "text-blue-400" },
                    { label: "إجمالي الطلبات", value: orders.length, icon: ShoppingBag, color: "text-purple-400" },
                    { label: "إجمالي الإيرادات", value: formatDZD(totalRevenue), icon: DollarSign, color: "text-gold-400" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard>
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                          </div>
                          <TrendingUp className="w-4 h-4 text-green-400" />
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
                      <Activity className="w-5 h-5 text-gold-400" />
                      النشاط الأخير
                    </h3>
                    <div className="space-y-2">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <div className="text-sm">
                            <div className="font-bold">{order.customerName}</div>
                            <div className="text-xs text-dark-400">{formatDate(order.createdAt)}</div>
                          </div>
                          <Badge variant={order.status === "pending" ? "warning" : "success"}>
                            {formatDZD(order.total)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard>
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-gold-400" />
                      إحصائيات المنصة
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-sm">متوسط الطلبات لكل متجر</span>
                        <span className="font-bold text-gold-400">
                          {stores.length ? (orders.length / stores.length).toFixed(1) : 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-sm">متوسط قيمة الطلب</span>
                        <span className="font-bold text-gold-400">
                          {orders.length ? formatDZD(Math.round(totalRevenue / orders.length)) : 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-sm">نسبة المتاجر النشطة</span>
                        <span className="font-bold text-green-400">
                          {stores.length ? Math.round((activeStores / stores.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-sm">أداء النظام</span>
                        <Badge variant="success">ممتاز</Badge>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}

            {activeTab === "stores" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">إدارة المتاجر ({stores.length})</h2>
                {stores.length === 0 ? (
                  <GlassCard>
                    <p className="text-center py-12 text-dark-400">لا توجد متاجر بعد</p>
                  </GlassCard>
                ) : (
                  <div className="grid gap-4">
                    {stores.map((store) => (
                      <GlassCard key={store.id}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl"
                              style={{ background: `linear-gradient(135deg, ${store.primaryColor}, ${store.accentColor})` }}
                            >
                              {store.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold">{store.name}</h3>
                              <div className="text-sm text-dark-400">{store.wilaya} - {store.category}</div>
                              <div className="text-xs text-dark-400">{formatDate(store.createdAt)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={store.status === "active" ? "success" : store.status === "pending" ? "warning" : "error"}>
                              {store.status === "active" ? "نشط" : store.status === "pending" ? "معلق" : "موقوف"}
                            </Badge>
                            <Badge variant="gold">{store.plan}</Badge>
                            <div className="flex gap-1">
                              {store.status !== "active" && (
                                <button
                                  onClick={() => updateStore(store.id, { status: "active" })}
                                  className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                  title="تفعيل"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {store.status === "active" && (
                                <button
                                  onClick={() => updateStore(store.id, { status: "suspended" })}
                                  className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                                  title="إيقاف"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              <a
                                href={`/store/${store.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                title="معاينة"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">جميع الطلبات ({orders.length})</h2>
                {orders.length === 0 ? (
                  <GlassCard>
                    <p className="text-center py-12 text-dark-400">لا توجد طلبات بعد</p>
                  </GlassCard>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <GlassCard key={order.id}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
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
                            <div className="text-xs text-dark-400">{order.productName}</div>
                            <div className="text-xs text-dark-400">{order.wilaya} - {formatDate(order.createdAt)}</div>
                          </div>
                          <div className="text-left">
                            <div className="text-xl font-black text-gold-400">{formatDZD(order.total)}</div>
                            <div className="text-xs text-dark-400">متجر: {stores.find(s => s.id === order.storeId)?.name}</div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "subscriptions" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">الاشتراكات ({subscriptions.length})</h2>
                <GlassCard>
                  <div className="space-y-3">
                    {subscriptions.length === 0 ? (
                      <p className="text-center py-12 text-dark-400">لا توجد اشتراكات</p>
                    ) : (
                      subscriptions.map((sub) => {
                        const store = stores.find((s) => s.id === sub.storeId);
                        return (
                          <div key={sub.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div>
                              <div className="font-bold">{store?.name}</div>
                              <div className="text-xs text-dark-400">{formatDate(sub.createdAt)}</div>
                            </div>
                            <div className="text-left">
                              <Badge variant={sub.status === "active" ? "success" : sub.status === "pending" ? "warning" : "error"}>
                                {sub.status === "active" ? "نشط" : sub.status === "pending" ? "معلق" : "منتهي"}
                              </Badge>
                              <div className="text-xs text-gold-400 mt-1">
                                الكود: {sub.activationCode || "—"}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === "notifications" && (
              <NotificationManager />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function NotificationManager() {
  const { stores, addNotification } = useStore();
  const [form, setForm] = useState({ title: "", message: "", type: "info" as const });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    stores.forEach((store) => {
      addNotification({
        id: `${Date.now()}-${store.id}`,
        storeId: store.id,
        title: form.title,
        message: form.message,
        type: form.type,
        read: false,
        createdAt: Date.now(),
      });
    });
    alert(`تم إرسال الإشعار إلى ${stores.length} متجر`);
    setForm({ title: "", message: "", type: "info" });
    setSending(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">إرسال إشعار جماعي</h2>
      <GlassCard>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">عنوان الإشعار</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-400"
              placeholder="مثال: تحديث جديد على المنصة"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">نص الرسالة</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-400 resize-none"
              placeholder="اكتب نص الإشعار..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">نوع الإشعار</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-400"
            >
              <option value="info">معلومة</option>
              <option value="success">نجاح</option>
              <option value="warning">تحذير</option>
              <option value="error">خطأ</option>
            </select>
          </div>
          <Button onClick={handleSend} isLoading={sending} icon={<Bell className="w-4 h-4" />}>
            إرسال لجميع المتاجر ({stores.length})
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
