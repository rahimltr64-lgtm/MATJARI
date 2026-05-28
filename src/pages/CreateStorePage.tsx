import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, Store, User, Phone, Mail, Check, Sparkles,
  Palette, Image, Upload, ShoppingBag
} from "lucide-react";
import { Button } from "../components/Button";
import { Input, Select } from "../components/Form";
import { useStore, genId } from "../store";
import { ALGERIAN_WILAYAS, STORE_THEMES, PRODUCT_CATEGORIES } from "../data";
import type { Store as StoreType } from "../types";

const steps = [
  { id: 1, title: "بيانات الحساب", icon: User },
  { id: 2, title: "معلومات المتجر", icon: Store },
  { id: 3, title: "التصميم", icon: Palette },
  { id: 4, title: "تأكيد", icon: Check },
];

export function CreateStorePage() {
  const navigate = useNavigate();
  const { createStore, register } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    storeName: "",
    description: "",
    whatsapp: "",
    wilaya: "",
    category: "",
    theme: "luxury" as const,
    primaryColor: "#D4AF37",
    accentColor: "#8B5CF6",
  });

  const updateField = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCreate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const userId = genId();
    const storeId = genId();
    const slug = formData.storeName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const user = {
      id: userId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: "merchant" as const,
      createdAt: Date.now(),
    };

    const store: StoreType = {
      id: storeId,
      ownerId: userId,
      name: formData.storeName,
      slug,
      description: formData.description,
      whatsapp: formData.whatsapp,
      wilaya: formData.wilaya,
      theme: formData.theme,
      primaryColor: formData.primaryColor,
      accentColor: formData.accentColor,
      category: formData.category,
      status: "pending",
      plan: "starter",
      createdAt: Date.now(),
      social: {},
      views: 0,
      orders: 0,
    };

    register(user);
    createStore(store);
    setLoading(false);
    navigate("/payment/" + storeId);
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-royal-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-4">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-bold text-gold-400">خطوة بخطوة نحو نجاحك</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            أنشئ <span className="text-gradient-gold">متجرك</span> الآن
          </h1>
          <p className="text-dark-400">أكمل البيانات لإنشاء متجرك خلال دقائق</p>
        </motion.div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-6 right-0 left-0 h-0.5 bg-white/10" />
          <div
            className="absolute top-6 right-0 h-0.5 bg-gradient-to-l from-gold-400 to-royal-600 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  scale: currentStep >= step.id ? 1.1 : 1,
                  background: currentStep >= step.id
                    ? "linear-gradient(135deg, #D4AF37, #8B5CF6)"
                    : "rgba(255,255,255,0.05)",
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/10 z-10"
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </motion.div>
              <span className="text-xs font-bold hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-8"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">بيانات الحساب</h2>
                <Input
                  label="الاسم الكامل"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="مثال: أحمد بوعلام"
                />
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="example@email.com"
                />
                <Input
                  label="رقم الهاتف"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="0555 55 55 55"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">معلومات المتجر</h2>
                <Input
                  label="اسم المتجر"
                  value={formData.storeName}
                  onChange={(e) => updateField("storeName", e.target.value)}
                  placeholder="مثال: بوتيك الأناقة"
                />
                <Input
                  label="وصف المتجر"
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="اكتب وصفاً جذاباً لمتجرك"
                />
                <Input
                  label="رقم واتساب لاستقبال الطلبات"
                  value={formData.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  placeholder="213XXXXXXXXX"
                />
                <Select
                  label="الولاية"
                  value={formData.wilaya}
                  onChange={(e) => updateField("wilaya", e.target.value)}
                  options={[
                    { value: "", label: "اختر الولاية" },
                    ...ALGERIAN_WILAYAS.map((w) => ({ value: w, label: w }))
                  ]}
                />
                <Select
                  label="تصنيف المتجر"
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  options={[
                    { value: "", label: "اختر التصنيف" },
                    ...PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))
                  ]}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">تصميم المتجر</h2>
                <div>
                  <label className="block text-sm font-semibold mb-4">اختر الثيم</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STORE_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => updateField("theme", theme.id)}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                          formData.theme === theme.id
                            ? "border-gold-400 ring-4 ring-gold-400/20"
                            : "border-white/10"
                        }`}
                        style={{ background: theme.preview }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur p-2">
                          <span className="text-sm font-bold text-white">{theme.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">اللون الرئيسي</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => updateField("primaryColor", e.target.value)}
                        className="w-12 h-12 rounded-xl cursor-pointer"
                      />
                      <span className="text-sm text-dark-400">{formData.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">اللون الثانوي</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => updateField("accentColor", e.target.value)}
                        className="w-12 h-12 rounded-xl cursor-pointer"
                      />
                      <span className="text-sm text-dark-400">{formData.accentColor}</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-white/10">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Image className="w-4 h-4 text-gold-400" />
                    معاينة المتجر
                  </h4>
                  <div
                    className="rounded-xl p-6 h-40 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.accentColor})`,
                    }}
                  >
                    <div className="text-center text-white">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-2" />
                      <h3 className="text-2xl font-black">{formData.storeName || "متجري"}</h3>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">مراجعة البيانات</h2>
                <div className="space-y-3">
                  {[
                    { label: "الاسم", value: formData.name },
                    { label: "البريد", value: formData.email },
                    { label: "الهاتف", value: formData.phone },
                    { label: "اسم المتجر", value: formData.storeName },
                    { label: "الولاية", value: formData.wilaya },
                    { label: "التصنيف", value: formData.category },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <span className="text-dark-400">{item.label}</span>
                      <span className="font-bold">{item.value || "—"}</span>
                    </div>
                  ))}
                </div>

                <div className="glass rounded-2xl p-6 border border-gold-400/30 bg-gold-400/5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-2">جاهز للانطلاق! 🚀</h4>
                      <p className="text-sm text-dark-300">
                        بعد تأكيد المتجر، سيتم توجيهك لصفحة الدفع لتفعيل اشتراكك وبدء البيع.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              السابق
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} icon={<ArrowLeft className="w-4 h-4" />}>
                التالي
              </Button>
            ) : (
              <Button onClick={handleCreate} isLoading={loading} icon={<Sparkles className="w-4 h-4" />}>
                إنشاء المتجر
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
