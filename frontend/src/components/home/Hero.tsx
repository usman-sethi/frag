import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [cms, setCms] = useState<any>({});
  const [sliders, setSliders] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    fetch('/api/cms').then(res => res.json()).then(data => setCms(data)).catch(console.error);
    fetch('/api/sliders').then(res => res.json()).then(data => {
      const activeSliders = data.filter((s: any) => s.isActive !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      setSliders(activeSliders);
    }).catch(console.error);
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (sliders.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [sliders.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliders.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);

  const slideContent = sliders.length > 0 ? sliders[currentSlide] : null;

  return (
    <section ref={containerRef} className="relative min-h-[90vh] md:min-h-screen flex items-center bg-brand-black overflow-hidden perspective-[1000px]">
      {/* Background Layer Group */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence initial={false}>
          {slideContent ? (
            <motion.img 
              key={slideContent._id || currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ y }}
              src={slideContent.image}
              alt={slideContent.title || 'Luxury Perfume'} 
              fetchPriority="high"
              ref={(node) => { if (node && currentSlide === 0) node.setAttribute('rel', 'preload') }}
              className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay"
            />
          ) : (
            <motion.img 
              key="cms-fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{ y }}
              src={cms.heroImage || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1600&auto=format&fit=crop"}
              alt="Luxury Perfume" 
              className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay"
            />
          )}
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/90 via-brand-black/60 to-brand-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-brand-black/40 to-brand-black opacity-80" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-50">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              y: Math.random() * 100 + 100, 
              x: Math.random() * window.innerWidth 
            }}
            animate={{ 
              opacity: [0, 0.5, 0],
              y: [null, Math.random() * -500],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute bottom-0 w-1 h-1 rounded-full bg-brand-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.8)] blur-[1px]"
          />
        ))}
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-20 relative z-20 h-full flex flex-col justify-center items-center text-center mt-24">
        
        <AnimatePresence mode="wait">
          {slideContent ? (
            <motion.div 
              key={slideContent._id || currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="max-w-[800px] flex flex-col items-center w-full"
            >
              {slideContent.subtitle && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="text-[11px] uppercase tracking-[0.4em] font-sans font-medium text-brand-gold mb-10 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                  {slideContent.subtitle}
                </motion.span>
              )}
              
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-[90px] font-serif mb-8 leading-[1.1] font-light text-brand-white tracking-tight drop-shadow-2xl"
              >
                {slideContent.title}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto mt-6"
              >
                {slideContent.link ? (
                  <Link
                    to={slideContent.link}
                    className="group relative overflow-hidden px-12 py-5 bg-transparent backdrop-blur-md text-brand-gold text-[12px] uppercase tracking-[0.2em] w-full sm:w-auto text-center border border-brand-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-500 rounded-full flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-brand-gold transform scale-x-0 origin-left transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-x-100 z-0"></div>
                    <span className="relative z-10 group-hover:text-brand-white transition-colors duration-500 font-medium whitespace-nowrap">Discover More</span>
                  </Link>
                ) : (
                  <a href="#explore" className="group relative overflow-hidden px-12 py-5 bg-transparent backdrop-blur-md text-brand-gold text-[12px] uppercase tracking-[0.2em] w-full sm:w-auto text-center border border-brand-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-500 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-brand-gold transform scale-x-0 origin-left transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-x-100 z-0"></div>
                    <span className="relative z-10 group-hover:text-brand-white transition-colors duration-500 font-medium whitespace-nowrap">Discover More</span>
                  </a>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="cms-fallback-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[800px] flex flex-col items-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-[11px] md:hidden uppercase tracking-[0.4em] font-sans font-medium text-brand-gold mb-10 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                {cms.heroTitle || "L'Essence de l'Élégance"}
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-[90px] font-serif mb-8 leading-[1.1] font-light text-brand-white tracking-tight drop-shadow-2xl"
              >
                {cms.heroSubtitle === 'Crafted Scents For Timeless Presence' || !cms.heroSubtitle ? (
                  <>Unveiling the Essence <i className="text-brand-taupe/80 font-serif italic">Of</i><br /> Pure Luxury</>
                ) : (
                  cms.heroSubtitle
                )}
              </motion.h1>
    
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="text-lg md:text-[22px] leading-[1.8] text-brand-white/70 mb-14 font-light max-w-[550px] mix-blend-screen"
              >
                {cms.featuredText === 'Every fragrance tells a story. Crafted with precision and inspired by timeless elegance.' || !cms.featuredText 
                  ? "Each drop is a masterpiece. Expertly blended and inspired by the modern aesthetic." 
                  : cms.featuredText}
              </motion.p>
    
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto"
              >
                <a
                  href="#shop"
                  className="group relative overflow-hidden px-12 py-5 bg-transparent backdrop-blur-md text-brand-gold text-[12px] uppercase tracking-[0.2em] w-full sm:w-auto text-center border border-brand-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-500 rounded-full flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-brand-gold transform scale-x-0 origin-left transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-x-100 z-0"></div>
                  <span className="relative z-10 group-hover:text-brand-white transition-colors duration-500 font-medium">Explore Collection</span>
                </a>
                
                <a
                  href="#explore"
                  className="group relative overflow-hidden px-12 py-5 bg-transparent text-brand-white border border-brand-white/20 text-[12px] uppercase tracking-[0.2em] w-full sm:w-auto text-center transition-all duration-500 hover:border-brand-white hover:bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <span className="relative z-10 transition-colors duration-500">Discover Fragrances</span>
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slider Controls */}
      {sliders.length > 1 && (
        <div className="absolute bottom-12 md:bottom-24 left-0 w-full z-30 pointer-events-none">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center pointer-events-auto">
            <button 
              onClick={prevSlide}
              className="p-3 md:p-4 rounded-full border border-brand-white/20 text-brand-white hover:border-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300 backdrop-blur-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>
            <div className="flex gap-3">
              {sliders.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full h-1 md:h-1.5 ${currentSlide === idx ? 'w-8 md:w-16 bg-brand-gold' : 'w-2 md:w-3 bg-brand-white/30 hover:bg-brand-white/50'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextSlide}
              className="p-3 md:p-4 rounded-full border border-brand-white/20 text-brand-white hover:border-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300 backdrop-blur-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

