import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the popup has already been shown in this session
    const hasSeenPopup = sessionStorage.getItem('jahan_popup_seen_new_2');
    const hasSubscribed = localStorage.getItem('jahan_newsletter_subscribed');

    if (!hasSeenPopup && !hasSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('jahan_popup_seen_new_2', 'true');
      }, 5000); // 5 seconds wait
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) {
      setError('Please provide both email and phone number.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone })
      });

      if (!res.ok) {
        let errStr = 'Failed to subscribe. Please try again later.';
        try {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            errStr = data.details || data.error || errStr;
          } catch(e) {
            errStr = `Invalid response: ${text.substring(0, 40)}`;
          }
        } catch(e) {}
        throw new Error(errStr);
      }

      setIsSuccess(true);
      localStorage.setItem('jahan_newsletter_subscribed', 'true');
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-brand-charcoal text-brand-white w-full max-w-xl relative shadow-[0_30px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row rounded-sm border border-brand-white/10"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 text-brand-white/30 hover:text-brand-gold transition-colors p-2 bg-brand-black/40 rounded-full backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-2/5 h-48 md:h-auto relative hidden md:block border-r border-brand-white/5">
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop" 
                alt="AMR - FRAGRANCES" 
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal to-transparent opacity-80" />
            </div>
            
            <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col justify-center bg-brand-charcoal relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/5 via-brand-charcoal to-brand-charcoal pointer-events-none"></div>
              
              <div className="relative z-10">
                {!isSuccess ? (
                  <>
                    <h3 className="font-serif text-3xl tracking-wide mb-3 text-brand-white font-light">Exclusive Updates</h3>
                    <p className="text-[13px] text-brand-white/60 mb-8 leading-relaxed font-light">
                      Join the World of AMR - FRAGRANCES. Subscribe to receive exclusive access to new releases and private sales.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                      <div className="relative">
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address" 
                          className="w-full bg-transparent border-b border-brand-white/20 pb-2 px-1 text-[13px] text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone Number" 
                          className="w-full bg-transparent border-b border-brand-white/20 pb-2 px-1 text-[13px] text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      {error && (
                        <p className="text-red-400 text-[11px] mt-1 bg-red-900/20 p-2.5 rounded-sm border border-red-500/20">{error}</p>
                      )}
                      
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 bg-brand-gold text-brand-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed rounded-full w-full"
                      >
                        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                      </button>
                      <p className="text-[10px] text-brand-white/30 text-center mt-3 uppercase tracking-widest">
                         By subscribing you agree to our <a href="#" className="underline underline-offset-4 hover:text-brand-gold transition-colors">Terms of Service</a>.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    >
                      <X className="w-6 h-6 hidden" /> {/* Hidden X to maintain import structure, or import Check if wanted */}
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="font-serif text-2xl tracking-wide mb-3 text-brand-white font-light">Welcome to AMR - FRAGRANCES</h3>
                    <p className="text-[12px] text-brand-white/50 uppercase tracking-[0.2em]">
                      You've been successfully added to our list.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
