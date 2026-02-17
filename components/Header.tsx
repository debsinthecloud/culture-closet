
import React from 'react';
import { Page, Currency, User } from '../types';
import { CURRENCIES } from '../services/currencyService';

interface HeaderProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  cartCount: number;
  onOpenCart: () => void;
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  isScrolled?: boolean;
  user: User | null;
  onOpenAuth: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  setPage, 
  cartCount, 
  onOpenCart, 
  selectedCurrency, 
  onCurrencyChange,
  isScrolled = false,
  user,
  onOpenAuth
}) => {
  return (
    <header className={`sticky top-0 z-40 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-lg border-b border-emerald-50 shadow-md py-0' 
        : 'bg-white/95 backdrop-blur-md border-b border-emerald-100 py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`}>
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => setPage('home')}
          >
            <div className={`bg-emerald-100 text-emerald-900 flex items-center justify-center rounded-lg font-serif transition-all duration-500 mr-3 border border-emerald-200 ${
              isScrolled ? 'w-8 h-8 text-xl' : 'w-10 h-10 text-2xl group-hover:scale-110'
            }`}>C</div>
            <span className={`font-bold tracking-[0.2em] text-emerald-950 uppercase font-serif transition-all duration-500 ${
              isScrolled ? 'text-lg' : 'text-xl'
            }`}>Culture Closet</span>
          </div>

          <nav className="hidden md:flex space-x-10">
            {['home', 'shop'].map((page) => (
              <button
                key={page}
                onClick={() => setPage(page as Page)}
                className={`text-xs font-bold tracking-widest transition-all hover:text-emerald-700 relative py-2 ${
                  currentPage === page ? 'text-emerald-900' : 'text-stone-400'
                }`}
              >
                {page.toUpperCase()}
                {currentPage === page && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative group hidden sm:block">
              <select 
                value={selectedCurrency.code}
                onChange={(e) => {
                  const curr = CURRENCIES.find(c => c.code === e.target.value);
                  if (curr) onCurrencyChange(curr);
                }}
                className={`bg-transparent font-bold tracking-widest text-emerald-900 border-none focus:ring-0 cursor-pointer appearance-none pr-4 uppercase transition-all duration-500 ${
                  isScrolled ? 'text-[9px]' : 'text-[10px]'
                }`}
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-2 w-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>

            <button 
              onClick={() => user ? setPage('account') : onOpenAuth()}
              className="group flex items-center gap-2 text-stone-400 hover:text-emerald-900 transition-colors p-2"
            >
              <svg className={`transition-all duration-500 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {user && <span className="text-[10px] font-bold tracking-widest uppercase hidden lg:inline">{user.name.split(' ')[0]}</span>}
            </button>

            <button 
              onClick={onOpenCart}
              className="relative group p-2 text-stone-400 hover:text-emerald-900 transition-colors"
            >
              <svg className={`transition-all duration-500 ${isScrolled ? 'h-5 w-5' : 'h-6 w-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className={`absolute top-0 right-0 inline-flex items-center justify-center font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-500 rounded-full shadow-lg transition-all duration-500 ${
                  isScrolled ? 'px-1 py-0.5 text-[8px]' : 'px-1.5 py-0.5 text-[10px]'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
