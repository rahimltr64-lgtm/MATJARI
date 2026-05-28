import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Upload, CheckCircle2, Wallet, Sparkles, Copy, MessageCircle } from "lucide-react";
import { Button } from "../components/Button";
import { useStore, genId } from "../store";
import { PLANS } from "../data";
import { toast } from "sonner";

export function PaymentPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { stores, addSubscription, updateStore } = useStore();
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1].id);
  const [paymentMethod, setPaymentMethod] = useState<"baridimob" | "ccp">("baridimob");
  const [proofUploaded, setProofUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const store = stores.find((s) => s.id === storeId);
  const plan = PLANS.find((p) => p.id === selectedPlan)!;

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-dark-400">المتجر غير موجود</p>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("تم نسخ رقم الحساب");
  };

  const handleSubmit = async () => {
    if (!proofUploaded) {
      toast.error("الرجاء رفع إيصال الدفع أولاً");
      return;
    }
    
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    const activationCode = `MJ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    addSubscription({
      id: genId(),
      storeId: store.id,
      planId: plan.id,
      status: "active",
      activationCode,
      startsAt: Date.now(),
      endsAt: Date.now() + plan.duration * 24 * 60 * 60 * 1000,
      createdAt: Date.now(),
    });

    updateStore(store.id, {
      status: "active",
      plan: plan.id as any,
      activatedAt: Date.now(),
    });

    setSubmitting(false);
    toast.success(`🎉 تم تفعيل متجرك بنجاح! كود التفعيل: ${activationCode}`);
    setTimeout(() => navigate("/dashboard?welcome=1"), 1500);
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-4">
            <Wallet className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-bold text-gold-400">الخطوة الأخيرة</span>
          </div>
          <h1 className="text-4xl font-black mb-4">
            فعّل <span className="text-gradient-gold">اشتراكك</span>
          </h1>
          <p className="text-dark-400">اختر باقتك وأكمل الدفع لبدء البيع فوراً</p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Plan Selection */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-bold mb-2">اختر الباقة المناسبة</h3>
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`w-full text-right glass rounded-2xl p-6 transition-all border-2 ${
                  selectedPlan === p.id ? "border-gold-400" : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xl font-bold">{p.name}</h4>
                    <p className="text-sm text-dark-400">{p.duration} يوم</p>
                  </div>
                  <div className="text-3xl font-black text-gradient-gold">
                    {p.price} <span className="text-sm text-dark-400">د.ج</span>
                  </div>
                </div>
                {selectedPlan === p.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center gap-2 text-gold-400 text-sm font-bold mt-3">
                      <CheckCircle2 className="w-4 h-4" />
                      تم اختيار هذه الباقة
                    </div>
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          {/* Payment */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold-400" />
                طريقة الدفع
              </h3>

              <div className="space-y-2 mb-4">
                <button
                  onClick={() => setPaymentMethod("baridimob")}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "baridimob" ? "border-gold-400 bg-gold-400/5" : "border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-bold">بريدي موب</div>
                      <div className="text-xs text-dark-400">BaridiMob</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod("ccp")}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "ccp" ? "border-gold-400 bg-gold-400/5" : "border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-bold">CCP</div>
                      <div className="text-xs text-dark-400">الحساب الجاري</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="p-4 bg-white/5 rounded-xl mb-4">
                <p className="text-sm text-dark-400 mb-2">قم بالتحويل إلى:</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg tracking-wider">
                    {paymentMethod === "baridimob" ? "1234567890" : "00799999 00123456789"}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(paymentMethod === "baridimob" ? "1234567890" : "0079999900123456789")} 
                    className="text-gold-400 hover:text-gold-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-dark-400">
                  المبلغ: <span className="text-gold-400 font-bold">{plan.price} د.ج</span>
                </p>
              </div>

              <button
                onClick={() => setProofUploaded(true)}
                className={`w-full p-6 border-2 border-dashed rounded-xl transition-colors text-center ${
                  proofUploaded 
                    ? "border-green-400 bg-green-400/10" 
                    : "border-white/20 hover:border-gold-400"
                }`}
              >
                {proofUploaded ? (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">تم رفع إيصال التحويل</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-dark-400" />
                    <p className="font-bold">اضغط لرفع إيصال التحويل</p>
                    <p className="text-xs text-dark-400 mt-1">PNG, JPG حتى 5MB</p>
                  </div>
                )}
              </button>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={!proofUploaded}
              isLoading={submitting}
              icon={<Sparkles className="w-4 h-4" />}
            >
              تأكيد وتفعيل المتجر
            </Button>

            <div className="glass rounded-2xl p-4 border border-gold-400/20 bg-gold-400/5">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <p className="font-bold mb-1">بعد التأكيد:</p>
                  <p className="text-dark-300">سيتم مراجعة الدفع وإرسال كود التفعيل عبر واتساب خلال 10 دقائق.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
                  }
