import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Home, 
  FileCheck, 
  UserCheck, 
  PhoneCall, 
  Shield 
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { t, settings } = useApp();

  const benefits = [
    {
      icon: MapPin,
      title: t.multiLocationsTitle,
      desc: t.multiLocationsDesc,
    },
    {
      icon: Home,
      title: t.houseFocusTitle,
      desc: t.houseFocusDesc,
    },
    {
      icon: FileCheck,
      title: t.registryTitle,
      desc: t.registryDesc,
    },
    {
      icon: UserCheck,
      title: t.directAssistTitle,
      desc: `${t.directAssistDesc} (+91 9718526796)`,
    },
    {
      icon: PhoneCall,
      title: t.easyEnquiryTitle,
      desc: t.easyEnquiryDesc,
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Trust & Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.whyChooseTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3">
            {t.whyChooseSub}
          </p>
        </div>

        {/* 5 Factual Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-400/80 hover:bg-amber-50/20 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-700 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Consultant Profile Card */}
          <div className="p-6 rounded-2xl bg-stone-900 text-white border border-stone-800 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-2">
                Direct Contact
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {settings.ownerName}
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                {settings.role} • {settings.brandName}
              </p>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Get straightforward, honest plot guidance for Darbhanga, Madhubani, Pandaul & Jhanjharpur directly with no middlemen.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-800 text-xs text-amber-300 font-semibold flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>+91 9718526796</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
