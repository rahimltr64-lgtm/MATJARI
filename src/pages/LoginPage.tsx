import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock, Sparkles, User, Shield } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Form";
import { useStore, genId } from "../store";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    login({
      id: genId(),
      name: form.name || form.email.split("@")[0],
      email: form.email,
      phone: form.phone,
      role: "merchant",
      createdAt: Date.now(),
    });
    setLoading(false);
    navigate("/dashboard");
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login({
      id: "admin-1",
      name: "مدير المنصة",
      email: "admin@matjari.dz",
      phone: "0555555555",
      role: "admin",
      createdAt: Date.now(),
    });
    setLoading(false);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-royal-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-l from-gold-400 to-royal-600 items-center justify-center mb-4 shadow-lg shadow-gold-400/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">
              {mode === "login" ? "مرحباً بعودتك" : "إنشاء حساب جديد"}
            </h1>
            <p className="text-dark-400">
              {mode === "login" ? "سجّل دخولك لمتابعة إدارة متجرك" : "ابدأ رحلتك معنا اليوم"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <Input
                  label="الاسم الكامل"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: أحمد بوعلام"
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  label="رقم الهاتف"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0555 55 55 55"
                />
              </>
            )}
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="كلمة المرور"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" className="w-full" isLoading={loading} icon={<LogIn className="w-4 h-4" />}>
              {mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gold-400/5 border border-gold-400/20 rounded-xl">
            <button
              onClick={handleAdminLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-gold-400 hover:text-gold-300 font-bold transition-colors"
            >
              <Shield className="w-4 h-4" />
              دخول كمدير (تجريبي)
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-dark-400">
            {mode === "login" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-gold-400 hover:text-gold-300 font-bold"
            >
              {mode === "login" ? "إنشاء حساب" : "تسجيل الدخول"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-dark-400 hover:text-white">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
