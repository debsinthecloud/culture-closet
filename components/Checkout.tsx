
import React, { useState } from 'react';
import { CartItem, Currency, User } from '../types';
import { formatPrice } from '../services/currencyService';
import { userService } from '../services/userService';

interface CheckoutProps {
  items: CartItem[];
  onComplete: () => void;
  onBack: () => void;
  currency: Currency;
  user: User | null;
}

type PaymentMethod = 'card' | 'bank' | 'apple_pay' | 'transfer';

const Checkout: React.FC<CheckoutProps> = ({ items, onComplete, onBack, currency, user }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 25; // USD
  const total = subtotal + shipping;

  const [step, setStep] = useState<'info' | 'payment' | 'processing' | 'success'>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setIsProcessing(true);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    if (user) {
      userService.addOrder({
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        date: new Date().toISOString(),
        items: [...items],
        total: total,
        currency: currency.code,
        status: 'Processing',
        trackingLink: `https://track.culturecloset.ng/${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      });
    }

    setIsProcessing(false);
    setStep('success');
    
    // Auto-navigate home after a delay or let user click
    setTimeout(() => {
      onComplete();
    }, 5000);
  };

  if (step === 'processing') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-emerald-950 mb-2">Authenticating Transaction</h2>
          <p className="text-emerald-800/60 text-sm tracking-widest uppercase font-bold">Securing your heritage piece...</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-in zoom-in fade-in duration-700">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-4">Payment Successful</h2>
          <p className="text-emerald-800/60 leading-relaxed mb-8">
            Thank you for your acquisition. A confirmation email has been sent to your inbox. Your archive is growing.
          </p>
          <button 
            onClick={onComplete}
            className="bg-emerald-950 text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all shadow-xl"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Form Section */}
        <div className="lg:col-span-7 space-y-12">
          <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.3em] text-emerald-900 mb-8 uppercase">
            <span className={step === 'info' ? 'text-emerald-950 border-b-2 border-emerald-600 pb-1' : 'text-stone-300'}>01 Delivery</span>
            <span className="text-stone-300">/</span>
            <span className={step === 'payment' ? 'text-emerald-950 border-b-2 border-emerald-600 pb-1' : 'text-stone-300'}>02 Payment</span>
          </div>

          {step === 'info' ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-left duration-500">
              <div className="space-y-2">
                <h2 className="text-4xl font-serif font-bold text-emerald-950">Where shall we send it?</h2>
                <p className="text-emerald-800/60 text-sm">International shipping via our global concierge partners.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">First Name</label>
                  <input type="text" required className="w-full border-b border-emerald-100 py-3 bg-transparent focus:border-emerald-500 outline-none text-sm transition-all" />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input type="text" required className="w-full border-b border-emerald-100 py-3 bg-transparent focus:border-emerald-500 outline-none text-sm transition-all" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Email for Archive Tracking</label>
                  <input type="email" required defaultValue={user?.email || ''} className="w-full border-b border-emerald-100 py-3 bg-transparent focus:border-emerald-500 outline-none text-sm transition-all" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Street Address</label>
                  <input type="text" required className="w-full border-b border-emerald-100 py-3 bg-transparent focus:border-emerald-500 outline-none text-sm transition-all" />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">City</label>
                  <input type="text" required className="w-full border-b border-emerald-100 py-3 bg-transparent focus:border-emerald-500 outline-none text-sm transition-all" />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Postal Code</label>
                  <input type="text" required className="w-full border-b border-emerald-100 py-3 bg-transparent focus:border-emerald-500 outline-none text-sm transition-all" />
                </div>
              </div>
              <button 
                onClick={() => setStep('payment')}
                className="w-full bg-emerald-950 text-white py-6 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all shadow-2xl group"
              >
                Continue to Secure Payment
                <svg className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M3 12h18"/></svg>
              </button>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
              <div className="space-y-2">
                <h2 className="text-4xl font-serif font-bold text-emerald-950">Payment Method</h2>
                <p className="text-emerald-800/60 text-sm">Secure, encrypted transactions for your peace of mind.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-6 border rounded-2xl flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-emerald-100 bg-white hover:border-emerald-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-6 bg-stone-100 rounded flex items-center justify-center"><span className="text-[8px] font-bold text-stone-400">VISA</span></div>
                    <span className="text-sm font-bold text-emerald-950">Credit / Debit Card</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-emerald-600' : 'border-stone-200'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                  </div>
                </button>

                {paymentMethod === 'card' && (
                  <div className="p-8 space-y-6 bg-emerald-50/30 rounded-3xl border border-emerald-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full border-b border-emerald-100 py-3 bg-transparent focus:border-emerald-500 outline-none text-sm transition-all font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full border-b border-emerald-100 py-3 bg-transparent focus:border-emerald-500 outline-none text-sm transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Security Code</label>
                        <input type="text" placeholder="CVV" className="w-full border-b border-emerald-100 py-3 bg-transparent focus:border-emerald-500 outline-none text-sm transition-all" />
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-6 border rounded-2xl flex items-center justify-between transition-all ${paymentMethod === 'apple_pay' ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-emerald-100 bg-white hover:border-emerald-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-10 h-5" viewBox="0 0 44 18" fill="currentColor"><path d="M3.7 15.5c-.8 0-1.6-.3-2.2-.9-.6-.6-.9-1.4-.9-2.2V3.7c0-.8.3-1.6.9-2.2C2.1.9 2.9.6 3.7.6h11.2c.8 0 1.6.3 2.2.9.6.6.9 1.4.9 2.2v8.7c0 .8-.3 1.6-.9 2.2-.6.6-1.4.9-2.2.9H3.7zM14.9 2.2H3.7c-.4 0-.8.1-1.1.4-.3.3-.4.7-.4 1.1v8.7c0 .4.1.8.4 1.1.3.3.7.4 1.1.4h11.2c.4 0 .8-.1 1.1-.4.3-.3.4-.7.4-1.1V3.7c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4z"/></svg>
                    <span className="text-sm font-bold text-emerald-950">Apple Pay</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'apple_pay' ? 'border-emerald-600' : 'border-stone-200'}`}>
                    {paymentMethod === 'apple_pay' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-6 border rounded-2xl flex items-center justify-between transition-all ${paymentMethod === 'transfer' ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-emerald-100 bg-white hover:border-emerald-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-10 h-6 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    <span className="text-sm font-bold text-emerald-950">Bank Transfer / Paystack</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-emerald-600' : 'border-stone-200'}`}>
                    {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                  </div>
                </button>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep('info')}
                  className="flex-1 border-2 border-emerald-950 text-emerald-950 py-5 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-emerald-50 transition-all"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-emerald-950 text-white py-5 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all shadow-xl"
                >
                  Confirm Acquisition — {formatPrice(total, currency)}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Summary Section */}
        <div className="lg:col-span-5">
          <div className="bg-emerald-50/30 p-10 rounded-[40px] border border-emerald-100 sticky top-32">
            <h3 className="text-2xl font-serif font-bold text-emerald-950 mb-8 pb-6 border-b border-emerald-100">Order Summary</h3>
            <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="relative w-20 h-24 overflow-hidden rounded-xl shadow-sm bg-white ring-1 ring-emerald-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-bold text-emerald-950 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{item.selectedSize} — {item.selectedColor}</p>
                    <div className="flex justify-between items-center pt-2">
                       <p className="text-xs font-medium text-stone-400">Qty: {item.quantity}</p>
                       <p className="text-sm font-bold text-emerald-900">{formatPrice(item.price * item.quantity, currency)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-8 border-t border-emerald-100">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-800/60 font-medium">Subtotal</span>
                <span className="text-emerald-950 font-bold">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-800/60 font-medium">Concierge Shipping</span>
                <span className="text-emerald-950 font-bold">{formatPrice(shipping, currency)}</span>
              </div>
              <div className="flex justify-between text-2xl font-serif font-bold text-emerald-950 pt-6 mt-4 border-t border-emerald-100">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(total, currency)}</span>
              </div>
            </div>

            <div className="mt-10 p-4 bg-white/50 rounded-2xl border border-emerald-100 flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
               </div>
               <p className="text-[10px] font-bold text-emerald-950 uppercase tracking-widest leading-relaxed">
                  Secured by Heritage Shield™ Encryption
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
