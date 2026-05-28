import type { Product } from "./types";

// AI Service - محاكاة للذكاء الاصطناعي (يمكن استبدالها بـ OpenAI API لاحقاً)
export class AIService {
  // توليد وصف المنتج
  static async generateProductDescription(
    productName: string,
    style: "luxury" | "youth" | "professional" | "marketing" = "marketing",
    dialect: "fusha" | "algerian" = "fusha"
  ): Promise<{
    title: string;
    description: string;
    shortDescription: string;
    features: string[];
    cta: string;
    hashtags: string[];
    seoKeywords: string[];
  }> {
    // محاكاة زمن المعالجة
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const stylePrefixes = {
      luxury: "فاخر",
      youth: "شبابي",
      professional: "احترافي",
      marketing: "تسويقي",
    };

    const descriptions = {
      luxury: `اكتشف الفخامة الحقيقية مع ${productName}. مصنوع بعناية فائقة من أجود الخامات ليقدم لك تجربة استثنائية لا تُنسى. تصميم أنيق يجمع بين الأناقة والعملية، مثالي لمن يبحث عن التميز والرفاهية.`,
      youth: `${productName} - الاختيار الأمثل لجيل اليوم! تصميم عصري وأنيق يعكس شخصيتك المميزة. خفيف، عملي، ومناسب لجميع المناسبات. اطلبه الآن وكن مختلفاً!`,
      professional: `${productName} - الحل الأمثل للمحترفين. مواصفات تقنية متقدمة، أداء موثوق، وجودة لا تُضاهى. صُمم خصيصاً لتلبية احتياجات العمل بكفاءة عالية.`,
      marketing: `🔥 ${productName} - العرض الأكثر طلباً! لا تفوت فرصة الحصول عليه بسعر استثنائي. جودة عالية، سعر منافس، وتوصيل سريع لجميع الولايات. اطلب الآن قبل نفاد الكمية!`,
    };

    const shortDescriptions = {
      luxury: `${productName} الفاخر - جودة استثنائية وتصميم أنيق`,
      youth: `${productName} - عصري، أنيق، ومميز`,
      professional: `${productName} الاحترافي - أداء موثوق وجودة عالية`,
      marketing: `${productName} - العرض الأفضل بسعر لا يُقاوم!`,
    };

    const features = [
      "✓ جودة عالية ومواد متينة",
      "✓ تصميم عصري وأنيق",
      "✓ سهولة الاستخدام",
      "✓ ضمان الجودة",
      "✓ توصيل سريع لجميع الولايات",
      "✓ خدمة عملاء متميزة",
    ];

    const ctas = {
      luxury: "اطلب الآن واستمتع بالفخامة",
      youth: "اطلب الآن وكن مختلفاً",
      professional: "اطلب الآن وارتقِ بأدائك",
      marketing: "🔥 اطلب الآن - العرض لفترة محدودة!",
    };

    const hashtags = [
      `#${productName.replace(/\s+/g, "")}`,
      "#متجري",
      "#تسوق_أونلاين",
      "#الجزائر",
      "#جودة_عالية",
      "#توصيل_سريع",
      "#عروض_خاصة",
    ];

    const seoKeywords = [
      productName,
      `${productName} الجزائر`,
      `شراء ${productName}`,
      `${productName} أونلاين`,
      `أفضل ${productName}`,
      `${productName} بسعر`,
    ];

    const dialectSuffix = dialect === "algerian" ? " - باللهجة الجزائرية" : "";
    const dialectPrefix = dialect === "algerian" ? "⚠️ هاد الوصف بالدارجة الجزائرية:\n\n" : "";

    return {
      title: stylePrefixes[style] + " " + productName + dialectSuffix,
      description: dialectPrefix + descriptions[style],
      shortDescription: shortDescriptions[style] + dialectSuffix,
      features,
      cta: ctas[style],
      hashtags,
      seoKeywords,
    };
  }

  // تحسين صورة المنتج (محاكاة - يمكن ربطها بـ API حقيقي)
  static async enhanceProductImage(imageUrl: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // في الإصدار الحقيقي: استدعاء API لتحسين الصورة (مثل remove.bg أو replicate)
    return imageUrl;
  }

