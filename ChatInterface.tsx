import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateStylistResponse } from '../services/geminiService';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I am Gouthami. Welcome to GOVISHA studio. How can I help you find your perfect style today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await generateStylistResponse(history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 md:pt-32 min-h-screen bg-brand-pink/30 flex justify-center items-center px-4 md:px-8">
      <div className="w-full max-w-5xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:rounded-sm overflow-hidden flex flex-col h-[75vh] border border-brand-pink">
        
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
               <div className="w-12 h-12 bg-brand-black text-brand-gold rounded-full flex items-center justify-center font-serif text-xl font-bold">G</div>
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-serif text-xl text-brand-rose tracking-wide">Gouthami</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">Founder @ <span className="text-brand-rose font-bold">GOVISHA</span></p>
            </div>
          </div>
          <Sparkles className="text-brand-gold opacity-50" size={20} />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#FAFAFA]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-6 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-black text-white rounded-sm' 
                    : 'bg-white border border-brand-pink text-brand-dark rounded-sm'
                }`}>
                  <span className={`font-serif block mb-2 text-xs opacity-50 uppercase tracking-widest ${msg.role === 'model' ? 'text-brand-rose' : ''}`}>
                    {msg.role === 'user' ? 'You' : 'GOVISHA'}
                  </span>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-300 mt-2 uppercase tracking-widest">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex w-full justify-start">
              <div className="bg-white border border-brand-pink p-4 rounded-sm shadow-sm flex items-center gap-3">
                 <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-brand-rose rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-brand-rose rounded-full animate-bounce delay-100"></div>
                   <div className="w-1.5 h-1.5 bg-brand-rose rounded-full animate-bounce delay-200"></div>
                 </div>
                 <span className="text-[10px] uppercase tracking-widest text-brand-rose">Designing...</span>
              </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-4 items-center max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me about trends, colors, or fabrics..."
              className="flex-1 bg-brand-pink/10 p-4 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-rose/30 transition-all placeholder-gray-400 font-medium text-brand-black"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-brand-black text-white h-12 w-12 flex items-center justify-center hover:bg-brand-rose transition-colors duration-300 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};