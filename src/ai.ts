import type { Product } from "./types";

// AI Service - محاكاة للذكاء الاصطناعي
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
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const stylePrefixes = {
      luxury: "فاخر",
      youth: "شبابي",
      professional: "احترافي",
      marketing: "تسويقي",
    };

    const dialectSuffixes = {
      fusha: "",
      algerian: " - باللهجة الجزائرية",
    };

    const title = `${productName} ${stylePrefixes[style]} - جودة عالية`;
    
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
      "جودة عالية ومواد متينة",
      "تصميم عصري وأنيق",
      "سهولة الاستخدام",
      "ضمان الجودة",
      "توصيل سريع لجميع الولايات",
      "خدمة عملاء متميزة",
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

    return {
      title: title + dialectSuffixes[dialect],
      description: descriptions[style],
      shortDescription: shortDescriptions[style],
      features,
      cta: ctas[style],
      hashtags,
      seoKeywords,
    };
  }

  // تحسين صورة المنتج (محاكاة)
  static async enhanceProductImage(imageUrl: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // في الواقع، هنا يتم استدعاء API لتحسين الصورة
    return imageUrl;
  }

  // اقتراح سعر المنتج
  static async suggestProductPrice(
    productName: string,
    category: string
  ): Promise<{ min: number; max: number; recommended: number }> {
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
    return {
      min: base,
      max: base * 2,
      recommended: base * 1.3,
    };
  }

  // اقتراح كوبونات وعروض
  static async suggestPromotions(storeName: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return [
      "خصم 20% على الطلب الأول بكوبون WELCOME20",
      "شحن مجاني للطلبات فوق 5000 د.ج",
      "اشترِ 2 واحصل على الثالث مجاناً",
      "خصم 15% بمناسبة نهاية الموسم",
      "عرض خاص: خصم 30% على المنتجات المختارة",
      "كوبون VIP10 للعملاء المميزين",
    ];
  }
}

// Chatbot AI
export class ChatbotAI {
  private static responses: Record<string, string[]> = {
    greeting: [
      "مرحباً! كيف يمكنني مساعدتك اليوم؟",
      "أهلاً وسهلاً! أنا هنا لمساعدتك في إدارة متجرك.",
      "مرحباً! يسعدني مساعدتك في أي استفسار.",
    ],
    marketing: [
      "لتحسين التسويق، أنصحك بـ:\n1. استخدام صور احترافية للمنتجات\n2. كتابة وصف جذاب ومفصل\n3. تقديم عروض وكوبونات دورية\n4. التفاعل مع العملاء عبر واتساب\n5. الاستفادة من وسائل التواصل الاجتماعي",
      "نصيحة تسويقية: ركز على بناء علاقة مع عملائك من خلال خدمة ممتازة ومتابعة بعد البيع. هذا يخلق ولاءً ويزيد المبيعات على المدى الطويل.",
    ],
    sales: [
      "لزيادة المبيعات، جرّب:\n1. تحسين صور المنتجات\n2. إضافة تقييمات العملاء\n3. تقديم خصم على الكمية\n4. إنشاء عروض محدودة الوقت\n5. تحسين وصف المنتجات بالـ AI",
      "نصيحة: استخدم ميزة 'المنتجات المميزة' لعرض أفضل منتجاتك في الصفحة الرئيسية. هذا يزيد من فرص البيع بنسبة 40%.",
    ],
    product: [
      "يمكنني مساعدتك في إنشاء وصف احترافي للمنتج! فقط اذهب إلى صفحة 'إضافة منتج' واستخدم ميزة 'توليد بالذكاء الاصطناعي'.",
      "لتحسين منتجك، أنصحك بـ:\n1. استخدام صور عالية الجودة\n2. كتابة وصف مفصل\n3. تحديد سعر مناسب\n4. إضافة كلمات مفتاحية للـ SEO",
    ],
    order: [
      "يمكنك إدارة طلباتك من لوحة التحكم. تأكد من:\n1. تأكيد الطلبات بسرعة\n2. تحديث حالة الطلب باستمرار\n3. التواصل مع العميل عبر واتساب\n4. متابعة الشحن والتوصيل",
      "نصيحة: الرد السريع على الطلبات يزيد من رضا العملاء ويقلل من الإلغاءات.",
    ],
    default: [
      "سؤال جيد! يمكنني مساعدتك في:\n• التسويق والمبيعات\n• تحسين المنتجات\n• إدارة الطلبات\n• إنشاء كوبونات وعروض\n• نصائح عامة للتجارة الإلكترونية\n\nما الذي تريد معرفته بالتحديد؟",
      "أنا هنا لمساعدتك في أي شيء يتعلق بمتجرك. اسألني عن التسويق، المنتجات، الطلبات، أو أي نصيحة تحتاجها!",
    ],
  };

  static async getResponse(message: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const msg = message.toLowerCase();

    if (msg.includes("مرحب") || msg.includes("سلام") || msg.includes("هلا")) {
      return this.randomChoice(this.responses.greeting);
    }
    if (msg.includes("تسويق") || msg.includes("إعلان") || msg.includes("ترويج")) {
      return this.randomChoice(this.responses.marketing);
    }
    if (msg.includes("مبيعات") || msg.includes("بيع") || msg.includes("زيادة")) {
      return this.randomChoice(this.responses.sales);
    }
    if (msg.includes("منتج") || msg.includes("وصف") || msg.includes("صور")) {
      return this.randomChoice(this.responses.product);
    }
    if (msg.includes("طلب") || msg.includes("شحن") || msg.includes("توصيل")) {
      return this.randomChoice(this.responses.order);
    }

    return this.randomChoice(this.responses.default);
  }

  private static randomChoice(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
