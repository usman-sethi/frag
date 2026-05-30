import React, { useState, useEffect } from 'react';
import { Heart, ArrowDownUp, SlidersHorizontal, ChevronDown, Star, Check, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Helmet } from 'react-helmet-async';

type FilterType = 'All' | 'Men' | 'Women' | 'Bundles' | 'Gift Sets' | 'Best Sellers';
type SortType = 'Featured' | 'Price: Low to High' | 'Price: High to Low';

export default function FiftyMl() {
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
             return [];
          }
          try {
             return JSON.parse(text);
          } catch(e) {
             return [];
          }
      })
      .then(data => {
        if(Array.isArray(data)) {
          // You can filter specifically for 50ml or just show all. 
          // Assuming user uploaded men products to the store they want to see them here:
          setDbProducts(data);
        }
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
      .then(res => res.ok ? res.json() : [])
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
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleToggleWishlist = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to use wishlist');

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
    } catch (err) {}
  };

  const filterOptions: FilterType[] = ['All', 'Men', 'Women', 'Bundles', 'Gift Sets', 'Best Sellers'];
  const sortOptions: SortType[] = ['Featured', 'Price: Low to High', 'Price: High to Low'];

  const products = dbProducts.map(p => {
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
  });

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'All') return true;
    return product.categories?.some((c: string) => c && typeof c === 'string' && c.trim().toLowerCase() === activeFilter.trim().toLowerCase()) 
        || product.tags?.some((t: string) => t && typeof t === 'string' && t.trim().toLowerCase() === activeFilter.trim().toLowerCase());
  }).sort((a, b) => {
    if (activeSort === 'Price: Low to High') return a.price - b.price;
    if (activeSort === 'Price: High to Low') return b.price - a.price;
    return 0;
  });

  return (
    <>
      <Helmet>
        <title>The 50ML Collection | AMR - FRAGRANCES</title>
      </Helmet>
      <div className="pt-32 pb-24 min-h-screen bg-brand-black w-full overflow-hidden text-brand-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          <div className="mb-16 pb-6 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-brand-white mb-6">The 50ML Collection</h1>
            <p className="text-brand-white/60 text-sm md:text-base leading-relaxed tracking-wide">
              Your signature scents, now in a perfectly curated 50ml edition. Ideal for travel or discovering a new everyday favorite.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-end mb-12 gap-8 border-b border-brand-white/10 pb-6">
            <div className="flex items-center gap-4 relative">
              {(isFilterOpen || isSortOpen) && (
                <div className="fixed inset-0 z-30" onClick={() => { setIsFilterOpen(false); setIsSortOpen(false); }} />
              )}
              <div className="relative z-40">
                <button onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium hover:text-brand-gold transition-colors">
                  <SlidersHorizontal className="w-4 h-4" /> Filter <ChevronDown className={`w-3 h-3 transition-transform duration-500 ease-[0.16,1,0.3,1] ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-4 w-56 bg-brand-charcoal border border-brand-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-50">
                      <div className="py-2">
                        {filterOptions.map((option) => (
                          <button key={option} onClick={() => { handleFilterChange(option); setIsFilterOpen(false); }} className={`block w-full text-left px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] transition-all duration-300 ${activeFilter === option ? 'bg-brand-gold/10 text-brand-gold font-medium border-l-2 border-brand-gold' : 'text-brand-white/60 hover:bg-brand-gold hover:text-brand-white hover:pl-6'}`}>
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative z-40">
                <button onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium hover:text-brand-gold transition-colors">
                  <ArrowDownUp className="w-4 h-4" /> Sort By <ChevronDown className={`w-3 h-3 transition-transform duration-500 ease-[0.16,1,0.3,1] ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 w-56 bg-brand-charcoal border border-brand-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-50">
                      <div className="py-2">
                        {sortOptions.map((option) => (
                          <button key={option} onClick={() => { setActiveSort(option); setIsSortOpen(false); }} className={`block w-full text-left px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] transition-all duration-300 ${activeSort === option ? 'bg-brand-gold/10 text-brand-gold font-medium border-l-2 border-brand-gold' : 'text-brand-white/60 hover:bg-brand-gold hover:text-brand-white hover:pl-6'}`}>
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full animate-pulse">
                    <div className="block aspect-[3/4] bg-brand-charcoal mb-6 rounded-sm border border-brand-white/5"></div>
                    <div className="flex flex-col flex-1 text-center items-center">
                      <div className="h-5 w-3/4 bg-brand-charcoal mb-2 rounded-sm"></div>
                      <div className="h-4 w-1/4 bg-brand-charcoal mb-3 rounded-sm"></div>
                      <div className="h-3 w-1/2 bg-brand-charcoal mb-6 rounded-sm"></div>
                    </div>
                  </motion.div>
                ))
              ) : filteredProducts.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-20 text-brand-white/50 font-serif text-xl">
                  No products found.
                </motion.div>
              ) : (
                filteredProducts.map((product) => (
                  <motion.div layout key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="group flex flex-col h-full">
                    <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] bg-brand-charcoal mb-8 overflow-hidden group-hover:opacity-90 transition-opacity duration-500 rounded-sm border border-brand-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                        {product.categories.filter((c:any) => c && c !== 'Men' && c !== 'Women').map((category: string) => (
                          <span key={category} className="text-brand-white text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10">
                            {category}
                          </span>
                        ))}
                      </div>

                      <button 
                        className={`absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-75 ${wishlistItems.includes(String(product.id)) ? 'text-brand-gold opacity-100' : 'text-brand-white drop-shadow-md opacity-0 group-hover:opacity-100 hover:text-brand-gold'}`}
                        onClick={(e) => handleToggleWishlist(e, product)}
                        aria-label="Toggle wishlist"
                      >
                        <Heart className="w-4 h-4" fill={wishlistItems.includes(String(product.id)) ? "currentColor" : "none"} />
                      </button>

                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${product.hoverImage && product.hoverImage !== product.image ? 'opacity-100 group-hover:opacity-0' : 'group-hover:scale-105'}`} />
                      {product.hoverImage && product.hoverImage !== product.image && (
                        <img src={product.hoverImage} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100" />
                      )}
                    </Link>

                    <div className="flex flex-col flex-1 text-center px-4">
                      <Link to={`/product/${product.id}`} className="block">
                        <h3 className="font-serif text-[20px] tracking-wide font-light mb-1.5 text-brand-white group-hover:text-brand-gold transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-brand-white/50 mb-3 font-medium">{product.notes}</p>
                      <div className="flex justify-center items-center gap-3 mb-5 mt-auto">
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
                            addToCart({ id: String(product.id), name: product.name, price: product.price, compareAtPrice: product.compareAtPrice, image: product.image, quantity: 1 });
                            setIsCartOpen(true);
                            setAddedProducts(prev => new Set(prev).add(product.id));
                            setTimeout(() => setAddedProducts(prev => { const next = new Set(prev); next.delete(product.id); return next; }), 2000);
                            setToastMessage('Added to Bag');
                            setTimeout(() => setToastMessage(null), 3000);
                          }}
                          disabled={addedProducts.has(product.id)}
                          className="w-full bg-transparent border border-brand-white/20 text-brand-white py-3.5 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-500 hover:bg-brand-white hover:text-brand-white disabled:bg-brand-gold disabled:border-brand-gold flex items-center justify-center gap-2 rounded-full"
                        >
                          {addedProducts.has(product.id) ? (
                            <><Check className="w-3.5 h-3.5" /> Added</>
                          ) : (
                            <span>Add to Bag</span>
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
      </div>
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} className="fixed bottom-8 left-1/2 z-50 bg-brand-charcoal border border-brand-white/10 text-brand-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 rounded-full backdrop-blur-md">
            {toastMessage === 'Added to Bag' ? <ShoppingBag className="w-5 h-5 text-brand-gold" /> : <Heart className="w-5 h-5" />}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