  // اقتراح سعر المنتج
  static async suggestProductPrice(
    productName: string,
    category: string
  ): Promise<{ min: number; max: number; recommended: number; reasoning: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const basePrices: Record<string, number> = {
      "إلكترونيات": 5000,
      "ملابس": 3000,
      "عطور": 4000,
      "مستحضرات تجميل": 2500,
      "أحذية": 3500,
      "مجوهرات": 8000,
    };

    const base = basePrices[category] || 3000;
    
    const reasoningMap: Record<string, string> = {
      "إلكترونيات": "بناءً على تحليل أسعار السوق المحلي للإلكترونيات في الجزائر",
      "ملابس": "حسب متوسط أسعار الملابس في المتاجر المشابهة",
      "عطور": "مقارنة بأسعار العطور الأصلية في السوق الجزائري",
      default: "اقتراح سعر بناءً على تحليل ذكي للسوق",
    };

    return {
      min: Math.round(base * 0.8),
      max: Math.round(base * 2),
      recommended: Math.round(base * 1.3),
      reasoning: reasoningMap[category] || reasoningMap.default,
    };
  }

  // اقتراح كوبونات وعروض
  static async suggestPromotions(storeName: string, category?: string): Promise<{
    coupons: string[];
    seasonal: string[];
    tips: string[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const season = new Date().getMonth();
    const isSummer = season >= 5 && season <= 8;
    
    return {
      coupons: [
        "خصم 20% على الطلب الأول بكوبون WELCOME20",
        "شحن مجاني للطلبات فوق 5000 د.ج",
        "اشترِ 2 واحصل على الثالث مجاناً",
        `خصم 15% بمناسبة ${isSummer ? "العطلة الصيفية" : "نهاية الموسم"}`,
        "عرض خاص: خصم 30% على المنتجات المختارة",
        "كوبون VIP10 للعملاء المميزين",
      ],
      seasonal: isSummer ? [
        "☀️ عرض الصيف: خصم 25% على المنتجات الصيفية",
        "🏖️ توصيل مجاني للطلبات فوق 3000 د.ج",
      ] : [
        "❄️ عرض الشتاء: خصم 20% على الملابس الشتوية",
        "🎁 هدية مجانية مع كل طلب بقيمة 4000 د.ج",
      ],
      tips: [
        "أضف صوراً عالية الجودة للمنتجات لزيادة المبيعات بنسبة 40%",
        "استخدم كوبونات الخصم لتحفيز العملاء على الشراء",
        "تفاعل مع العملاء عبر واتساب خلال 5 دقائق من استلام الطلب",
      ],
    };
  }
}

// Chatbot AI - مساعد ذكي
export class ChatbotAI {
  private static responses: Record<string, string[]> = {
    greeting: [
      "مرحباً! 👋 كيف يمكنني مساعدتك اليوم في إدارة متجرك؟",
      "أهلاً وسهلاً! 🌟 أنا هنا لمساعدتك في أي شيء يتعلق بمتجرك.",
      "مرحباً! 💫 يسعدني مساعدتك. اسألني عن التسويق، المنتجات، أو أي شيء آخر!",
    ],
    marketing: [
      "📢 **نصائح تسويقية ذكية:**\n\n1️⃣ استخدام صور احترافية للمنتجات\n2️⃣ كتابة وصف جذاب ومفصل (استخدم ميزة AI)\n3️⃣ تقديم عروض وكوبونات دورية\n4️⃣ التفاعل مع العملاء عبر واتساب\n5️⃣ الاستفادة من وسائل التواصل الاجتماعي\n\nهل تريد شرحاً مفصلاً لأي نقطة؟",
      "💡 **نصيحة ذهبية:**\nركز على بناء علاقة مع عملائك من خلال خدمة ممتازة ومتابعة بعد البيع. هذا يخلق ولاءً ويزيد المبيعات بنسبة تصل إلى 70%!",
    ],
    sales: [
      "🚀 **لزيادة مبيعاتك فوراً:**\n\n✓ حسّن صور المنتجات (جودة عالية + خلفيات بيضاء)\n✓ أضف تقييمات العملاء (تبني الثقة)\n✓ قدّم خصم على الكمية\n✓ أنشئ عروض محدودة الوقت\n✓ استخدم ميزة AI لتحسين الأوصاف\n\nجرب هذه النصائح وشاركني النتيجة!",
      "💰 **نصيحة استراتيجية:**\nاستخدم ميزة 'المنتجات المميزة' لعرض أفضل منتجاتك في الصفحة الرئيسية. هذا يزيد من فرص البيع بنسبة 40%!",
    ],
    product: [
      "✨ **تحسين المنتجات:**\n\nيمكنني مساعدتك في:\n1️⃣ إنشاء وصف احترافي باستخدام AI\n2️⃣ اقتراح سعر مناسب للمنتج\n3️⃣ تحسين صور المنتجات\n4️⃣ إضافة كلمات مفتاحية لـ SEO\n\nاذهب إلى 'إضافة منتج' وجرب ميزة التوليد الذكي!",
      "📸 **نصيحة للصور:**\nالصور عالية الجودة تزيد المبيعات بنسبة 60%. أضف 3-5 صور لكل منتج من زوايا مختلفة.",
    ],
    order: [
      "📦 **إدارة الطلبات باحترافية:**\n\n✓ أكّد الطلبات خلال ساعة من استلامها\n✓ حدّث حالة الطلب باستمرار\n✓ تواصل مع العميل عبر واتساب\n✓ أرسل رقم تتبع الشحن فوراً\n✓ اطلب تقييماً بعد التوصيل\n\nهل تريد مساعدة في أي خطوة؟",
      "⏰ **نصيحة مهمة:**\nالرد السريع على الطلبات (أقل من ساعة) يزيد من رضا العملاء ويقلل الإلغاءات بنسبة 80%.",
    ],
    pricing: [
      "💲 **تسعير المنتجات:**\n\nاستخدم معادلة:\n(تكلفة المنتج + هامش ربح 30-50% + تكاليف الشحن)\n\nأنا هنا لمساعدتك في تحديد السعر المناسب! فقط أخبرني بنوع المنتج.",
    ],
    shipping: [
      "🚚 **الشحن في الجزائر:**\n\nمنصتنا تدعم تلقائياً:\n• 58 ولاية جزائرية\n• أسعار شحن متفاوتة حسب المنطقة\n• خيارين: مكتب شحن أو حتى المنزل\n\nيمكنك تخصيص الأسعار من إعدادات الشحن.",
    ],
    default: [
      "🤖 **ماذا تريد أن تعرف؟**\n\nيمكنني مساعدتك في:\n• 📢 التسويق والمبيعات\n• ✨ تحسين المنتجات\n• 📦 إدارة الطلبات\n• 🎟️ كوبونات وعروض\n• 💲 تسعير المنتجات\n• 🚚 الشحن والتوصيل\n\nاكتب ما تريد وسأقدم لك أفضل النصائح!",
      "💫 **أنا هنا لخدمتك!**\nاسألني عن أي شيء يتعلق بمتجرك. يمكنني أيضاً توليد أفكار تسويقية، اقتراح أسعار، أو إعطائك نصائح لزيادة مبيعاتك.",
    ],
  };

