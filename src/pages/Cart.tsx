import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, subtotal, updateQuantity, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center justify-center">
        <Helmet>
          <title>Cart | AMR - FRAGRANCES</title>
        </Helmet>
        <h1 className="text-3xl font-serif mb-6 text-brand-white">Your Cart is Empty</h1>
        <p className="text-brand-white/60 mb-8 max-w-md text-center leading-relaxed">
          Looks like you haven't added anything to your cart yet. Discover our collection of luxury fragrances.
        </p>
        <Link to="/" className="bg-brand-black text-brand-white px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-zinc-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 bg-brand-charcoal">
      <Helmet>
        <title>Cart | AMR - FRAGRANCES</title>
      </Helmet>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <h1 className="text-3xl md:text-5xl font-serif mb-12 text-brand-white">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-8 flex flex-col space-y-8">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6 pb-8 border-b border-brand-white/10 relative">
                <Link to={`/product/${item.id}`} className="shrink-0 group">
                  <div className="w-24 h-32 md:w-32 md:h-40 overflow-hidden bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                </Link>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start pr-8">
                    <div>
                      <h3 className="font-medium text-base mb-1 hover:text-brand-white/70 transition-colors">
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                      {item.category && (
                        <p className="text-sm text-brand-white/60 capitalize mb-2">{item.category}</p>
                      )}
                      {item.selectedSize && (
                        <p className="text-sm text-brand-white/60">Size: {item.selectedSize}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {item.compareAtPrice ? (
                        <>
                          <span className="font-serif text-lg text-red-700">Rs. {item.price.toFixed(2)}</span>
                          <span className="text-sm text-brand-white/40 line-through">Rs. {item.compareAtPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-serif text-lg">Rs. {item.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center justify-between mt-auto">
                    </div>
                  </div>
                </div>

                <div className="flexitems-center"></div>

                <div className="absolute bottom-6 right-0 border border-brand-white/20 flex items-center">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1.5 hover:bg-brand-black/5"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 hover:bg-brand-black/5"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-2 right-0 p-2 text-brand-white/40 hover:text-brand-white transition-colors"
                  aria-label="Remove item"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-brand-white p-8 sticky top-32">
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-8 border-b border-brand-white/10 pb-6">
                <div className="flex justify-between">
                  <span className="text-brand-white/60">Subtotal</span>
                  <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-white/60">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-medium">Total (PKR)</span>
                <span className="font-serif text-2xl">Rs. {subtotal.toFixed(2)}</span>
              </div>
              
              <Link
                to="/checkout"
                className="group w-full flex items-center justify-between bg-brand-black text-brand-white px-8 py-5 hover:bg-zinc-800 transition-colors"
              >
                <span className="text-[11px] uppercase tracking-[0.15em] font-medium">Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
