
import React from 'react';

const Shipping: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="space-y-16">
        <div className="text-center">
          <span className="text-emerald-600 font-bold tracking-[0.4em] text-[10px] mb-6 block uppercase">Our Logistics</span>
          <h1 className="text-5xl font-serif font-bold text-emerald-950">Shipping & Returns</h1>
          <p className="mt-6 text-emerald-800/50 text-lg font-light">Global delivery standards for heritage pieces.</p>
        </div>

        <div className="grid gap-12 border-t border-emerald-100 pt-16">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <h2 className="text-sm font-bold tracking-widest text-emerald-950 uppercase">01 Shipping</h2>
            <div className="md:col-span-2 space-y-4 text-emerald-800/80 font-light leading-relaxed">
              <p>We offer worldwide shipping via our premium logistics partners. Every item is carefully inspected and packaged in our custom archival boxes to ensure it reaches you in perfect condition.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                <li>Nigeria: 2–5 business days</li>
                <li>Rest of Africa: 5–10 business days</li>
                <li>Global: 7–14 business days</li>
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <h2 className="text-sm font-bold tracking-widest text-emerald-950 uppercase">02 Pre-Order</h2>
            <div className="md:col-span-2 space-y-4 text-emerald-800/80 font-light leading-relaxed">
              <p>Many of our artisanal pieces are made to order to minimize waste and ensure quality. Please allow 4–6 weeks for production on these specific items as noted on the product page.</p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <h2 className="text-sm font-bold tracking-widest text-emerald-950 uppercase">03 Returns</h2>
            <div className="md:col-span-2 space-y-4 text-emerald-800/80 font-light leading-relaxed">
              <p>Due to the delicate nature of our hand-crafted fabrics and embroidered pieces, we accept returns within 7 days of delivery for store credit or exchange only. Items must be unworn and in original packaging.</p>
            </div>
          </section>
        </div>

        <div className="bg-emerald-50 rounded-3xl p-12 text-center border border-emerald-100">
           <p className="text-emerald-950 font-serif italic text-xl mb-6">Need more details about your specific location?</p>
           <button className="text-xs font-bold tracking-[0.2em] border-b-2 border-emerald-900 pb-1 text-emerald-900 uppercase">Contact Concierge</button>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
