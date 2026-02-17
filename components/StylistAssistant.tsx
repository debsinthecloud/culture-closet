
import React, { useState, useRef, useEffect } from 'react';
import { getStylingAdvice, StylistResponse } from '../services/geminiService';

interface ChatMessage extends StylistResponse {
  role: 'user' | 'model';
}

const StylistAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to the Culture Closet Studio. I'm your AI stylist. Looking for a trend-setting cultural look today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const result = await getStylingAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'model', ...result }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 border border-emerald-200"
        >
          <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="font-bold text-sm">Style Concierge</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-[400px] flex flex-col border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="bg-emerald-50 p-4 flex justify-between items-center border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg border border-emerald-200">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h3 className="text-emerald-900 font-bold text-sm">Concierge AI</h3>
                <p className="text-emerald-600 text-[10px] uppercase tracking-widest font-bold">Trend Grounded</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-emerald-900 transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md' 
                    : 'bg-emerald-50 text-emerald-950 shadow-sm border border-emerald-100 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  
                  {msg.image && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-emerald-100 shadow-inner">
                      <p className="text-[10px] text-emerald-400 mb-1 px-1">Visualizing your look...</p>
                      <img src={msg.image} alt="Styling Concept" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter mb-1">Inspired by:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.slice(0, 2).map((s, i) => (
                          <a 
                            key={i} 
                            href={s.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] bg-emerald-100/50 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-100 transition-colors inline-block max-w-full truncate"
                          >
                            {s.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-emerald-50 p-4 rounded-2xl shadow-sm border border-emerald-100 rounded-bl-none">
                  <div className="flex gap-2 items-center">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest animate-pulse">Researching Trends...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-emerald-100 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for trends..."
              className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-200 transition-all outline-none text-emerald-950 placeholder:text-emerald-300"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow-md transition-all disabled:bg-stone-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StylistAssistant;
