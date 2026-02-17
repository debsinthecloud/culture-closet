
import React, { useState } from 'react';
import { userService } from '../services/userService';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = userService.login(email, password);
      if (user) {
        onSuccess(user);
        onClose();
      } else {
        setError('Invalid credentials');
      }
    } else {
      const user = userService.signUp(name, email, password);
      if (user) {
        onSuccess(user);
        onClose();
      } else {
        setError('Email already exists');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-emerald-950">
              {isLogin ? 'Welcome Back' : 'Join the Archive'}
            </h2>
            <button onClick={onClose} className="text-stone-300 hover:text-emerald-900 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-emerald-50/50 border-b border-emerald-100 py-3 px-4 rounded-xl focus:border-emerald-500 outline-none text-sm transition-all" 
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase ml-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-emerald-50/50 border-b border-emerald-100 py-3 px-4 rounded-xl focus:border-emerald-500 outline-none text-sm transition-all" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase ml-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-emerald-50/50 border-b border-emerald-100 py-3 px-4 rounded-xl focus:border-emerald-500 outline-none text-sm transition-all" 
              />
            </div>

            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{error}</p>}

            <button type="submit" className="w-full bg-emerald-950 text-white py-5 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all shadow-xl">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-950 uppercase tracking-widest transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
