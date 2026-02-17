
import React, { useState } from 'react';
import { User, Product, Currency } from '../types';
import { PRODUCTS } from '../constants';
import { formatPrice } from '../services/currencyService';
import ProductCard from './ProductCard';

interface AccountProps {
  user: User;
  onLogout: () => void;
  currency: Currency;
  onNavigateToProduct: (product: Product) => void;
}

const Account: React.FC<AccountProps> = ({ user, onLogout, currency, onNavigateToProduct }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  const wishlistProducts = PRODUCTS.filter(p => user.wishlist.includes(p.id));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Shipped': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-stone-600 bg-stone-50 border-stone-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-emerald-100 pb-8">
        <div>
          <span className="text-emerald-600 font-bold tracking-[0.3em] text-[10px] mb-4 block uppercase">The Inner Circle</span>
          <h1 className="text-5xl font-serif font-bold text-emerald-950">Hello, {user.name}</h1>
          <p className="mt-4 text-emerald-800/60 text-lg font-light">Managing your heritage collection.</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-[10px] font-bold text-stone-400 hover:text-red-500 uppercase tracking-widest transition-colors border border-stone-100 px-6 py-3 rounded-full"
        >
          Sign Out
        </button>
      </div>

      <div className="flex gap-8 mb-12 overflow-x-auto pb-4 no-scrollbar">
        {['orders', 'wishlist', 'profile'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`text-xs font-bold tracking-widest transition-all uppercase whitespace-nowrap px-8 py-3 rounded-full border ${
              activeTab === tab 
                ? 'bg-emerald-100 border-emerald-200 text-emerald-950' 
                : 'bg-white border-stone-100 text-stone-400 hover:border-emerald-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'orders' && (
          <div className="space-y-12">
            {user.orders.length === 0 ? (
              <div className="text-center py-20 bg-emerald-50/30 rounded-[40px] border border-emerald-100 border-dashed">
                <p className="text-emerald-900/40 font-medium">No order history found. Your archive awaits.</p>
              </div>
            ) : (
              user.orders.map((order) => (
                <div key={order.id} className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-10">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-1">Order #{order.id}</p>
                      <p className="text-sm text-stone-400 font-medium">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-serif font-bold text-emerald-950">{formatPrice(order.total, currency)}</p>
                      <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status || 'Delivered')}`}>
                        {order.status || 'Delivered'}
                      </div>
                    </div>
                  </div>

                  {/* Tracking Visualizer */}
                  <div className="mb-10 p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">Live Progress</h4>
                      {order.trackingLink && (
                        <a 
                          href={order.trackingLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] text-emerald-600 font-bold underline underline-offset-4 hover:text-emerald-950 transition-colors"
                        >
                          OPEN FULL TRACKING
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-white rounded-full relative overflow-hidden border border-emerald-100/50 shadow-inner">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                          style={{ 
                            width: (order.status === 'Processing' ? '33.3%' : 
                                   order.status === 'Shipped' ? '66.6%' : '100%') 
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest whitespace-nowrap min-w-[80px] text-right">
                        {order.status === 'Delivered' ? 'Finalized' : 'In Transit'}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                       <span className={`text-[8px] font-bold uppercase tracking-tighter ${order.status === 'Processing' ? 'text-emerald-600' : 'text-stone-300'}`}>01. Processing</span>
                       <span className={`text-[8px] font-bold uppercase tracking-tighter ${order.status === 'Shipped' ? 'text-emerald-600' : 'text-stone-300'}`}>02. Shipped</span>
                       <span className={`text-[8px] font-bold uppercase tracking-tighter ${order.status === 'Delivered' ? 'text-emerald-600' : 'text-stone-300'}`}>03. Delivered</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 pt-6 border-t border-emerald-50">
                    {order.items.map((item, i) => (
                      <div key={i} className="space-y-3 group cursor-pointer" onClick={() => onNavigateToProduct(item)}>
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm ring-1 ring-emerald-50 group-hover:ring-emerald-200 transition-all">
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="px-1">
                           <p className="text-[10px] font-bold text-emerald-950 truncate uppercase leading-tight">{item.name}</p>
                           <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-1">{item.selectedSize} / {item.selectedColor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {wishlistProducts.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-emerald-50/30 rounded-[40px] border border-emerald-100 border-dashed">
                <p className="text-emerald-900/40 font-medium">Your wishlist is empty. Explore the archive to find your next piece.</p>
              </div>
            ) : (
              wishlistProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  currency={currency}
                  user={user}
                  onClick={onNavigateToProduct}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-xl space-y-8">
            <div className="grid grid-cols-2 gap-8 p-10 bg-emerald-50/30 rounded-[40px] border border-emerald-100">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Full Name</p>
                  <p className="text-lg font-serif text-emerald-950">{user.name}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-lg font-serif text-emerald-950">{user.email}</p>
               </div>
               <div className="space-y-1 col-span-2">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Member Since</p>
                  <p className="text-lg font-serif text-emerald-950">January 2024</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
