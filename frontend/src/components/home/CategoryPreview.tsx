import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    title: "Men's Collection",
    tagline: "Bold & Masculine",
    linkText: "Explore Now",
    href: "/men",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Women's Collection",
    tagline: "Ethereal & Radiant",
    linkText: "Explore Now",
    href: "/women",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Signature Bundles",
    tagline: "Curated Experiences",
    linkText: "Discover Sets",
    href: "/bundles",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
  }
];

export function CategoryPreview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="explore" className="bg-brand-black w-full overflow-hidden border-y border-brand-white/10">
      <div className="flex flex-col md:flex-row h-[800px] md:h-[750px] w-full">
        {categories.map((category, index) => {
          const isHovered = hoveredIndex === index;
          const isPassive = hoveredIndex !== null && hoveredIndex !== index;
          
          return (
            <motion.a
              key={category.title}
              href={category.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative flex items-center justify-center overflow-hidden cursor-pointer border-b md:border-b-0 md:border-r border-brand-white/10 last:border-0 group"
              style={{ flex: 1 }}
              animate={{
                flex: isMobile ? 1 : (isHovered ? 2.5 : isPassive ? 0.75 : 1)
              }}
              layout
            >
              {/* Background Image */}
              <motion.div 
                className="absolute inset-0 z-0 bg-cover bg-center origin-center"
                style={{ backgroundImage: `url(${category.image})` }}
                animate={{
                  scale: isHovered ? 1.05 : 1.0,
                  opacity: isHovered ? 0.8 : 0.3,
                  filter: isPassive ? 'grayscale(100%) brightness(0.5)' : 'grayscale(40%) brightness(0.9)'
                }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent z-0 opacity-100 group-hover:opacity-90 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-transparent transition-colors duration-700 z-0" />
              
              <div className="relative z-10 flex flex-col items-center justify-end h-full pb-20 w-full px-8">
                <motion.div 
                  className="overflow-hidden flex flex-col items-center"
                  animate={{ y: isMobile ? 0 : (isHovered ? -16 : 0) }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-4 opacity-70 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-out font-medium">
                    {category.tagline}
                  </span>
                  <span className="text-[28px] md:text-[36px] font-serif font-light tracking-wider mb-6 text-brand-white text-center whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
                    {category.title}
                  </span>
                  
                  <motion.div 
                    className="flex flex-col items-center overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: isMobile ? 1 : (isHovered ? 1 : 0), 
                      height: isMobile ? 'auto' : (isHovered ? 'auto' : 0)
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <span className="flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-brand-gold font-medium border border-brand-gold/40 bg-brand-black/20 backdrop-blur-md px-8 py-3.5 hover:bg-brand-gold hover:text-brand-white hover:border-brand-gold transition-all duration-500 rounded-full mt-4">
                      {category.linkText}
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-500" />
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
