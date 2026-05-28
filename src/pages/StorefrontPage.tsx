import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Star, Heart, MessageCircle, Plus, Minus,
  X, MapPin, Phone, Truck, ShieldCheck, Sparkles, ArrowRight
} from "lucide-react";
import { Button } from "../components/Button";
import { Input, Select } from "../components/Form";
import { GlassCard, Modal, Badge } from "../components/UI";
import { useStore, formatDZD, genId } from "../store";
import { SHIPPING_ZONES, ALGERIAN_WILAYAS } from "../data";
import type { Product } from "../types";

interface CartItem extends Product {
  quantity: number;
}

export function StorefrontPage({ forceSlug }: { forceSlug?: string } = {}) {
  const params = useParams();
  const slug = forceSlug || params.slug;
  const { stores, products, addOrder, coupons } = useStore();
  const store = stores.find((s) => s.slug === slug);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const storeProducts = store ? products.filter((p) => p.storeId === store.id) : [];
  const categories = ["الكل", ...Array.from(new Set(storeProducts.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = storeProducts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "الكل" || p.category === category;
    return matchSearch && matchCategory;
  });

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">المتجر غير موجود</h1>
          <p className="text-dark-400">عذراً، لا يمكننا العثور على هذا المتجر</p>
        </div>
      </div>
    );
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? cartTotal * (appliedCoupon.discount / 100)
      : appliedCoupon.discount
    : 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  const applyCoupon = () => {
    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase() && c.storeId === store.id && c.active
    );
    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      alert("كوبون غير صالح");
    }
  };

  const orderViaWhatsApp = () => {
    const items = cart.map((i) => `• ${i.title} × ${i.quantity} = ${formatDZD(i.price * i.quantity)}`).join("\n");
    const message = `🛍️ طلب جديد من متجر ${store.name}\n\n${items}\n\n💰 المجموع: ${formatDZD(finalTotal)}`;
    const url = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Store Header */}
      <header
        className="relative py-20 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${store.primaryColor}dd, ${store.accentColor}dd)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-4xl font-black text-white shadow-2xl">
              {store.name.charAt(0)}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3">{store.name}</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-4">{store.description}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{store.wilaya}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-white" />4.9</span>
              <span>•</span>
              <span>{storeProducts.length} منتج</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="sticky top-0 z-30 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl pr-11 pl-4 py-3 focus:outline-none focus:border-gold-400"
              />
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative px-4 py-3 rounded-xl bg-gradient-to-l from-gold-400 to-royal-600 font-bold"
            >
              <ShoppingCart className="w-5 h-5 inline-block" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-bold ${
                  category === cat
                    ? "bg-gradient-to-l from-gold-400 to-royal-600 text-white"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, text: "توصيل سريع" },
            { icon: ShieldCheck, text: "منتجات أصلية" },
            { icon: MessageCircle, text: "دعم واتساب" },
            { icon: Sparkles, text: "جودة عالية" },
          ].map((f, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
              <f.icon className="w-6 h-6 text-gold-400" />
              <span className="font-bold text-sm">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-400">لا توجد منتجات مطابقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <GlassCard hover className="h-full p-0 overflow-hidden">
                  <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.featured && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="gold">⭐ مميز</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 line-clamp-2 h-10">{product.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                      <span className="text-xs text-dark-400">{product.rating}</span>
                      <span className="text-xs text-dark-400">({product.sold} مبيع)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-black text-gold-400">{formatDZD(product.price)}</div>
                        {product.compareAtPrice && (
                          <div className="text-xs text-dark-400 line-through">
                            {formatDZD(product.compareAtPrice)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-9 h-9 rounded-xl bg-gradient-to-l from-gold-400 to-royal-600 flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 bottom-0 w-full sm:w-96 glass z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  السلة ({cart.length})
                </h2>
                <button onClick={() => setShowCart(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-dark-400" />
                    <p className="text-dark-400">السلة فارغة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-white/5 rounded-xl">
                        <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                          <div className="text-gold-400 font-bold text-sm">{formatDZD(item.price)}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="mr-auto text-red-400 text-xs"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="كود الخصم"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
                    />
                    <Button size="sm" onClick={applyCoupon}>تطبيق</Button>
                  </div>
                  {appliedCoupon && (
                    <div className="text-xs text-green-400">
                      ✓ تم تطبيق الخصم: {appliedCoupon.discount}{appliedCoupon.type === "percentage" ? "%" : " د.ج"}
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-dark-400">المجموع</span>
                    <span className="font-bold">{formatDZD(cartTotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-400">
                      <span>الخصم</span>
                      <span>-{formatDZD(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black">
                    <span>الإجمالي</span>
                    <span className="text-gold-400">{formatDZD(finalTotal)}</span>
                  </div>
                  <Button onClick={() => setShowCheckout(true)} className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                    إتمام الطلب
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        total={finalTotal}
        store={store}
        coupon={appliedCoupon}
        onComplete={(orderData) => {
          const order = {
            id: genId(),
            storeId: store.id,
            productId: cart[0]?.id || "",
            productName: cart.map((i) => i.title).join("، "),
            customerName: orderData.name,
            customerPhone: orderData.phone,
            wilaya: orderData.wilaya,
            commune: orderData.commune,
            address: orderData.address,
            quantity: cart.reduce((s, i) => s + i.quantity, 0),
            total: finalTotal,
            shippingFee: orderData.shippingFee,
            status: "pending" as const,
            coupon: appliedCoupon?.code,
            createdAt: Date.now(),
          };
          addOrder(order);
          setCart([]);
          setShowCheckout(false);
          setShowCart(false);
          orderViaWhatsApp();
          alert("تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.");
        }}
      />

      {/* Product Detail Modal */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct?.title || ""} size="lg">
        {selectedProduct && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/5">
              <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                <span>{selectedProduct.rating}</span>
                <span className="text-dark-400">({selectedProduct.sold} مبيع)</span>
              </div>
              <h2 className="text-2xl font-black mb-2">{selectedProduct.title}</h2>
              <p className="text-dark-300 mb-4">{selectedProduct.shortDescription}</p>
              <div className="text-3xl font-black text-gold-400 mb-6">{formatDZD(selectedProduct.price)}</div>
              <div className="prose prose-sm max-w-none text-dark-300 mb-6 whitespace-pre-line">
                {selectedProduct.description}
              </div>
              <Button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full" icon={<ShoppingCart className="w-4 h-4" />}>
                إضافة للسلة
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${store.whatsapp}`}
        target="_blank"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/30 hover:scale-110 transition-transform z-30"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}

function CheckoutModal({ open, onClose, cart, total, store, coupon, onComplete }: any) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    wilaya: "",
    commune: "",
    address: "",
    shippingType: "desk" as "desk" | "home",
  });
  const [submitting, setSubmitting] = useState(false);

  const zone = SHIPPING_ZONES.find((z) => z.wilaya === form.wilaya);
  const shippingFee = zone ? (form.shippingType === "home" ? zone.feeHome : zone.fee) : 0;
  const grandTotal = total + shippingFee;

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.wilaya || !form.commune) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    onComplete({ ...form, shippingFee });
    setSubmitting(false);
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="إتمام الطلب">
      <div className="space-y-4">
        <Input
          label="الاسم الكامل *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="مثال: أحمد محمد"
        />
        <Input
          label="رقم الهاتف *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="0555 55 55 55"
        />
        <Select
          label="الولاية *"
          value={form.wilaya}
          onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
          options={[{ value: "", label: "اختر الولاية" }, ...ALGERIAN_WILAYAS.map((w) => ({ value: w, label: w }))]}
        />
        <Input
          label="البلدية *"
          value={form.commune}
          onChange={(e) => setForm({ ...form, commune: e.target.value })}
          placeholder="اسم البلدية"
        />
        <Input
          label="العنوان"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="الشارع، الحي..."
        />
        <div>
          <label className="block text-sm font-semibold mb-2">طريقة التوصيل</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setForm({ ...form, shippingType: "desk" })}
              className={`p-3 rounded-xl border-2 transition-all ${
                form.shippingType === "desk" ? "border-gold-400 bg-gold-400/5" : "border-white/10"
              }`}
            >
              <div className="font-bold text-sm">مكتب الشحن</div>
              <div className="text-xs text-gold-400">{zone ? formatDZD(zone.fee) : "—"}</div>
            </button>
            <button
              onClick={() => setForm({ ...form, shippingType: "home" })}
              className={`p-3 rounded-xl border-2 transition-all ${
                form.shippingType === "home" ? "border-gold-400 bg-gold-400/5" : "border-white/10"
              }`}
            >
              <div className="font-bold text-sm">حتى المنزل</div>
              <div className="text-xs text-gold-400">{zone ? formatDZD(zone.feeHome) : "—"}</div>
            </button>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-xl space-y-2 text-sm">
          <div className="flex justify-between">
            <span>المنتجات</span>
            <span>{formatDZD(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>الشحن</span>
            <span>{formatDZD(shippingFee)}</span>
          </div>
          {coupon && (
            <div className="flex justify-between text-green-400">
              <span>الخصم</span>
              <span>-{coupon.discount}{coupon.type === "percentage" ? "%" : " د.ج"}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-black pt-2 border-t border-white/10">
            <span>الإجمالي</span>
            <span className="text-gold-400">{formatDZD(grandTotal)}</span>
          </div>
        </div>

        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm">
          <MessageCircle className="w-4 h-4 text-green-400 inline-block ml-1" />
          سيتم إرسال الطلب تلقائياً للمتجر عبر واتساب
        </div>

        <Button onClick={handleSubmit} isLoading={submitting} className="w-full">
          تأكيد الطلب عبر واتساب
        </Button>
      </div>
    </Modal>
  );
}

export function DemoStorePage() {
  const { stores, products, addProduct, createStore } = useStore();
  
  useEffect(() => {
    if (!stores.find((s) => s.slug === "demo")) {
      createStore({
        id: "demo-store",
        ownerId: "demo",
        name: "متجري التجريبي",
        slug: "demo",
        description: "متجر تجريبي لعرض مميزات منصة متجري - اكتشف تجربة تسوق احترافية",
        whatsapp: "213555555555",
        wilaya: "الجزائر",
        theme: "luxury",
        primaryColor: "#D4AF37",
        accentColor: "#8B5CF6",
        category: "إلكترونيات",
        status: "active",
        plan: "pro",
        createdAt: Date.now(),
        social: {},
        views: 0,
        orders: 0,
      });
      
      const demoProducts = [
        { title: "ساعة ذكية فاخرة", price: 8500, category: "إلكترونيات" },
        { title: "سماعات بلوتوث لاسلكية", price: 3500, category: "إلكترونيات" },
        { title: "حقيبة جلد طبيعي", price: 5000, category: "ملابس" },
        { title: "عطر فاخر 100 مل", price: 4500, category: "عطور" },
        { title: "حذاء رياضي عصري", price: 6500, category: "أحذية" },
        { title: "نظارة شمسية أنيقة", price: 2500, category: "ملابس" },
        { title: "سوار ذهبي فاخر", price: 7500, category: "مجوهرات" },
        { title: "قميص كلاسيكي", price: 2800, category: "ملابس" },
      ];
      
      demoProducts.forEach((p) => {
        addProduct({
          id: genId(),
          storeId: "demo-store",
          title: p.title,
          description: `${p.title} - منتج عالي الجودة بتصميم أنيق وفاخر. مثالي لجميع المناسبات ويمنحك تجربة استثنائية. جودة عالية وضمان الأصالة.`,
          shortDescription: `${p.title} بجودة عالية`,
          price: p.price,
          compareAtPrice: Math.round(p.price * 1.3),
          images: [`https://picsum.photos/seed/${p.title}/600/600`],
          category: p.category,
          tags: ["جديد", "مميز"],
          stock: 50,
          featured: Math.random() > 0.5,
          rating: 4.5 + Math.random() * 0.5,
          sold: Math.floor(Math.random() * 200),
          createdAt: Date.now(),
        });
      });
    }
  }, []);
  
  return <StorefrontPage forceSlug="demo" />;
}
