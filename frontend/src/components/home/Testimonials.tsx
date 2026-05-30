import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const testimonials = [
  {
    id: 1,
    name: "Eleanor V.",
    text: "Santal Mystique is an absolute revelation. I've never received so many compliments. It wears beautifully throughout the day and leaves the most elegant trail.",
    product: "Santal Mystique"
  },
  {
    id: 2,
    name: "James T.",
    text: "The presentation alone is worth the price. But the fragrance... Noir Absolu has become my signature scent. Bold, uncompromising, yet incredibly sophisticated.",
    product: "Noir Absolu"
  },
  {
    id: 3,
    name: "Sophia L.",
    text: "I was hesitant to buy perfume online, but Bergamot Blanc is exactly as described. Fresh, airy, and undeniably luxurious. Excellent customer service as well.",
    product: "Bergamot Blanc"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-brand-charcoal text-brand-white border-y border-brand-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-black/40 via-brand-charcoal to-brand-charcoal pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        
        <div className="flex justify-center gap-1.5 mb-12 text-brand-gold drop-shadow-md">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 fill-current" />
          ))}
        </div>

        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-full"
            >
              <h3 className="text-2xl md:text-3xl lg:text-[40px] font-serif font-light leading-[1.4] mb-12 text-brand-white tracking-wide drop-shadow-sm">
                "{testimonials[currentIndex].text}"
              </h3>
              
              <div className="flex flex-col items-center gap-3">
                <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-brand-gold">{testimonials[currentIndex].name}</span>
                <span className="text-[10px] text-brand-white/50 tracking-[0.2em] uppercase font-light">Verified Buyer • {testimonials[currentIndex].product}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-8 mt-12 items-center">
          <button 
            onClick={prev}
            className="w-10 h-10 border border-brand-white/20 rounded-full flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors text-brand-white/60"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-3 items-center">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  idx === currentIndex ? "bg-brand-gold w-6 shadow-[0_0_10px_rgba(212,175,55,0.5)]" : "bg-brand-white/20 w-1.5 hover:bg-brand-white/50"
                )}
              />
            ))}
          </div>
          <button 
            onClick={next}
            className="w-10 h-10 border border-brand-white/20 rounded-full flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors text-brand-white/60"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
