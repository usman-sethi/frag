import { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, Plus, Minus, Trash2, ArrowRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const links = ['Men', 'Women', 'Bundles', 'Gift Sets'];

export const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isCartOpen: cartOpen, setIsCartOpen: setCartOpen, cart, updateQuantity, removeFromCart, subtotal } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href='/';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWishlistCount(data.length || 0);
        }
      } catch (e) {}
    };
    
    fetchWishlistCount();

    const handleWishlistUpdate = () => fetchWishlistCount();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const fetchSearchResults = async () => {
        try {
          const res = await fetch('/api/products');
          if (res.ok) {
            const data = await res.json();
            const queryLower = searchQuery.toLowerCase().trim();
            const queryChars = queryLower.replace(/\s+/g, '').split('');
            
            const scoredProducts = data.map((p: any) => {
              const nameLower = p.name.toLowerCase();
              const nameChars = nameLower.replace(/\s+/g, '').split('');
              let score = 0;
              
              if (nameLower === queryLower) score += 100;
              else if (nameLower.startsWith(queryLower)) score += 50;
              else if (nameLower.includes(queryLower)) score += 30;

              let lettersMatched = 0;
              for (const char of queryChars) {
                const idx = nameChars.indexOf(char);
                if (idx !== -1) {
                  lettersMatched++;
                  nameChars.splice(idx, 1);
                }
              }
              
              const letterMatchRatio = queryChars.length > 0 ? (lettersMatched / queryChars.length) : 0;
              score += letterMatchRatio * 20;

              // Give a boost if all letters from the query are present in the name
              if (lettersMatched === queryChars.length) {
                  score += 15;
              }

              return { ...p, _score: score };
            });

            const filtered = scoredProducts
              .filter(p => p._score > 15 || p.name.toLowerCase().includes(queryLower))
              .sort((a, b) => b._score - a._score);
              
            setSearchResults(filtered);
          }
        } catch (err) {
          console.error(err);
        }
      };
      
      const timeoutId = setTimeout(fetchSearchResults, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when drawers are open
  useEffect(() => {
    if (mobileMenuOpen || cartOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, cartOpen, searchOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          isScrolled || searchOpen ? 'bg-brand-black/80 backdrop-blur-2xl py-4 border-b border-brand-white/10 shadow-lg' : 'bg-transparent py-8'
        )}
        style={{ marginTop: isScrolled ? 0 : '32px' }}
      >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col">
        {/* Top Row: Brand & Icons */}
        <div className="flex items-center justify-between mb-4 md:mb-6 w-full text-brand-white">
          {/* Mobile Menu Button (Left on mobile) */}
          <button 
            className="md:hidden mr-4 hover:opacity-70 transition-opacity"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Brand */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link to="/" className="inline-flex items-center text-center md:text-left drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <span className="block font-serif text-[18px] sm:text-[22px] md:text-[32px] tracking-[0.15em] md:tracking-[0.25em] font-light text-brand-white uppercase whitespace-nowrap">AMR - FRAGRANCES</span>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex justify-end items-center gap-6 md:gap-10 text-[10px] font-medium uppercase tracking-[0.15em] text-brand-white drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
            <div className="hidden xl:flex flex-col gap-1 items-end border-r border-brand-white/20 pr-6 mr-[-10px]">
                <a href="https://wa.me/923119149100" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-70 hover:text-brand-gold transition-colors">
                  <WhatsappIcon className="w-3 h-3 text-brand-gold" /> +92 311 9149100
                </a>
                <a href="https://wa.me/923199303171" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-70 hover:text-brand-gold transition-colors">
                  <WhatsappIcon className="w-3 h-3 text-brand-gold" /> 0319-9303171
                </a>
            </div>
            <button 
              className="hover:text-brand-gold transition-colors hidden md:flex items-center gap-2"
              onClick={() => setSearchOpen(true)}
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" strokeWidth={1.5} /> SEARCH
            </button>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/account'} className="hidden sm:flex hover:text-brand-gold transition-colors items-center gap-2">
                <User className="w-4 h-4" strokeWidth={1.5} /> {user.role === 'admin' ? 'ADMIN' : 'ACCOUNT'}
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex hover:text-brand-gold transition-colors items-center gap-2">
                <User className="w-4 h-4" strokeWidth={1.5} /> PROFILE
              </Link>
            )}
            <Link to="/wishlist" className="hidden sm:flex hover:text-brand-gold transition-colors items-center gap-2">
              <Heart className="w-4 h-4" strokeWidth={1.5} /> WISHLIST {wishlistCount > 0 && <span className="text-brand-gold">({wishlistCount})</span>}
            </Link>
            <button 
              className="hover:text-brand-gold transition-colors relative group hidden md:flex items-center gap-2"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} /> BAG <span className="text-brand-gold">({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </button>
            
            <button 
              className="md:hidden hover:text-brand-gold transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button 
              className="md:hidden hover:text-brand-gold transition-colors relative group"
              onClick={() => setCartOpen(true)}
              aria-label="Open mobile cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-brand-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium group-hover:scale-110 transition-transform">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Links (Desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-10">
          {links.map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase().replace(/ /g, '-')}`}
              className="text-[11px] font-medium uppercase tracking-[0.2em] relative group overflow-hidden text-brand-white hover:text-brand-gold transition-colors drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]"
            >
              {link}
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-gold origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-brand-black/95 backdrop-blur-3xl z-50 p-6 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-b border-brand-white/10"
          >
            <div className="max-w-[800px] mx-auto relative flex items-center">
              <Search className="w-6 h-6 text-brand-gold absolute left-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fragrances, gifts..." 
                className="w-full bg-transparent border-b-2 border-brand-gold/20 focus:border-brand-gold pb-4 pt-4 pl-14 pr-12 text-xl md:text-2xl font-serif text-brand-white placeholder:text-brand-white/30 placeholder:font-light focus:outline-none transition-colors"
                autoFocus
              />
              <button 
                className="absolute right-0 hover:text-brand-gold transition-colors px-4 py-4 text-brand-white"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="max-w-[800px] mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                {searchResults.slice(0, 4).map((product) => (
                  <Link 
                    key={product._id} 
                    to={`/product/${product._id}`} 
                    onClick={() => setSearchOpen(false)}
                    className="group flex flex-col"
                  >
                    <div className="aspect-[4/5] bg-brand-charcoal relative overflow-hidden mb-3 rounded-sm border border-brand-white/5">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <img src={product.images[0]} alt={product.name} className={`w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105 ${product.images.length > 1 ? 'group-hover:opacity-0' : ''}`} />
                          {product.images.length > 1 && (
                            <img src={product.images[1]} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100" />
                          )}
                        </>
                      ) : (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                      )}
                    </div>
                    <h3 className="text-sm font-serif text-brand-white group-hover:text-brand-gold transition-colors">{product.name}</h3>
                    <p className="text-[11px] text-brand-white/50">Rs. {product.price}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="max-w-[800px] mx-auto mt-8 flex flex-wrap items-center gap-4 text-[10px] md:text-xs font-medium uppercase tracking-widest text-brand-white/40">
                <span>Trending:</span>
                <a href="#" className="text-brand-white hover:text-brand-gold transition-colors underline-offset-4 hover:underline">Santal</a>
                <a href="#" className="text-brand-white hover:text-brand-gold transition-colors underline-offset-4 hover:underline">Gift Sets</a>
                <a href="#" className="text-brand-white hover:text-brand-gold transition-colors underline-offset-4 hover:underline">Oud</a>
                <a href="#" className="text-brand-white hover:text-brand-gold transition-colors underline-offset-4 hover:underline">Limited Edition</a>
              </div>
            )}
            
            {/* Overlay backdrop for search modal */}
            <div 
              className="fixed inset-0 top-[100%] bg-black/60 backdrop-blur-sm -z-10 h-screen"
              onClick={() => setSearchOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </header>

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-md"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.5, ease: [0.25, 1, 0.25, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[90%] max-w-[420px] bg-brand-charcoal text-brand-white z-[110] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-l border-brand-white/10 flex flex-col"
            >
              <div className="flex items-center justify-between p-8 border-b border-brand-white/10 bg-brand-black/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <h2 className="font-serif text-2xl tracking-[0.15em] text-brand-white uppercase">Your Bag</h2>
                  <span className="bg-brand-gold text-brand-white text-xs px-2 py-1 min-w-[24px] text-center rounded-full font-bold">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <button onClick={() => setCartOpen(false)} className="hover:bg-brand-white/10 p-2 rounded-full transition-colors text-brand-white/50 hover:text-brand-white" aria-label="Close cart">
                  <X className="w-6 h-6" strokeWidth={1} />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-brand-black/20">
                  <ShoppingBag className="w-16 h-16 text-brand-white/10 mb-8" strokeWidth={1} />
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-white/40 mb-3 font-medium">Your bag is empty</p>
                  <p className="text-[13px] text-brand-white/30 font-light mb-10 italic font-serif">Discover your next signature scent.</p>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="bg-brand-gold text-brand-white px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors rounded-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-brand-black/20">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-custom">
                    {cart.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex gap-6 group">
                        <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded-sm border border-brand-white/5" />
                        <div className="flex-1 flex flex-col pt-1">
                          <div className="flex justify-between">
                            <h3 className="font-serif text-lg text-brand-white group-hover:text-brand-gold transition-colors">{item.name}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-brand-white/30 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3 mb-auto mt-1">
                            {item.compareAtPrice ? (
                              <>
                                <span className="text-sm text-brand-white/30 line-through">Rs. {Number(item.compareAtPrice).toFixed(2)}</span>
                                <span className="text-sm text-brand-gold">Rs. {Number(item.price).toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-sm text-brand-white/70">Rs. {Number(item.price).toFixed(2)}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-6 border border-brand-white/10 rounded-full w-fit px-3 py-1.5 bg-brand-black/40">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-brand-gold transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-brand-gold transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {cart.length > 3 && (
                      <div className="text-center text-xs uppercase tracking-widest font-medium text-brand-white/40 pt-6 pb-2 border-t border-brand-white/5">
                        +{cart.length - 3} more item{cart.length - 3 !== 1 ? 's' : ''} in cart
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 border-t border-brand-white/10 bg-brand-black shadow-[0_-10px_30px_rgba(0,0,0,0.3)] mt-auto">
                    <div className="flex justify-between items-end mb-8">
                      <span className="text-xs uppercase tracking-[0.2em] text-brand-white/50">Subtotal</span>
                      <span className="font-serif text-[32px] leading-none text-brand-gold">Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <Link
                      to="/checkout"
                      onClick={() => setCartOpen(false)}
                      className="group w-full flex items-center justify-center gap-4 bg-brand-gold text-brand-white px-8 py-5 hover:bg-white transition-colors rounded-full"
                    >
                      <span className="text-[12px] uppercase tracking-[0.2em] font-medium">Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ type: 'tween', duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-[90%] max-w-[420px] bg-brand-charcoal text-brand-white flex flex-col pt-20 px-10 pb-10 border-r border-brand-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto scrollbar-custom"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 left-8 text-brand-white/50 hover:text-brand-gold transition-colors p-2"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <X className="w-8 h-8" strokeWidth={1} />
              </button>

              <div className="flex flex-col gap-6 mt-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 mb-2 font-medium">Menu</span>
                {links.map((link, i) => (
                  <Link
                    key={link}
                    to={`/${link.toLowerCase().replace(/ /g, '-')}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block overflow-hidden"
                  >
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="text-4xl sm:text-5xl font-serif text-brand-white/80 hover:text-brand-gold transition-all transform hover:translate-x-2 block"
                    >
                      {link}
                    </motion.span>
                  </Link>
                ))}
              </div>
              
              <div className="mt-auto pt-8 border-t border-brand-white/10 flex flex-col gap-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 font-medium">Account</span>
                <Link to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-brand-white/80 hover:text-brand-gold transition-colors font-medium">
                  <User className="w-5 h-5 text-brand-gold/80" />
                  {user ? (user.role === 'admin' ? 'Admin Dashboard' : 'My Account') : 'Log In / Register'}
                </Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-brand-white/80 hover:text-brand-gold transition-colors font-medium">
                  <Heart className="w-5 h-5 text-brand-gold/80" />
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
              </div>

              <div className="mt-8 mb-8 pb-12 flex-shrink-0 flex flex-col gap-8">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-brand-white/30 border-b border-brand-white/10 pb-4">Contact</span>
                  <div className="flex flex-col gap-4">
                    <a href="https://wa.me/923119149100" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-brand-white/70 hover:text-brand-gold transition-colors group font-medium">
                      <span className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center group-hover:bg-[#25D366] group-hover:border-[#25D366] group-hover:text-white transition-colors"><WhatsappIcon className="w-5 h-5"/></span> 
                      +92 311 9149100
                    </a>
                    <a href="https://wa.me/923199303171" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-brand-white/70 hover:text-brand-gold transition-colors group font-medium">
                      <span className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center group-hover:bg-[#25D366] group-hover:border-[#25D366] group-hover:text-white transition-colors"><WhatsappIcon className="w-5 h-5"/></span> 
                      0319-9303171
                    </a>
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.2em] text-brand-white/30 border-b border-brand-white/10 pb-4 mt-4">Personal</span>
                  <div className="flex flex-col gap-6">
                    {user ? (
                      <Link to={user.role === 'admin' ? '/admin' : '/account'} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-brand-white/70 hover:text-brand-gold transition-colors group font-medium">
                        <span className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-white transition-colors"><User className="w-4 h-4"/></span> 
                        My Account
                      </Link>
                    ) : (
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-brand-white/70 hover:text-brand-gold transition-colors group font-medium">
                        <span className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-white transition-colors"><User className="w-4 h-4"/></span> 
                        Sign In
                      </Link>
                    )}
                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-brand-white/70 hover:text-brand-gold transition-colors group font-medium">
                      <span className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-white transition-colors">
                        <Heart className="w-4 h-4"/>
                      </span> 
                      Wishlist {wishlistCount > 0 && <span className="text-brand-gold font-bold">({wishlistCount})</span>}
                    </Link>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
