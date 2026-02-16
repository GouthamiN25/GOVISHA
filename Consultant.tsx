
import React, { useState, useRef, useEffect } from 'react';
import { getDesignConsultation } from '../gemini';
import { ChatMessage, DesignSpec } from '../types';

const Consultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const result = await getDesignConsultation(history, input);

    const botMessage: ChatMessage = {
      role: 'model',
      text: result.message,
      specs: result.specs
    };

    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
  };

  const SpecCard = ({ specs }: { specs: DesignSpec }) => (
    <div className="mt-4 p-6 bg-stone-900 text-white rounded-sm space-y-4 font-light text-sm shadow-xl">
      <div className="flex justify-between items-start border-b border-white/20 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Design Specification</span>
        <span className="text-stone-300 italic">#{Math.floor(Math.random() * 9000) + 1000}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Silhouette</p>
        <p className="text-base font-serif">{specs.silhouette}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Fabrics</p>
          <ul className="list-disc list-inside">
            {specs.fabrics.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Colors</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {specs.colors.map((c, i) => (
              <span key={i} className="px-2 py-0.5 bg-stone-800 border border-stone-700 text-[10px]">{c}</span>
            ))}
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Key Details</p>
        <p className="italic">{specs.details.join(', ')}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[75vh] max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-3xl font-light">Creative Consultant</h2>
        <p className="text-gray-400 font-light text-sm">Brainstorm collections and refine your design DNA.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-6 scroll-smooth" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="font-light">Describe a concept or ask for fabric suggestions.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-sm ${m.role === 'user' ? 'bg-black text-white' : 'bg-white border border-gray-100 shadow-sm text-gray-800'
              }`}>
              <p className="text-sm font-light leading-relaxed">{m.text}</p>
              {m.specs && <SpecCard specs={m.specs} />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-sm animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g. Help me design a collection inspired by desert storms..."
          className="flex-1 p-4 bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black rounded-sm font-light text-sm"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input}
          className="px-8 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-neutral-800 transition-all disabled:bg-gray-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Consultant;
