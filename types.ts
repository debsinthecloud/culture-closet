
export interface Product {
  id: string;
  name: string;
  price: number; // Base price in USD
  category: 'Apparel' | 'Accessories' | 'New Arrivals';
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  rating: number;
  stockCount: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  currency: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  trackingLink?: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  wishlist: string[]; // Array of product IDs
  orders: Order[];
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate relative to 1 USD
  name: string;
}

export type Page = 'home' | 'shop' | 'product' | 'checkout' | 'contact' | 'shipping' | 'account';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
