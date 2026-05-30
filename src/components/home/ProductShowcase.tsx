import React, { useState, useEffect } from 'react';
import { Heart, Search, ArrowDownUp, SlidersHorizontal, ChevronDown, Star, Check, ShoppingBag, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

type FilterType = 'All' | 'Men' | 'Women' | 'Bundles' | 'Gift Sets' | 'Best Sellers';
type SortType = 'Featured' | 'Price: Low to High' | 'Price: High to Low';

const staticProducts = [
  {
    id: 1,
    name: 'Santal Mystique',
    notes: 'Sandalwood, Cardamom, Leather',
    price: 190,
    compareAtPrice: 240,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop',
    badge: 'Best Seller',
    categories: ['Men', 'Best Sellers'],
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'Noir Absolu',
    notes: 'Black Truffle, Vanilla, Patchouli',
    price: 310,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
    badge: 'Limited Edition',
    categories: ['Women', 'Gift Sets'],
    rating: 4.5,
    reviews: 89
  },
  {
    id: 3,
    name: 'Bergamot Blanc',
    notes: 'Calabrian Bergamot, Amber, Musk',
    price: 195,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop',
    categories: ['Men', 'Women']
  },
  {
    id: 4,
    name: 'Rose épicée',
    notes: 'Turkish Rose, Pink Pepper, Oud',
    price: 280,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop',
    badge: 'New',
    categories: ['Women', 'Bundles'],
    rating: 5,
    reviews: 12
  },
];

export function ProductShowcase() {
  const { addToCart, setIsCartOpen } = useCart();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [activeSort, setActiveSort] = useState<SortType>('Featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [addedProducts, setAddedProducts] = useState<Set<string | number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(async res => {
         if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            return {};
          }
          if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);
          
          const text = await res.text();
          if (text.includes("Cookie check") || text.includes("Action required")) {
             console.error("Browser is blocking cookies. Open app in new tab to fetch products.");
             return [];
          }
          try {
             return JSON.parse(text);
          } catch(e) {
             console.error("Invalid JSON:", text.substring(0, 50));
             return [];
          }
      })
      .then(data => {
        if(Array.isArray(data) && data.length > 0) setDbProducts(data);
      })
      .catch(console.error)
      .finally(() => {
        setTimeout(() => setIsLoading(false), 500);
      });

    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
         if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            return {};
          }
          if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);
         return res.json();
      })
      .then(data => {
        if(Array.isArray(data)) {
          setWishlistItems(data.map(item => String(item.productId)));
        }
      })
      .catch(console.error);
    }
  }, []);

  const handleFilterChange = (filter: FilterType) => {
    if (filter === activeFilter) return;
    setIsLoading(true);
    setActiveFilter(filter);
    
    // Smooth skeleton delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleToggleWishlist = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      return alert('Please login to use wishlist');
      // For smoother handling, they should use navigate, but this is a quick alert inside a component not easily accessing navigate without hook
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: String(product.id),
          name: product.name,
          price: product.price,
          image: product.image
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          setWishlistItems(prev => [...prev, String(product.id)]);
          window.dispatchEvent(new CustomEvent('wishlist-updated'));
          setToastMessage('Added to Wishlist');
        } else {
          setWishlistItems(prev => prev.filter(id => id !== String(product.id)));
          window.dispatchEvent(new CustomEvent('wishlist-updated'));
          setToastMessage('Removed from Wishlist');
        }
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filterOptions: FilterType[] = ['All', 'Men', 'Women', 'Bundles', 'Gift Sets', 'Best Sellers'];
  const sortOptions: SortType[] = ['Featured', 'Price: Low to High', 'Price: High to Low'];

  const products = [
    ...dbProducts.map(p => {
      // Determine the default price/comparePrice (maybe use the first size if sizes exist)
      let defaultPrice = p.price;
      let defaultCompareAtPrice = p.compareAtPrice || null;
      if (p.sizes && p.sizes.length > 0) {
        defaultPrice = p.sizes[0].price;
        defaultCompareAtPrice = p.sizes[0].compareAtPrice || null;
      }
      return {
        id: p._id,
        name: p.name,
        notes: p.details?.topNotes?.join(', ') || 'Custom Blends',
        price: defaultPrice,
        compareAtPrice: defaultCompareAtPrice,
        sizes: p.sizes,
        image: p.images?.length > 0 ? p.images[0] : (p.image || "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop"),
        hoverImage: p.images?.length > 1 ? p.images[1] : (p.images?.length > 0 ? p.images[0] : (p.image || "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop")),
        categories: [p.category, p.isBestSeller ? 'Best Sellers' : null, p.isNew ? 'New' : null].filter(Boolean),
        tags: p.tags || []
      };
    })
  ];

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'All') return true;
    return product.categories?.some((c: string) => c && typeof c === 'string' && c.trim().toLowerCase() === activeFilter.trim().toLowerCase()) 
        || product.tags?.some((t: string) => t && typeof t === 'string' && t.trim().toLowerCase() === activeFilter.trim().toLowerCase());
  }).sort((a, b) => {
    if (activeSort === 'Price: Low to High') return a.price - b.price;
    if (activeSort === 'Price: High to Low') return b.price - a.price;
    return 0; // Featured
  });

  return (
    <section id="shop" className="py-24 bg-brand-black w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-[48px] font-serif font-light text-brand-white leading-[1.1]"
            >
              Featured Fragrances
            </motion.h2>
          </div>
          
          <div className="flex items-center gap-4 relative">
            {/* Invisible Overlay for auto-close */}
            {(isFilterOpen || isSortOpen) && (
              <div 
                className="fixed inset-0 z-30"
                onClick={() => { setIsFilterOpen(false); setIsSortOpen(false); }}
              />
            )}

            <div className="relative z-40">
              <button 
                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium border-b border-brand-white/20 pb-1 hover:border-brand-gold text-brand-white hover:text-brand-gold transition-colors"
                aria-haspopup="true"
                aria-expanded={isFilterOpen}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
                <ChevronDown className={`w-3 h-3 transition-transform duration-500 ease-[0.16,1,0.3,1] ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-4 w-56 bg-brand-charcoal border border-brand-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                  >
                    <div className="py-2">
                      {filterOptions.map((option, idx) => (
                        <motion.button
                          key={option}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 + 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => { handleFilterChange(option); setIsFilterOpen(false); }}
                          className={`block w-full text-left px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] transition-all duration-300 ${activeFilter === option ? 'bg-brand-gold/10 text-brand-gold font-medium border-l-2 border-brand-gold' : 'text-brand-white/60 hover:bg-brand-gold hover:text-brand-white hover:pl-6'}`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative z-40">
              <button 
                onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium border-b border-brand-white/20 pb-1 hover:border-brand-gold text-brand-white hover:text-brand-gold transition-colors"
                aria-haspopup="true"
                aria-expanded={isSortOpen}
              >
                <ArrowDownUp className="w-4 h-4" />
                Sort By
                <ChevronDown className={`w-3 h-3 transition-transform duration-500 ease-[0.16,1,0.3,1] ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full right-0 mt-4 w-56 bg-brand-charcoal border border-brand-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                  >
                    <div className="py-2">
                      {sortOptions.map((option, idx) => (
                        <motion.button
                          key={option}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 + 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => { setActiveSort(option); setIsSortOpen(false); }}
                          className={`block w-full text-left px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] transition-all duration-300 ${activeSort === option ? 'bg-brand-gold/10 text-brand-gold font-medium border-l-2 border-brand-gold' : 'text-brand-white/60 hover:bg-brand-gold hover:text-brand-white hover:pl-6'}`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Filters - Original horizontal list */}
        <div className="flex flex-wrap gap-4 mb-12 hidden md:flex">
          {filterOptions.map((filter) => (
            <button 
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest border transition-colors duration-500 ${activeFilter === filter ? 'bg-brand-gold text-brand-white border-brand-gold' : 'border-brand-white/20 text-brand-white/70 hover:border-brand-gold hover:text-brand-gold'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <motion.div 
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full animate-pulse"
                >
                  <div className="block aspect-[3/4] bg-brand-charcoal mb-6 rounded-sm border border-brand-white/5"></div>
                  <div className="flex flex-col flex-1 text-center items-center">
                    <div className="h-5 w-3/4 bg-brand-charcoal mb-2 rounded-sm"></div>
                    <div className="h-4 w-1/4 bg-brand-charcoal mb-3 rounded-sm"></div>
                    <div className="h-3 w-1/2 bg-brand-charcoal mb-6 rounded-sm"></div>
                  </div>
                </motion.div>
              ))
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-20 text-brand-white/50 font-serif text-xl"
              >
                No products found in this category.
              </motion.div>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col h-full"
                >
                {/* Image Container */}
                <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] bg-brand-charcoal mb-8 overflow-hidden group-hover:opacity-90 transition-opacity duration-500 rounded-sm border border-brand-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                    {product.badge && (
                      <span className="text-brand-white text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-1 bg-brand-gold shadow-md">
                        {product.badge}
                      </span>
                    )}
                    {product.categories && product.categories.filter((c:any) => c).map((category: string) => (
                      <span key={category} className="text-brand-white text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10">
                        {category}
                      </span>
                    ))}
                  </div>

                  
                  <button 
                    className={`absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-75 ${wishlistItems.includes(String(product.id)) ? 'text-brand-gold opacity-100' : 'text-brand-white drop-shadow-md opacity-0 group-hover:opacity-100 hover:text-brand-gold'}`}
                    onClick={(e) => handleToggleWishlist(e, product)}
                    aria-label={`Toggle wishlist for ${product.name}`}
                  >
                    <motion.div
                      key={wishlistItems.includes(String(product.id)) ? 'filled' : 'empty'}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <Heart className="w-4 h-4" size={16} fill={wishlistItems.includes(String(product.id)) ? "currentColor" : "none"} />
                    </motion.div>
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${product.hoverImage && product.hoverImage !== product.image ? 'opacity-100 group-hover:opacity-0' : 'group-hover:scale-105'}`}
                  />
                  
                  {product.hoverImage && product.hoverImage !== product.image && (
                    <img
                      src={product.hoverImage}
                      alt={`${product.name} alternate view`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
                    />
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex flex-col flex-1 text-center px-4">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-serif text-[20px] tracking-wide font-light mb-1.5 text-brand-white transition-colors group-hover:text-brand-gold">{product.name}</h3>
                  </Link>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-white/50 mb-3 font-medium">
                    {product.notes}
                  </p>
                  
                  {product.rating !== undefined && product.reviews !== undefined && product.reviews > 0 ? (
                    <div className="flex justify-center items-center gap-0.5 mb-4 opacity-80">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(product.rating) ? 'fill-brand-gold text-brand-gold' : 'text-brand-white/10'}`} />
                      ))}
                      <span className="text-[8px] tracking-[0.1em] text-brand-white/50 ml-1.5">({product.reviews})</span>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[26px] mb-4" />
                  )}

                  <div className="flex justify-center items-center gap-3 mb-5">
                    {product.compareAtPrice ? (
                      <>
                        <span className="text-[12px] text-brand-white/30 line-through tracking-wider">Rs. {product.compareAtPrice}</span>
                        <span className="text-[14px] text-brand-gold font-medium tracking-wider">Rs. {product.price}</span>
                      </>
                    ) : (
                      <span className="text-[14px] text-brand-gold font-medium tracking-wider">Rs. {product.price}</span>
                    )}
                  </div>
                  
                  <div className="mt-auto overflow-hidden">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: String(product.id || product._id),
                          name: product.name,
                          price: product.price,
                          compareAtPrice: product.compareAtPrice,
                          image: product.image,
                          quantity: 1
                        });
                        setIsCartOpen(true);
                        setAddedProducts(prev => new Set(prev).add(product.id || product._id));
                        setTimeout(() => {
                          setAddedProducts(prev => {
                            const next = new Set(prev);
                            next.delete(product.id || product._id);
                            return next;
                          });
                        }, 2000);
                        setToastMessage('Added to Bag');
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      disabled={addedProducts.has(product.id || product._id)}
                      className="w-full bg-transparent border border-brand-white/20 text-brand-white py-3.5 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-500 hover:bg-brand-white hover:text-brand-white disabled:bg-brand-gold disabled:border-brand-gold disabled:text-brand-white disabled:opacity-100 flex items-center justify-center gap-2 group/btn opacity-0 group-hover:opacity-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transform translate-y-4 group-hover:translate-y-0 disabled:translate-y-0 rounded-full"
                    >
                      {addedProducts.has(product.id || product._id) ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added
                        </>
                      ) : (
                        <span className="transform transition-transform duration-300 group-hover/btn:-translate-y-0.5">Add to Bag</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 bg-brand-charcoal border border-brand-white/10 text-brand-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 rounded-full backdrop-blur-md"
          >
            {toastMessage === 'Added to Wishlist' ? (
              <Heart className="w-5 h-5 fill-current text-brand-gold" />
            ) : toastMessage === 'Added to Bag' ? (
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-brand-charcoal overflow-hidden border border-brand-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.7)] flex flex-col md:flex-row rounded-sm"
            >
               <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-sm text-brand-white/50 hover:bg-brand-gold hover:text-brand-white transition-colors rounded-full"
                aria-label="Close product quick view"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 relative bg-brand-black aspect-square md:aspect-auto">
                <img 
                  src={quickViewProduct.image} 
                  alt={quickViewProduct.name} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-brand-white">
                <h3 className="font-serif text-3xl md:text-4xl mb-2">{quickViewProduct.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-gold/80 mb-6 font-medium">
                  {quickViewProduct.notes}
                </p>

                <div className="flex items-center gap-4 mb-8">
                  {quickViewProduct.compareAtPrice ? (
                    <>
                      <span className="text-lg text-brand-white/30 line-through tracking-wider">Rs. {quickViewProduct.compareAtPrice}</span>
                      <span className="text-xl text-brand-gold font-medium tracking-wider">Rs. {quickViewProduct.price}</span>
                    </>
                  ) : (
                    <span className="text-xl text-brand-gold font-medium tracking-wider">Rs. {quickViewProduct.price}</span>
                  )}
                </div>

                <p className="text-brand-white/60 mb-8 leading-relaxed font-light">
                  A signature blend offering an evocative journey. Each spray embodies the dedication to craftsmanship, sourced from the finest ingredients globally for an unforgettable scent experience.
                </p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      addToCart({
                        id: String(quickViewProduct.id || quickViewProduct._id),
                        name: quickViewProduct.name,
                        price: quickViewProduct.price,
                        compareAtPrice: quickViewProduct.compareAtPrice,
                        image: quickViewProduct.image,
                        quantity: 1
                      });
                      setIsCartOpen(true);
                      setQuickViewProduct(null);
                      setToastMessage('Added to Bag');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="w-full bg-brand-gold text-brand-white py-4.5 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors rounded-full"
                  >
                    Add to Bag
                  </button>
                  <Link
                    to={`/product/${quickViewProduct.id || quickViewProduct._id}`}
                    className="w-full border border-brand-white/20 flex items-center justify-center py-4 text-[10px] uppercase tracking-[0.2em] text-brand-white/80 hover:bg-white/5 hover:border-brand-white transition-colors font-medium rounded-full"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
