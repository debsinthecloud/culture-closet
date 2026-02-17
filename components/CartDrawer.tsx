
import React from 'react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../services/currencyService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
  currency: Currency;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onCheckout, currency }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="px-6 py-6 bg-emerald-50 sm:px-6 flex justify-between items-center border-b border-emerald-100">
            <h2 className="text-xl font-serif font-bold text-emerald-950 uppercase tracking-widest">Your Bag</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-emerald-950 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6 custom-scrollbar">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-12">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                   <svg className="h-10 w-10 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                   </svg>
                </div>
                <p className="text-emerald-900/60 font-medium">Your wardrobe is waiting for its first heritage piece.</p>
                <button 
                  onClick={onClose}
                  className="mt-6 text-emerald-900 font-bold text-xs tracking-widest uppercase hover:text-emerald-600 transition-colors underline decoration-emerald-200 underline-offset-8"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-6 pb-6 border-b border-stone-50 last:border-0">
                    <img src={item.image} alt={item.name} className="h-32 w-24 object-cover rounded-xl bg-stone-50 shadow-sm" />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-tight leading-tight">{item.name}</h3>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{item.selectedColor} — {item.selectedSize}</p>
                        </div>
                        <p className="text-sm font-medium text-emerald-900">{formatPrice(item.price * item.quantity, currency)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4">
                        <div className="flex items-center border border-emerald-100 rounded-lg overflow-hidden h-10">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-3 hover:bg-emerald-50 text-emerald-900 transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >—</button>
                          <span className="px-4 text-xs font-bold text-emerald-950">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-3 hover:bg-emerald-50 text-emerald-900 transition-colors"
                          >+</button>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-[10px] font-bold text-stone-400 hover:text-emerald-600 uppercase tracking-widest transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-emerald-100 py-8 px-8 bg-emerald-50/30">
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-xs tracking-widest text-emerald-800 font-bold uppercase">
                  <span>Subtotal</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium italic">Complimentary shipping on orders over $500.</p>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full flex justify-center items-center py-5 border border-transparent rounded-2xl shadow-xl text-xs font-bold tracking-widest text-white bg-emerald-950 hover:bg-emerald-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