  static async getResponse(message: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const msg = message.toLowerCase();

    if (msg.includes("مرحب") || msg.includes("سلام") || msg.includes("هلا") || msg.includes("اهلا")) {
      return this.randomChoice(this.responses.greeting);
    }
    if (msg.includes("تسويق") || msg.includes("إعلان") || msg.includes("ترويج") || msg.includes(" marketing")) {
      return this.randomChoice(this.responses.marketing);
    }
    if (msg.includes("مبيعات") || msg.includes("بيع") || msg.includes("زيادة") || msg.includes(" sales")) {
      return this.randomChoice(this.responses.sales);
    }
    if (msg.includes("منتج") || msg.includes("وصف") || msg.includes("صور") || msg.includes(" product")) {
      return this.randomChoice(this.responses.product);
    }
    if (msg.includes("طلب") || msg.includes("شحن") || msg.includes("توصيل") || msg.includes(" order")) {
      return this.randomChoice(this.responses.order);
    }
    if (msg.includes("سعر") || msg.includes("تسعير") || msg.includes("ربح") || msg.includes(" pricing")) {
      return this.randomChoice(this.responses.pricing);
    }
    if (msg.includes("ولاية") || msg.includes("توصيل") || msg.includes(" shipping")) {
      return this.randomChoice(this.responses.shipping);
    }

    return this.randomChoice(this.responses.default);
  }

  private static randomChoice(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

// دالة مساعدة لتنسيق الردود مع Markdown
export function formatAIResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-400">$1</strong>')
    .replace(/\n/g, '<br/>');
    }
