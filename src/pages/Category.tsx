import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Category() {
  const { categoryId } = useParams();
  const categoryName = categoryId ? categoryId.replace(/-/g, ' ') : 'Category';

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/products')
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            return {};
          }
          if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);
        const text = await res.text();
        if (text.includes("Cookie check") || text.includes("Action required") || text.startsWith("<")) {
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
          const filtered = data.filter(p => p.category && typeof p.category === 'string' && p.category.trim().toLowerCase() === categoryName.trim().toLowerCase());
          setDbProducts(filtered);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [categoryName]);

  const products = dbProducts.map(p => ({
    id: p._id,
    name: p.name,
    category: p.category || "Fragrance",
    price: p.price,
    image: p.image || "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
    images: p.images || []
  }));

  return (
    <>
      <Helmet>
        <title>{`${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} | AMR - FRAGRANCES`}</title>
        <meta name="description" content={`Discover our curated collection of fragrances for ${categoryName}.`} />
      </Helmet>
      <div className="pt-32 pb-24 min-h-screen bg-brand-charcoal text-brand-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          <div className="mb-16 border-b border-brand-white/10 pb-12 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif font-light text-brand-white mb-6 capitalize">{categoryName}</h1>
            <p className="text-brand-white/60 text-sm leading-relaxed tracking-wide">
              Discover our curated collection. Elevate your everyday with notes that linger long after you leave.
            </p>
          </div>

        {!isLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-16 h-16 border border-brand-gold/30 rounded-full flex items-center justify-center mb-6">
                <span className="text-brand-gold font-serif text-2xl">?</span>
             </div>
             <h2 className="text-2xl font-serif text-brand-white mb-4">Coming Soon</h2>
             <p className="text-brand-white/50 max-w-md mx-auto mb-8 font-light leading-relaxed">
               We are currently curating the perfect collection for {categoryName}. Check back soon to discover our newest olfactory creations.
             </p>
             <Link 
               to="/collections" 
               className="px-8 py-3.5 border border-brand-gold text-brand-gold text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-brand-gold hover:text-brand-white transition-colors rounded-full"
             >
               Explore Other Collections
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col h-full cursor-pointer">
                <div className="relative block aspect-[4/5] bg-brand-black mb-6 overflow-hidden group-hover:opacity-90 transition-opacity duration-500 rounded-sm border border-brand-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${product.images && product.images.length > 1 ? 'opacity-100 group-hover:opacity-0' : 'group-hover:scale-105'}`}
                  />
                  
                  {product.images && product.images.length > 1 && (
                    <img
                      src={product.images[1]}
                      alt={`${product.name} alternate view`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
                    />
                  )}
                </div>
                <div className="flex flex-col flex-1 text-center px-4">
                  <h3 className="font-serif text-[20px] tracking-wide font-light mb-1.5 transition-colors duration-300 group-hover:text-brand-gold text-brand-white">{product.name}</h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-brand-white/40 mb-3 block font-medium">{product.category}</span>
                  <p className="text-[13px] text-brand-gold font-medium tracking-wider mt-auto pt-2">Rs. {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
