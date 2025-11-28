import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  setView: (view: ViewState) => void;
}

export const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream to-brand-pink/40 pt-20 md:pt-32 pb-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-brand-pink hidden md:block"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-brand-pink hidden md:block"></div>
      
      <div className="max-w-7xl w-full mx-auto relative z-10 text-center flex flex-col items-center">
        
        {/* Simple Welcome Text */}
        <div className="mb-6 animate-fade-in">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-brand-black">
            Timeless Design
          </p>
        </div>

        <h1 className="font-serif text-[4rem] md:text-[8rem] lg:text-[11rem] leading-[0.9] text-brand-rose mb-8 animate-fade-in-up tracking-tighter">
          GOVISHA
        </h1>

        <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up delay-100">
           <p className="font-serif text-xl md:text-2xl text-gray-700 italic mb-6">
             "Elegance is the only beauty that never fades."
           </p>
           <p className="text-sm text-gray-500 font-light uppercase tracking-widest leading-loose">
             Founded by 
             <br />
             <span className="text-brand-rose font-medium text-lg">Gouthami</span>
           </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg mx-auto animate-fade-in-up delay-200">
          <button 
            onClick={() => setView(ViewState.GENERATOR)}
            className="flex-1 group bg-brand-black text-white py-5 px-8 text-xs uppercase tracking-[0.25em] transition-all hover:bg-brand-rose hover:shadow-2xl flex items-center justify-center gap-3"
          >
            <Sparkles size={14} className="text-brand-gold group-hover:text-white transition-colors" />
            Enter Studio
          </button>
          
          <button 
            onClick={() => setView(ViewState.CHAT)}
            className="flex-1 group border border-brand-black text-brand-black py-5 px-8 text-xs uppercase tracking-[0.25em] transition-all hover:bg-white hover:border-brand-rose hover:text-brand-rose flex items-center justify-center gap-3"
          >
            Ask Gouthami
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer Accent */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end animate-fade-in delay-500">
           <p className="text-[10px] uppercase tracking-[0.3em] text-brand-black/60 font-medium">Est. 2025</p>
           <p className="text-[10px] uppercase tracking-[0.1em] text-brand-black/40">© Gouthami Nadupuri * All Rights Reserved</p>
        </div>

      </div>
    </div>
  );
};