
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div>
            <span className="text-emerald-600 font-bold tracking-[0.3em] text-[10px] mb-4 block uppercase">Contact Us</span>
            <h1 className="text-5xl font-serif font-bold text-emerald-950 leading-tight">We'd love to <br/>hear from you.</h1>
            <p className="mt-6 text-emerald-800/60 text-lg font-light leading-relaxed max-w-sm">
              Our concierge team is available to assist with styling advice, order inquiries, and size guides.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-[10px] font-bold text-emerald-900 tracking-[0.3em] uppercase mb-4">Email Inquiries</h3>
              <p className="text-emerald-950 font-serif text-2xl hover:text-emerald-600 transition-colors cursor-pointer">concierge@culturecloset.ng</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-emerald-900 tracking-[0.3em] uppercase mb-4">Press & Media</h3>
              <p className="text-emerald-950 font-serif text-2xl hover:text-emerald-600 transition-colors cursor-pointer">press@culturecloset.ng</p>
            </div>
            <div className="flex gap-8">
               <a href="#" className="text-[10px] font-bold tracking-widest text-emerald-400 hover:text-emerald-900 transition-colors uppercase">Instagram</a>
               <a href="#" className="text-[10px] font-bold tracking-widest text-emerald-400 hover:text-emerald-900 transition-colors uppercase">Twitter</a>
               <a href="#" className="text-[10px] font-bold tracking-widest text-emerald-400 hover:text-emerald-900 transition-colors uppercase">WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/30 p-12 rounded-[40px] border border-emerald-100">
          <form className="space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase ml-1">First Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-emerald-100 py-3 focus:border-emerald-500 outline-none text-sm transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase ml-1">Last Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-emerald-100 py-3 focus:border-emerald-500 outline-none text-sm transition-all" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase ml-1">Email</label>
                <input type="email" className="w-full bg-transparent border-b border-emerald-100 py-3 focus:border-emerald-500 outline-none text-sm transition-all" />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase ml-1">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-emerald-100 py-3 focus:border-emerald-500 outline-none text-sm transition-all resize-none" />
             </div>
             <button type="submit" className="w-full bg-emerald-950 text-white py-6 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all shadow-2xl">
                Send Inquiry
             </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
