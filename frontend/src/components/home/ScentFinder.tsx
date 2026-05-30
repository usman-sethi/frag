import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
  {
    id: 1,
    question: "What is your ideal escape?",
    options: ["A walk in the forest", "A sunset on the beach", "A bustling midnight city", "A quiet garden cafe"]
  },
  {
    id: 2,
    question: "How do you want to feel?",
    options: ["Mysterious & Alluring", "Fresh & Invigorated", "Warm & Embraced", "Elegant & Confident"]
  },
  {
    id: 3,
    question: "Which aroma draws you in?",
    options: ["Rich woods & spices", "Saltwater & citrus", "Vanilla & amber", "Blooming florals"]
  }
];

export function ScentFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [recommendedProduct, setRecommendedProduct] = useState<any>(null);
  const [cmsSettings, setCmsSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => setCmsSettings(data))
      .catch(console.error);

    fetch('/api/products')
      .then(res => {
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            return {};
          }
          if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        if(Array.isArray(data)) setDbProducts(data);
      })
      .catch(console.error);
  }, []);

  const handleNext = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Check if admin selected a specific product for the velvet experience
      if (cmsSettings?.velvetProductId) {
        const adminProduct = dbProducts.find(p => p._id === cmsSettings.velvetProductId || p.id === cmsSettings.velvetProductId);
        if (adminProduct) {
          setRecommendedProduct(adminProduct);
          setIsFinished(true);
          return;
        }
      }

      // Find a matching product
      let targetVibes: string[] = [];
      const escapeAnswer = newAnswers[0];
      if (escapeAnswer === "A walk in the forest") targetVibes = ["Woody", "Earthy"];
      if (escapeAnswer === "A bustling midnight city") targetVibes = ["Spicy", "Oriental"];
      if (escapeAnswer === "A sunset on the beach") targetVibes = ["Fresh", "Citrus", "Aquatic"];
      if (escapeAnswer === "A quiet garden cafe") targetVibes = ["Floral", "Gourmand"];
      
      let matched = dbProducts.find(p => 
        (p.vibe && targetVibes.includes(p.vibe)) ||
        (p.tags && Array.isArray(p.tags) && targetVibes.some(v => p.tags.includes(v))) ||
        (p.category && targetVibes.includes(p.category))
      );
      if (!matched && dbProducts.length > 0) matched = dbProducts[0]; // fallback
      
      setRecommendedProduct(matched);
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsFinished(false);
  };

  return (
    <section id="scent-finder" className="py-24 bg-brand-black text-brand-white overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-16"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-brand-gold block mb-4">The Velvet Experience</span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-white font-light tracking-wide">Find Your Signature Scent</h2>
        </motion.div>

        <div className="min-h-[300px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="mb-4 text-xs font-medium tracking-[0.3em] text-brand-gold/70">
                  0{currentStep + 1} / 0{questions.length}
                </div>
                <h3 className="text-2xl md:text-3xl font-serif mb-10 font-light text-brand-white tracking-wide">{questions[currentStep]?.question}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {questions[currentStep]?.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleNext(option)}
                      className="group border border-brand-white/10 py-5 px-6 text-[11px] tracking-[0.2em] font-medium uppercase hover:border-brand-gold hover:bg-brand-charcoal transition-all duration-500 relative overflow-hidden rounded-sm"
                    >
                      <span className="relative z-10 text-brand-white/80 group-hover:text-brand-gold transition-colors">{option}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-3xl mx-auto bg-brand-charcoal p-8 md:p-14 border border-brand-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-sm"
              >
                <div className="text-center mb-12">
                  <h3 className="text-4xl md:text-5xl font-serif mb-4 text-brand-white font-light tracking-wide">We found your match.</h3>
                  <p className="text-brand-gold/80 text-[10px] tracking-[0.3em] uppercase font-medium">Based on your refined preferences</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-left mb-10">
                  <div className="w-56 h-72 bg-brand-black shrink-0 relative overflow-hidden border border-brand-white/5 shadow-2xl">
                    <img 
                      src={recommendedProduct?.images?.[0] || recommendedProduct?.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"} 
                      alt={recommendedProduct?.name || "Recommended Perfume"} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 py-4 text-center md:text-left flex flex-col h-full justify-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold mb-3 block font-medium">Your Signature Scent</span>
                    <h4 className="text-3xl font-serif mb-3 text-brand-white font-light tracking-wide">{recommendedProduct?.name || "Santal Mystique"}</h4>
                    <p className="text-brand-white/60 text-sm mb-8 leading-relaxed font-light">
                      {recommendedProduct?.description || "Deep, intoxicating, and memorable. Woods and spices blended to perfection for evening wear."}
                    </p>
                    <p className="text-lg font-medium tracking-wider mb-10 text-brand-gold">Rs. {recommendedProduct?.price || "240"}</p>
                    <div className="flex justify-center md:justify-start gap-4">
                      <Link 
                        to={`/product/${recommendedProduct?._id || recommendedProduct?.id || 'demo'}`}
                        className="px-8 py-3.5 bg-brand-gold text-brand-white text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors rounded-full"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-brand-white/10 pt-8 mt-8">
                  <button 
                    onClick={handleReset}
                    className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-white/50 hover:text-brand-gold flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retake Consultation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
