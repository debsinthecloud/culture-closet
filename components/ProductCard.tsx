
import React from 'react';
import { Product, Currency, User } from '../types';
import { formatPrice } from '../services/currencyService';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  currency: Currency;
  user?: User | null;
  onToggleWishlist?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, currency, user, onToggleWishlist }) => {
  const isWishlisted = user?.wishlist.includes(product.id);

  const getStockStatus = (count: number) => {
    if (count === 0) return { label: 'Sold Out', color: 'text-stone-500 bg-stone-50 border-stone-200' };
    if (count < 5) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'In Stock', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  const stock = getStockStatus(product.stockCount);

  return (
    <div className="group relative cursor-pointer" onClick={() => onClick(product)}>
      <div className="relative aspect-w-4 aspect-h-5 bg-emerald-50 rounded-2xl overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] shadow-sm">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-[400px] object-center object-cover transition-all duration-500 ${product.stockCount === 0 ? 'grayscale opacity-60' : 'group-hover:opacity-90'}`}
        />
        
        {/* Stock Badge Overlay */}
        <div className="absolute top-4 left-4">
          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm backdrop-blur-sm ${stock.color}`}>
            {stock.label}
          </span>
        </div>

        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
          <button className="w-full bg-white/90 backdrop-blur-md text-emerald-950 py-3 px-4 rounded-xl font-bold text-xs tracking-widest uppercase shadow-xl transform active:scale-95 transition-all">
            {product.stockCount === 0 ? 'Out of Stock' : 'View Details'}
          </button>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product.id);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
            isWishlisted 
              ? 'bg-emerald-600 text-white' 
              : 'bg-white/80 text-emerald-900 opacity-0 group-hover:opacity-100'
          }`}
        >
          <svg className={`h-4 w-4 ${isWishlisted ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="mt-6 flex justify-between items-start px-1">
        <div>
          <h3 className={`text-sm font-bold tracking-tight leading-tight transition-colors ${product.stockCount === 0 ? 'text-stone-400' : 'text-emerald-950 group-hover:text-emerald-700'}`}>{product.name}</h3>
          <p className="mt-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{product.category}</p>
        </div>
        <p className={`text-sm font-bold ${product.stockCount === 0 ? 'text-stone-400' : 'text-emerald-900'}`}>{formatPrice(product.price, currency)}</p>
      </div>
      <div className="mt-3 flex items-center px-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-emerald-400' : 'text-emerald-100'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-[10px] font-bold text-emerald-200 tracking-tighter">{product.rating}</span>
      </div>
    </div>
  );
};

export default ProductCard;
