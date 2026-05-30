import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

  return (
    <section ref={containerRef} className="py-32 bg-brand-black relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Visual Side */}
          <div className="relative">
            <motion.div 
              style={{ y: y1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="aspect-[3/4] lg:aspect-auto lg:h-[700px] overflow-hidden rounded-sm relative z-10 border border-brand-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-brand-charcoal"
            >
              <img 
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop" 
                alt="Perfume Extraction Process" 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover scale-[1.15] opacity-80 mix-blend-lighten"
              />
            </motion.div>
            
            {/* Decorative element */}
            <motion.div 
               style={{ y: y2 }}
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1, delay: 0.3 }}
               className="hidden lg:block absolute -right-24 bottom-24 w-72 h-[400px] z-20 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-brand-white/5 bg-brand-charcoal"
            >
               <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop" 
                alt="Detail" 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover scale-[1.2] opacity-90"
              />
            </motion.div>
          </div>

          {/* Content Side */}
          <div className="max-w-xl md:pl-12">
            <motion.span 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11px] uppercase tracking-[0.3em] font-sans font-medium text-brand-gold block mb-8"
            >
              The Maison
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-[56px] lg:text-[64px] font-serif leading-[1.05] mb-12 font-light text-brand-white tracking-tight drop-shadow-md"
            >
              Creation Through Devotion.
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 text-brand-white/70 font-light text-[16px] leading-[1.8] mb-16"
            >
              <p>
                At AMR - FRAGRANCES, we believe that an exceptional fragrance is more than a scent—it is an invisible garment, a lingering memory, a profound expression of personal identity.
              </p>
              <p>
                Founded in passion, our maison is dedicated to the slow art of perfumery. We source rare botanicals and precious woods, allowing them to mature until they reveal their most intricate facets. There are no shortcuts in our ateliers, only an unwavering commitment to excellence and luxury.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pl-8 border-l border-brand-gold/30"
            >
              <p className="font-serif text-[28px] italic text-brand-white mb-6 leading-tight font-light">
                "We do not create perfumes. We compose liquid emotion."
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-gold/70">
                — Master Perfumer
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
