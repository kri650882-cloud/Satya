import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Layers, CalendarCheck, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onExplore: () => void;
  onCompare: () => void;
  onVisit: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onExplore, onCompare, onVisit }) => {
  const { t } = useApp();

  const steps = [
    {
      step: t.step1Title,
      desc: t.step1Desc,
      icon: Compass,
      action: onExplore,
      btnText: t.exploreProperties,
    },
    {
      step: t.step2Title,
      desc: t.step2Desc,
      icon: Layers,
      action: onCompare,
      btnText: t.compare,
    },
    {
      step: t.step3Title,
      desc: t.step3Desc,
      icon: CalendarCheck,
      action: onVisit,
      btnText: t.bookSiteVisit,
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-stone-900 text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-2">
            {t.howItWorksHeading}
          </h2>
          <p className="text-sm sm:text-base text-stone-400 mt-2">
            From discovering suitable locations to standing on your future plot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-stone-800/90 rounded-2xl p-6 sm:p-7 border border-stone-700/80 hover:border-amber-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-stone-700 select-none">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.step}
                  </h3>

                  <p className="text-sm text-stone-300 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <button
                  onClick={item.action}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-700/80 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{item.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
