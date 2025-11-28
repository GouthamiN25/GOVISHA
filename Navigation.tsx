import React from 'react';
import { ViewState } from '../types';
import { AlignLeft, MessageSquare, Diamond, TrendingUp } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  // Simplified terms for better user understanding
  const navItems = [
    { id: ViewState.HOME, label: 'Home', icon: <AlignLeft size={18} /> },
    { id: ViewState.CHAT, label: 'Stylist', icon: <MessageSquare size={18} /> },
    { id: ViewState.GENERATOR, label: 'Design', icon: <Diamond size={18} /> },
    { id: ViewState.TRENDS, label: 'Trends', icon: <TrendingUp size={18} /> },
  ];

  return (
    <>
      {/* Desktop Header */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 py-6 px-12 justify-between items-center border-b border-brand-pink/30 transition-all">
        <div className="flex-1 flex gap-8">
          {navItems.slice(0, 2).map((item) => (
             <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors hover:text-brand-rose ${currentView === item.id ? 'text-brand-black border-b border-brand-black' : 'text-gray-400'}`}
             >
               {item.label}
             </button>
          ))}
        </div>

        <div className="flex-0 mx-12 cursor-pointer group" onClick={() => setView(ViewState.HOME)}>
           <h1 className="font-serif text-4xl font-bold tracking-tight text-brand-rose group-hover:opacity-80 transition-opacity duration-500">GOVISHA</h1>
        </div>

        <div className="flex-1 flex gap-8 justify-end">
          {navItems.slice(2, 4).map((item) => (
             <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors hover:text-brand-rose ${currentView === item.id ? 'text-brand-black border-b border-brand-black' : 'text-gray-400'}`}
             >
               {item.label}
             </button>
          ))}
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 py-4 px-6 border-b border-gray-100 flex justify-center">
         <h1 className="font-serif text-2xl font-bold tracking-tight text-brand-rose">GOVISHA</h1>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-6 z-50 flex justify-between">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 ${
                currentView === item.id ? 'text-brand-rose' : 'text-gray-300'
              }`}
            >
              {item.icon}
              <span className="text-[9px] uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
      </nav>
    </>
  );
};