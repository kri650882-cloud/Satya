import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquareQuote, Star, User } from 'lucide-react';
import { Testimonial } from '../types';

export const TestimonialsSection: React.FC = () => {
  const { t } = useApp();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setTestimonials(data.filter(item => item.status === 'Published'));
        }
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            {t.customerReviewsHeading}
          </h2>
        </div>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-stone-700 italic">
                    "{test.review}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xs">
                    {test.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{test.customerName}</div>
                    <div className="text-[10px] text-stone-500">{test.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State per Prompt Specification */
          <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 border border-stone-200 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800 mb-1">
              {t.noReviewsYet}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We strictly publish only verified client testimonials once home-building plots are registered and confirmed.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
