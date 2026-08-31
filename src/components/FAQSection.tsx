import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { t, language } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qEn: "Which locations are available?",
      aEn: "Darbhanga, Madhubani, Pandaul and Jhanjharpur.",
      qHi: "कौन से स्थान उपलब्ध हैं?",
      aHi: "दरभंगा, मधुबनी, सकरी/पंडौल और झंझारपुर।"
    },
    {
      qEn: "What type of property is available?",
      aEn: "Residential plots suitable for house building.",
      qHi: "किस प्रकार की प्रॉपर्टी उपलब्ध है?",
      aHi: "घर बनाने के लिए उपयुक्त आवासीय प्लॉट।"
    },
    {
      qEn: "Can I visit the property?",
      aEn: "Yes. You can request a site visit through the website or WhatsApp directly with Satya Yadav.",
      qHi: "क्या मैं मौके पर जाकर प्लॉट देख सकता हूँ?",
      aHi: "हाँ। आप वेबसाइट या व्हाट्सएप के माध्यम से सीधे सत्य यादव से साइट विजिट का समय बुक कर सकते हैं।"
    },
    {
      qEn: "Can I get directions?",
      aEn: "Yes. Each property listing includes an interactive Google Maps 'Get Directions' option.",
      qHi: "क्या मुझे मैप पर रास्ता मिल सकता है?",
      aHi: "हाँ। प्रत्येक प्रॉपर्टी में गूगल मैप्स (Google Maps) 'रास्ता देखें' बटन उपलब्ध है।"
    },
    {
      qEn: "Can property details change?",
      aEn: "Yes. Please confirm the latest price, availability and specifications with Smriti Vihar before making a purchase decision.",
      qHi: "क्या प्रॉपर्टी के विवरण में बदलाव हो सकता है?",
      aHi: "हाँ। कृपया किसी भी खरीद निर्णय से पहले स्मृति विहार से नवीनतम दर, उपलब्धता और विवरण की पुष्टि करें।"
    },
    {
      qEn: "Are registry documents available?",
      aEn: "Registry is available for the listed properties; buyers should verify documents before completing a transaction.",
      qHi: "क्या रजिस्ट्री दस्तावेज उपलब्ध हैं?",
      aHi: "सूचीबद्ध संपत्तियों के लिए रजिस्ट्री दस्तावेज उपलब्ध हैं; खरीदार लेनदेन से पूर्व दस्तावेजों की पुष्टि अवश्य करें।"
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Clear Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.faqHeading}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const question = language === 'hi' ? faq.qHi : faq.qEn;
            const answer = language === 'hi' ? faq.aHi : faq.aEn;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isOpen 
                    ? 'bg-stone-50/90 border-amber-300 shadow-sm' 
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-stone-900 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    <p>{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
