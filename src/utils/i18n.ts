export type Language = "en" | "ar";

export const defaultLanguage: Language = "en";

export const isLanguage = (value: string | null): value is Language =>
  value === "en" || value === "ar";

export const translations = {
  en: {
    brandName: "Golden Energy",
    brandTagline: "Electrical Supply & Contracting",
    nav: {
      home: "Home",
      services: "Services",
      projects: "Projects",
      clients: "Clients",
      suppliers: "Suppliers",
      contact: "Contact",
      quote: "Get a Quote",
    },
    languageToggle: "العربية",
    languageLabel: "Switch language",
    hero: {
      subheading: "Reliable power. Smarter futures.",
      title: "Powering Projects With Precision",
      body: "Golden Energy delivers end-to-end electrical supply and contracting solutions with unmatched quality, safety, and efficiency.",
      projects: "Our Projects",
      contact: "Contact Us",
    },
    stats: {
      experience: "Years of Experience",
      completed: "Completed Projects",
      clients: "Trusted Clients",
      support: "Technical Support",
    },
    services: {
      title: "Comprehensive Electrical Solutions",
      items: [
        {
          title: "Electrical Supply",
          body: "Providing high-quality electrical equipment and materials from trusted manufacturers.",
        },
        {
          title: "Electrical Network Design",
          body: "Advanced network design and load analysis for reliable and efficient power distribution.",
        },
        {
          title: "Installation & Commissioning",
          body: "Professional installation and commissioning of electrical systems with precision and safety.",
        },
        {
          title: "Maintenance & Support",
          body: "Preventive and corrective maintenance to ensure continuous performance and minimal downtime.",
        },
        {
          title: "Low & Medium Voltage Solutions",
          body: "Safe and efficient LV & MV solutions for industrial, commercial, and infrastructure projects.",
        },
      ],
    },
    featuredProjects: {
      title: "Projects That Power Progress",
      viewAll: "View All Projects",
      items: [
        {
          title: "Medium voltage room",
          address: "Egypt, Lavanda Hurghada",
        },
        {
          title: "Medium voltage cables",
          address: "Egypt, Makadi Heights Hurghada",
        },
        {
          title: "Auto Transformer",
          address: "Egypt, Marsa Alam",
        },
      ],
    },
    clients: {
      title: "Trusted by Leading Clients",
      suppliers: "Our Suppliers & Partners",
    },
    contact: {
      title: "Let's Build a Powerful Future Together",
      details: "Call Us: +201555630515 | Email: goldenenergymm@gmail.com",
    },
    footer: {
      body: "Delivering reliable electrical solutions with quality, safety, and innovation.",
      quickLinks: "Quick Links",
      services: "Services",
      contactInfo: "Contact Info",
      location:
        "Sudan Street - Youth Graduates Building - Behind Reda Helmy - Ismailia",
      tradeRecord: "Tax Register: 27751",
      taxesCard: "Tax Card: 768-054-613",
      phoneNumber: "+201555630515",
      serviceItems: [
        "Electrical Supply",
        "Network Design",
        "Installation & Commissioning",
        "Maintenance & Support",
        "LV & MV Solutions",
      ],
    },
    projectsPage: {
      title: "Our Project History",
      subtitle:
        "A comprehensive record of Golden Energy's excellence in electrical supply and contracting.",
      loading: "Loading projects...",
      errorPrefix: "Error",
      empty: "No projects found.",
      backHome: "Back to Home",
      columns: {
        id: "No.",
        location: "Location",
        client: "Client",
        scope: "Scope of Work",
      },
    },
  },
  ar: {
    brandName: "جولدن إنرجي",
    brandTagline: "توريدات ومقاولات كهربائية",
    nav: {
      home: "الرئيسية",
      services: "الخدمات",
      projects: "المشروعات",
      clients: "العملاء",
      suppliers: "الموردون",
      contact: "تواصل معنا",
      quote: "طلب عرض سعر",
    },
    languageToggle: "English",
    languageLabel: "تغيير اللغة",
    hero: {
      subheading: "طاقة موثوقة. مستقبل أكثر ذكاء.",
      title: "تنفيذ المشروعات الكهربائية بدقة",
      body: "تقدم جولدن إنرجي حلول التوريد والمقاولات الكهربائية المتكاملة بجودة عالية ومعايير أمان وكفاءة موثوقة.",
      projects: "مشروعاتنا",
      contact: "تواصل معنا",
    },
    stats: {
      experience: "سنوات خبرة",
      completed: "مشروع مكتمل",
      clients: "عميل موثوق",
      support: "دعم فني",
    },
    services: {
      title: "حلول كهربائية متكاملة",
      items: [
        {
          title: "التوريدات الكهربائية",
          body: "توريد معدات وخامات كهربائية عالية الجودة من مصنعين موثوقين.",
        },
        {
          title: "تصميم الشبكات الكهربائية",
          body: "تصميم شبكات وتحليل أحمال لتوزيع طاقة موثوق وفعال.",
        },
        {
          title: "التركيب والتشغيل",
          body: "تركيب وتشغيل الأنظمة الكهربائية باحترافية ودقة ومعايير أمان.",
        },
        {
          title: "الصيانة والدعم",
          body: "صيانة وقائية وتصحيحية لضمان استمرارية الأداء وتقليل الأعطال.",
        },
        {
          title: "حلول الجهد المنخفض والمتوسط",
          body: "حلول آمنة وفعالة للجهد المنخفض والمتوسط للمشروعات الصناعية والتجارية والبنية التحتية.",
        },
      ],
    },
    featuredProjects: {
      title: "مشروعات تدعم التقدم",
      viewAll: "عرض كل المشروعات",
      items: [
        {
          title: "غرفة جهد متوسط",
          address: "مصر، لافاندا الغردقة",
        },
        {
          title: "كابلات جهد متوسط",
          address: "مصر، مكادي هايتس الغردقة",
        },
        {
          title: "محول ذاتي",
          address: "مصر، مرسى علم",
        },
      ],
    },
    clients: {
      title: "يثق بنا عملاء رائدون",
      suppliers: "موردونا وشركاؤنا",
    },
    contact: {
      title: "لنبن مستقبلًا أقوى معًا",
      details: "اتصل بنا: +201555630515 | البريد: goldenenergymm@gmail.com",
    },
    footer: {
      body: "نقدم حلولًا كهربائية موثوقة تجمع بين الجودة والأمان والابتكار.",
      quickLinks: "روابط سريعة",
      services: "الخدمات",
      contactInfo: "بيانات التواصل",
      location:
        " شارع السودان - عمارة الشباب الخريجين - خلف رضا حلمي - الإسماعيلية",
      tradeRecord: "السجل الضريبي: 27751",
      taxesCard: "البطاقة الضريبية: 768-054-613",
      phoneNumber: "201555630515+",
      serviceItems: [
        "التوريدات الكهربائية",
        "تصميم الشبكات",
        "التركيب والتشغيل",
        "الصيانة والدعم",
        "حلول الجهد المنخفض والمتوسط",
      ],
    },
    projectsPage: {
      title: "سجل مشروعاتنا",
      subtitle:
        "سجل شامل لخبرة جولدن إنرجي في التوريدات والمقاولات الكهربائية.",
      loading: "جاري تحميل المشروعات...",
      errorPrefix: "خطأ",
      empty: "لا توجد مشروعات.",
      backHome: "العودة للرئيسية",
      columns: {
        id: "م",
        location: "الموقع",
        client: "قائمة الشركات",
        scope: "بيان الأعمال",
      },
    },
  },
} as const;
