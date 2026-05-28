import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Sparkles, Store, MessageCircle, MapPin, LayoutDashboard,
  Package, Tag, BarChart3, Smartphone, Zap, CheckCircle, Star, ChevronDown,
  Shield, TrendingUp, Users, Rocket
} from "lucide-react";
import { Button } from "../components/Button";
import { GlassCard } from "../components/UI";
import { FEATURES, FAQ, TESTIMONIALS, PLANS } from "../data";

const iconMap: Record<string, any> = {
  Store, MessageCircle, MapPin, LayoutDashboard, Package, Tag, BarChart3, Smartphone, Zap
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-right hover:bg-white/5 transition-colors"
      >
        <span className="font-bold text-lg">{q}</span>
        <ChevronDown className={`w-5 h-5 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <p className="p-6 pt-0 text-dark-300 leading-relaxed">{a}</p>
      </motion.div>
    </motion.div>
  );
}

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-dark-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-400/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-royal-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-royal-400/5 rounded-full blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-8"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-bold text-gold-400">المنصة رقم 1 في الجزائر 🇩🇿</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-tight mb-6">
              <span className="block text-white">أنشئ متجرك</span>
              <span className="block text-gradient-gold">في دقائق</span>
              <span className="block text-white">وبع باحترافية</span>
            </h1>

            <p className="text-xl text-dark-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              منصة <span className="text-gold-400 font-bold">متجري</span> تمنحك كل ما تحتاجه لبناء متجر إلكتروني احترافي
              بالذكاء الاصطناعي، بدون أي خبرة تقنية. ابدأ الآن وحقّق أحلامك التجارية!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/create">
                <Button size="lg" icon={<Rocket className="w-5 h-5" />}>
                  ابدأ متجرك الآن مجاناً
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/demo-store">
                <Button variant="secondary" size="lg">
                  شاهد عرض تجريبي
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: "+5000", label: "متجر نشط", icon: Store },
                { value: "+50K", label: "منتج مباع", icon: Package },
                { value: "58", label: "ولاية", icon: MapPin },
                { value: "99.9%", label: "رضا العملاء", icon: Star },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <stat.icon className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                  <div className="text-3xl font-black text-gradient-gold">{stat.value}</div>
                  <div className="text-sm text-dark-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              كل ما تحتاجه <span className="text-gradient-gold">في منصة واحدة</span>
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              مميزات احترافية تجعل إدارة متجرك أسهل وأكثر فعالية من أي وقت مضى
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Sparkles;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard hover className="h-full group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-l from-gold-400 to-royal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-dark-400 leading-relaxed">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-8 md:p-16"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-gold-400/10 via-royal-600/10 to-dark-900" />
            <div className="absolute inset-0 glass" />
            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-600/20 border border-royal-500/30 mb-4">
                  <Sparkles className="w-4 h-4 text-royal-400" />
                  <span className="text-sm font-bold text-royal-400">مدعوم بالذكاء الاصطناعي</span>
                </div>
                <h2 className="text-4xl font-black mb-6">
                  قوة <span className="text-gradient-gold">AI</span> في يديك
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: Sparkles, text: "توليد وصف احترافي للمنتجات تلقائياً" },
                    { icon: TrendingUp, text: "اقتراحات ذكية لزيادة المبيعات" },
                    { icon: Users, text: "مساعد شخصي AI للإجابة على استفساراتك" },
                    { icon: Shield, text: "تحسين صور المنتجات وإزالة الخلفيات" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-gold-400" />
                      </div>
                      <span className="text-dark-200">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="glass rounded-2xl p-6 border border-gold-400/30 shadow-2xl shadow-gold-400/10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-dark-400 mr-2">AI Assistant</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-gold-400" />
                      </div>
                      <div className="flex-1 bg-white/5 rounded-2xl rounded-tr-none p-3 text-sm">
                        مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟
                      </div>
                    </div>
                    <div className="flex gap-2 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-royal-600 flex items-center justify-center text-white text-xs font-bold">
                        أ
                      </div>
                      <div className="flex-1 bg-royal-600/30 rounded-2xl rounded-tl-none p-3 text-sm">
                        أريد وصف احترافي لمنتج عطر
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-gold-400" />
                      </div>
                      <div className="flex-1 bg-white/5 rounded-2xl rounded-tr-none p-3 text-sm">
                        ✨ تم إنشاء وصف تسويقي احترافي لمنتجك مع هاشتاغات وكلمات SEO...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              باقات <span className="text-gradient-gold">تناسب الجميع</span>
            </h2>
            <p className="text-xl text-dark-400">اختر الباقة المناسبة لنشاطك التجاري</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-l from-gold-400 to-royal-600 text-white text-xs font-bold shadow-lg">
                      الأكثر شعبية ⭐
                    </div>
                  </div>
                )}
                <GlassCard className={`h-full ${plan.popular ? "border-gold-400/50 ring-2 ring-gold-400/30" : ""}`}>
                  <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-black text-gradient-gold">{plan.price}</span>
                    <span className="text-dark-400">د.ج / شهر</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                        <span className="text-dark-200 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/create">
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      className="w-full"
                    >
                      ابدأ الآن
                    </Button>
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              ماذا يقول <span className="text-gradient-gold">عملاؤنا</span>
            </h2>
            <p className="text-xl text-dark-400">قصص نجاح حقيقية من تجار مثلك</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover className="h-full">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-dark-200 mb-4 text-sm leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-l from-gold-400 to-royal-600 flex items-center justify-center text-white font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-xs text-dark-400">{t.role}</div>
                      <div className="text-xs text-gold-400">{t.location}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              الأسئلة <span className="text-gradient-gold">الشائعة</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-gold-400 to-royal-600" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)]" />
            <div className="relative">
              <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                جاهز لبدء رحلتك؟
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                انضم لآلاف التجار الناجحين وابدأ بيع منتجاتك خلال دقائق
              </p>
              <Link to="/create">
                <Button variant="secondary" size="lg">
                  أنشئ متجرك الآن - مجاناً
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
                          }
