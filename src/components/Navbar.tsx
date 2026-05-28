import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Sun, ShoppingBag, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useStore } from "../store";
import { Button } from "./Button";

export function Navbar() {
  const { theme, toggleTheme, currentUser, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-l from-gold-400 to-royal-600 flex items-center justify-center shadow-lg shadow-gold-400/30 group-hover:shadow-gold-400/50 transition-all">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gradient-gold">متجري</h1>
              <p className="text-[10px] text-dark-400 -mt-1">Matjari Platform</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-semibold transition-colors ${location.pathname === "/" ? "text-gold-400" : "text-dark-300 hover:text-gold-400"}`}>
              الرئيسية
            </Link>
            <Link to="/#features" className="text-sm font-semibold text-dark-300 hover:text-gold-400 transition-colors">
              المميزات
            </Link>
            <Link to="/#pricing" className="text-sm font-semibold text-dark-300 hover:text-gold-400 transition-colors">
              الأسعار
            </Link>
            <Link to="/#faq" className="text-sm font-semibold text-dark-300 hover:text-gold-400 transition-colors">
              الأسئلة الشائعة
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.role === "admin" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate("/admin")}
                    icon={<Shield className="w-4 h-4" />}
                  >
                    الإدارة
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  icon={<LayoutDashboard className="w-4 h-4" />}
                >
                  لوحة التحكم
                </Button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  دخول
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/create")}
                >
                  ابدأ الآن
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-dark-950/50 backdrop-blur-xl mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gold-400/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-l from-gold-400 to-royal-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gradient-gold">متجري</h3>
                <p className="text-xs text-dark-400">Matjari Platform</p>
              </div>
            </div>
            <p className="text-dark-400 max-w-md">
              منصة إنشاء المتاجر الإلكترونية الأسرع والأكثر احترافية في الجزائر والوطن العربي.
              ابدأ متجرك الآن وحقّق أحلامك التجارية!
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-4">المنصة</h4>
            <ul className="space-y-2 text-dark-400">
              <li><Link to="/#features" className="hover:text-gold-400 transition-colors">المميزات</Link></li>
              <li><Link to="/#pricing" className="hover:text-gold-400 transition-colors">الأسعار</Link></li>
              <li><Link to="/create" className="hover:text-gold-400 transition-colors">إنشاء متجر</Link></li>
              <li><Link to="/#faq" className="hover:text-gold-400 transition-colors">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-4">قانوني</h4>
            <ul className="space-y-2 text-dark-400">
              <li><a href="#" className="hover:text-gold-400 transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">اتفاقية التاجر</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">الدعم الفني</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-400 text-sm">
            © 2026 متجري. جميع الحقوق محفوظة. صُنع بـ ❤️ في الجزائر
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gold-400/20 flex items-center justify-center transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gold-400/20 flex items-center justify-center transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
