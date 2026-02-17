
import { Currency } from '../types';

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, name: 'United States Dollar' },
  { code: 'NGN', symbol: '₦', rate: 1550, name: 'Nigerian Naira' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.78, name: 'British Pound' },
  { code: 'GHS', symbol: 'GH₵', rate: 15.5, name: 'Ghanaian Cedi' },
  { code: 'ZAR', symbol: 'R', rate: 18.2, name: 'South African Rand' },
  { code: 'CAD', symbol: 'C$', rate: 1.37, name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', rate: 1.51, name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', rate: 148.5, name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', rate: 83.9, name: 'Indian Rupee' },
  { code: 'CNY', symbol: '¥', rate: 7.2, name: 'Chinese Yuan' },
  { code: 'KES', symbol: 'KSh', rate: 129.5, name: 'Kenyan Shilling' },
];

export function formatPrice(amountInUSD: number, currency: Currency): string {
  const convertedAmount = amountInUSD * currency.rate;
  
  // Use Intl for professional formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.code === 'NGN' ? 0 : 2,
    maximumFractionDigits: currency.code === 'NGN' ? 0 : 2,
  }).format(convertedAmount);
}
