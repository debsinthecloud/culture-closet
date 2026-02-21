import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import StylistAssistant from './components/StylistAssistant';
import Checkout from './components/Checkout';
import Contact from './components/Contact';
import Shipping from './components/Shipping';
import Account from './components/Account';
import AuthModal from './components/AuthModal';
import { PRODUCTS } from './constants';
import { Product, CartItem, Page, Currency, User } from './types';
import { CURRENCIES, formatPrice } from './services/currencyService';
import { userService } from './services/userService';

const INSTAGRAM_POSTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600', likes: '1.2k', comments: '45' },
  { id: 2, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600', likes: '890', comments: '12' },
  { id: 3, image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=600', likes: '2.4k', comments: '102' },
  { id: 4, image: 'https://images.unsplash.com/photo-1539109132314-d07050965750?auto=format&fit=crop&q=80&w=600', likes: '1.5k', comments: '67' },
  { id: 5, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600', likes: '3.1k', comments: '154' },
  { id: 6, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600', likes: '940', comments: '38' },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // User Authentication State
  const [user, setUser] = useState<User | null>(userService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
// This is your new "shelf" for live dresses from the database
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function getDresses() {
      const { data } = await supabase.from('products').select('*');
      
      if (data) {
        // This converts the database items into the format your website understands
        const formatted = data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          price: Number(item.price),
          description: item.description,
          image: Array.isArray(item.image_url) ? item.image_url[0] : item.image_url,
          category: item.category || 'New Arrival'
        }));
        setDbProducts(formatted);
      }
    }
    getDresses();
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'shop', 'checkout', 'contact', 'shipping', 'account'].includes(hash)) {
        setCurrentPage(hash as Page);
      }
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('scroll', handleScroll);
    
    handleHash();
    handleScroll();

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navigate = (page: Page) => {
    window.location.hash = page;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product, size: string, color: string) => {
    if (product.stockCount === 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleToggleWishlist = (productId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const updatedUser = userService.toggleWishlist(productId);
    setUser(updatedUser);
  };

  const filteredProducts = activeCategory === 'All' 
    ? dbProducts  // Change this from PRODUCTS
    : dbProducts.filter(p => p.category === activeCategory); // Change this from PRODUCTS

  const renderHome = () => (
    <div className="space-y-20 pb-20">
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-emerald-50">
        <img 
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=2000" 
          alt="Cultural Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-emerald-700 font-bold tracking-[0.5em] text-xs mb-6 block animate-in fade-in slide-in-from-bottom duration-500 uppercase">Tradition Redefined</span>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-emerald-950 mb-8 animate-in fade-in slide-in-from-top duration-700 leading-[1.1]">
            Heritage in <br/>Every Stitch
          </h1>
          <p className="text-lg md:text-xl text-emerald-800/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom duration-1000">
            Discover a curated archive of contemporary African fashion. Premium fabrics meet modern tailoring for the global individual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('shop')}
              className="bg-emerald-950 text-white px-10 py-5 rounded-full font-bold text-sm tracking-widest hover:bg-emerald-800 transition-all hover:scale-105 shadow-2xl uppercase"
            >
              Shop Collection
            </button>
            <button className="text-emerald-900 border border-emerald-200 bg-white/50 backdrop-blur-md px-10 py-5 rounded-full font-bold text-sm tracking-widest hover:bg-emerald-100 transition-all uppercase">
              The Lookbook
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 border-l-4 border-emerald-200 pl-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-emerald-950">New Traditions</h2>
            <p className="text-emerald-800/60 mt-2 text-lg">Our latest drop of artisanal masterpieces.</p>
          </div>
          <button onClick={() => navigate('shop')} className="text-emerald-800 font-bold text-sm tracking-widest hover:text-emerald-600 transition-all border-b-2 border-emerald-200 pb-1 uppercase">
            VIEW FULL COLLECTION
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {dbProducts.slice(0, 3).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              currency={currency}
              user={user}
              onToggleWishlist={handleToggleWishlist}
              onClick={(p) => {
                setSelectedProduct(p);
                setCurrentPage('product');
              }} 
            />
          ))}
        </div>
      </section>

      <section className="bg-emerald-50 text-emerald-950 py-24 overflow-hidden relative border-y border-emerald-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-100/30 skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-emerald-600 font-bold tracking-[0.3em] text-xs mb-4 block uppercase">Our Craft</span>
            <h2 className="text-5xl font-serif font-bold mb-8">Where Storytelling <br/>Meets Style</h2>
            <p className="text-emerald-800/80 text-lg leading-relaxed mb-8 font-light">
              At Culture Closet, we don't just sell clothes. We preserve history. Every pattern is a proverb, and every weave is a legacy, transformed for the modern world.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-serif font-bold text-emerald-900 mb-2">100%</h4>
                <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest">Ethical Sourcing</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Artisan</h4>
                <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest">Hand-finished</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-w-4 aspect-h-5 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img src="https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800" alt="Artisan detail" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 space-y-4">
          <span className="text-emerald-600 font-bold tracking-[0.3em] text-[10px] uppercase block">Community & Lifestyle</span>
          <h2 className="text-4xl font-serif font-bold text-emerald-950">Follow the Story</h2>
          <p className="text-emerald-800/40 text-sm tracking-widest font-bold uppercase cursor-pointer hover:text-emerald-900 transition-colors">@culturecloset.ng</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {INSTAGRAM_POSTS.map((post) => (
            <div key={post.id} className="relative group aspect-square overflow-hidden bg-emerald-50 cursor-pointer">
              <img src={post.image} alt="Instagram content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 text-white">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      <span className="text-xs font-bold">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
                      <span className="text-xs font-bold">{post.comments}</span>
                    </div>
                 </div>
                 <span className="text-[8px] font-bold tracking-[0.2em] uppercase mt-2">Shop This Look</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
           <button className="bg-white border-2 border-emerald-950 text-emerald-950 px-10 py-4 rounded-full font-bold text-xs tracking-widest hover:bg-emerald-950 hover:text-white transition-all uppercase">
              Join the Conversation
           </button>
        </div>
      </section>
    </div>
  );

  const renderShop = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-serif font-bold text-emerald-950">The Archive</h1>
          <p className="text-emerald-800/60 mt-3 text-lg">Curating the finest in contemporary cultural wear.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {['All', 'Apparel', 'Accessories', 'New Arrivals'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all ${
                activeCategory === cat 
                  ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300 shadow-sm' 
                  : 'bg-white text-emerald-900 border border-emerald-100 hover:border-emerald-300'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            currency={currency}
            user={user}
            onToggleWishlist={handleToggleWishlist}
            onClick={(p) => {
              setSelectedProduct(p);
              setCurrentPage('product');
            }} 
          />
        ))}
      </div>
    </div>
  );

  const renderProduct = () => {
    if (!selectedProduct) {
      navigate('shop');
      return null;
    }

    const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]);
    const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[0]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const productViews = [
      selectedProduct.image,
      `${selectedProduct.image}&sig=view1`,
      `${selectedProduct.image}&sig=view2`,
      `${selectedProduct.image}&sig=view3`,
    ];

    const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % productViews.length);
    const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + productViews.length) % productViews.length);

    const getStockStatus = (count: number) => {
      if (count === 0) return { label: 'Sold Out', color: 'text-stone-500 bg-stone-50 border-stone-200' };
      if (count < 5) return { label: 'Limited Stock', color: 'text-amber-600 bg-amber-50 border-amber-200 pulse-animation' };
      return { label: 'Available', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    };

    const stock = getStockStatus(selectedProduct.stockCount);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-700">
        <button onClick={() => navigate('shop')} className="mb-12 text-stone-400 hover:text-emerald-950 flex items-center gap-3 transition-colors font-bold text-xs tracking-widest group">
          <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          BACK TO ARCHIVE
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-6">
            <div className="relative aspect-w-4 aspect-h-5 rounded-[40px] overflow-hidden bg-emerald-50 shadow-2xl border border-emerald-100 group/carousel">
              <img 
                src={productViews[activeImageIndex]} 
                alt={`${selectedProduct.name} - View ${activeImageIndex + 1}`} 
                className={`w-full h-full object-cover transition-all duration-700 ${selectedProduct.stockCount === 0 ? 'grayscale opacity-60' : ''}`}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-emerald-900 hover:bg-white transition-all active:scale-90"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-emerald-900 hover:bg-white transition-all active:scale-90"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {productViews.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all duration-300 ${activeImageIndex === i ? 'w-8 bg-white shadow-sm' : 'w-2 bg-white/40'}`} />)}
              </div>
              <button 
                onClick={() => handleToggleWishlist(selectedProduct.id)}
                className={`absolute top-8 right-8 p-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${user?.wishlist.includes(selectedProduct.id) ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-900 hover:scale-110'}`}
              >
                <svg className={`h-6 w-6 ${user?.wishlist.includes(selectedProduct.id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productViews.map((view, i) => (
                <button key={i} onClick={() => setActiveImageIndex(i)} className={`aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden bg-emerald-50 cursor-pointer transition-all border-2 ${activeImageIndex === i ? 'border-emerald-600 scale-95 shadow-lg ring-4 ring-emerald-50' : 'border-emerald-50 opacity-60 hover:opacity-100'}`}><img src={view} alt={`View ${i + 1}`} className="w-full h-full object-cover" /></button>
              ))}
            </div>
          </div>

          <div className="space-y-10 py-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-emerald-600 font-bold tracking-[0.2em] text-xs uppercase">{selectedProduct.category}</span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${stock.color}`}>
                  {stock.label}
                </span>
              </div>
              <h1 className={`text-5xl font-serif font-bold mb-4 leading-tight ${selectedProduct.stockCount === 0 ? 'text-stone-300' : 'text-emerald-950'}`}>
                {selectedProduct.name}
              </h1>
              <div className="flex items-center gap-4">
                <p className={`text-3xl font-light ${selectedProduct.stockCount === 0 ? 'text-stone-300' : 'text-emerald-900'}`}>
                  {formatPrice(selectedProduct.price, currency)}
                </p>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Artisanal Archive</span>
              </div>
            </div>
            
            <p className={`leading-relaxed text-lg font-light ${selectedProduct.stockCount === 0 ? 'text-stone-300' : 'text-emerald-800/70'}`}>
              {selectedProduct.description}
            </p>

            <div className={`space-y-8 ${selectedProduct.stockCount === 0 ? 'opacity-30 pointer-events-none' : ''}`}>
              <div><h3 className="text-xs font-bold text-emerald-950 mb-4 tracking-widest uppercase">Color Palette</h3><div className="flex gap-4">{selectedProduct.colors.map(color => (<button key={color} onClick={() => setSelectedColor(color)} className={`w-12 h-12 rounded-full border-2 transition-all p-1 ${selectedColor === color ? 'border-emerald-600' : 'border-transparent'}`}><div className="w-full h-full rounded-full bg-emerald-50 shadow-inner" style={{ backgroundColor: color.includes('/') ? color.split('/')[0].toLowerCase() : color.toLowerCase() }} /></button>))}</div></div>
              <div><h3 className="text-xs font-bold text-emerald-950 mb-4 tracking-widest uppercase">Select Size</h3><div className="flex flex-wrap gap-3">{selectedProduct.sizes.map(size => (<button key={size} onClick={() => setSelectedSize(size)} className={`min-w-[60px] h-12 border-2 rounded-xl text-xs font-bold tracking-widest transition-all ${selectedSize === size ? 'border-emerald-500 bg-emerald-100 text-emerald-900 shadow-sm' : 'border-stone-100 text-stone-400 hover:border-emerald-200'}`}>{size}</button>))}</div></div>
            </div>

            <button 
              disabled={selectedProduct.stockCount === 0}
              onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)} 
              className={`w-full py-6 px-8 rounded-2xl font-bold text-sm tracking-[0.2em] transition-all transform flex items-center justify-center gap-4 uppercase shadow-2xl ${
                selectedProduct.stockCount === 0 
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none' 
                  : 'bg-emerald-950 text-white hover:bg-emerald-900 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {selectedProduct.stockCount === 0 ? (
                'Sold Out'
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Add to Shopping Bag
                </>
              )}
            </button>
            
            {selectedProduct.stockCount > 0 && selectedProduct.stockCount < 5 && (
              <p className="text-center text-[10px] font-bold text-amber-600 uppercase tracking-widest animate-pulse">
                Hurry! Only {selectedProduct.stockCount} items left in stock.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-emerald-100 selection:text-emerald-950">
      <Header 
        currentPage={currentPage} 
        setPage={navigate} 
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCurrency={currency}
        onCurrencyChange={setCurrency}
        isScrolled={isScrolled}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-grow">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'shop' && renderShop()}
        {currentPage === 'product' && renderProduct()}
        {currentPage === 'account' && user && (
          <Account 
            user={user} 
            currency={currency} 
            onLogout={() => { userService.logout(); setUser(null); navigate('home'); }} 
            onNavigateToProduct={(p) => { setSelectedProduct(p); navigate('product'); }}
          />
        )}
        {currentPage === 'checkout' && (
          <Checkout 
            items={cart} 
            currency={currency}
            user={user}
            onBack={() => navigate('shop')} 
            onComplete={() => { setUser(userService.getCurrentUser()); setCart([]); navigate('home'); }} 
          />
        )}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'shipping' && <Shipping />}
      </main>

      <footer className="bg-emerald-50 text-emerald-950 py-24 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            <div className="col-span-2 md:col-span-1">
              <div className="bg-emerald-100 text-emerald-900 w-12 h-12 flex items-center justify-center rounded-xl font-serif text-2xl mb-6 border border-emerald-200">C</div>
              <span className="text-xl font-serif font-bold tracking-[0.2em] uppercase cursor-pointer" onClick={() => navigate('home')}>Culture Closet</span>
              <p className="mt-6 text-emerald-800/60 text-sm leading-relaxed max-w-xs font-light">Honoring the past, dressing the future.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.3em] text-emerald-600">Categories</h4>
              <ul className="space-y-4 text-xs tracking-widest text-emerald-800/70 font-bold uppercase">
                <li><button onClick={() => navigate('shop')} className="hover:text-emerald-950 transition-colors">APPAREL</button></li>
                <li><button onClick={() => navigate('shop')} className="hover:text-emerald-950 transition-colors">ACCESSORIES</button></li>
                <li><button onClick={() => navigate('shop')} className="hover:text-emerald-950 transition-colors text-emerald-600 animate-pulse">NEW DROP</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.3em] text-emerald-600">Concierge</h4>
              <ul className="space-y-4 text-xs tracking-widest text-emerald-800/70 font-bold uppercase">
                <li><button onClick={() => navigate('contact')} className="hover:text-emerald-950 transition-colors">CONTACT US</button></li>
                <li><button onClick={() => navigate('shipping')} className="hover:text-emerald-950 transition-colors">SHIPPING</button></li>
                <li><a href="#" className="hover:text-emerald-950 transition-colors">SUSTAINABILITY</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        currency={currency}
        onCheckout={() => { setIsCartOpen(false); navigate('checkout'); }}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(u) => { setUser(u); setIsAuthModalOpen(false); }} 
      />

      <StylistAssistant products={dbproducts} />
    </div>
  );
};

export default App;
