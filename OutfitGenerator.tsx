import React, { useState } from 'react';
import { OutfitParams, GeneratedImage } from '../types';
import { generateOutfitVisual } from '../services/geminiService';
import { Loader2, Download, Wand2, AlertCircle } from 'lucide-react';

export const OutfitGenerator: React.FC = () => {
  const [params, setParams] = useState<OutfitParams>({
    occasion: '',
    style: '',
    weather: '',
    colorPalette: ''
  });
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!params.occasion || !params.style) {
      setError("Please specify the occasion and style.");
      return;
    }
    
    setError('');
    setLoading(true);
    setGeneratedImage(null);

    const prompt = `Full body fashion outfit for ${params.occasion}, Style: ${params.style}, Weather: ${params.weather}, Palette: ${params.colorPalette}. GOVISHA Brand Aesthetic: Indo-Western Fusion, Elegant, Editorial.`;

    try {
      const imageUrl = await generateOutfitVisual(prompt);
      if (imageUrl) {
        setGeneratedImage({ url: imageUrl, prompt });
      } else {
        setError("Generation failed. Please retry.");
      }
    } catch (e) {
      setError("Connection to the studio failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 md:pt-32 min-h-screen bg-brand-cream px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left: Input Form (Spec Sheet) */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-black mb-2">Custom Design</h2>
            <div className="h-0.5 w-12 bg-brand-rose"></div>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Tell us what you need, and we will create a unique look for you at <span className="font-bold text-brand-rose">GOVISHA</span>. 
            </p>
          </div>

          <div className="bg-white p-8 shadow-sm border border-brand-pink/50 space-y-6">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-rose">Occasion</label>
              <input 
                type="text" 
                className="w-full border-b border-gray-200 py-3 text-brand-black focus:outline-none focus:border-brand-rose transition-colors font-serif text-lg bg-transparent placeholder-gray-200"
                placeholder="e.g. Wedding Reception"
                value={params.occasion}
                onChange={e => setParams({...params, occasion: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-rose">Style Style</label>
              <select 
                className="w-full border-b border-gray-200 py-3 text-brand-black focus:outline-none focus:border-brand-rose transition-colors bg-transparent cursor-pointer font-medium"
                value={params.style}
                onChange={e => setParams({...params, style: e.target.value})}
              >
                <option value="">Select a Style...</option>
                <option value="GOVISHA Signature">GOVISHA Signature</option>
                <option value="Modern Royal">Modern Royal</option>
                <option value="Simple & Elegant">Simple & Elegant</option>
                <option value="Bohemian Luxury">Bohemian Luxury</option>
                <option value="Modern Business (Indo-West)">Modern Business (Indo-West)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-rose">Season</label>
                <input 
                  type="text" 
                  className="w-full border-b border-gray-200 py-2 text-sm text-brand-black focus:outline-none focus:border-brand-rose bg-transparent"
                  placeholder="e.g. Summer Morning"
                  value={params.weather}
                  onChange={e => setParams({...params, weather: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-rose">Colors</label>
                <input 
                  type="text" 
                  className="w-full border-b border-gray-200 py-2 text-sm text-brand-black focus:outline-none focus:border-brand-rose bg-transparent"
                  placeholder="e.g. Red & Gold"
                  value={params.colorPalette}
                  onChange={e => setParams({...params, colorPalette: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-800 bg-red-50 p-3 text-xs uppercase tracking-wide">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-6 bg-brand-black text-white py-4 uppercase tracking-[0.25em] font-bold text-xs hover:bg-brand-rose transition-colors duration-500 disabled:opacity-70 flex justify-center gap-2 items-center"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : "Create Look"}
            </button>
          </div>
        </div>

        {/* Right: Output (Magazine Page) */}
        <div className="lg:col-span-8 h-full min-h-[600px] flex items-center justify-center bg-white p-4 md:p-8 shadow-2xl shadow-brand-pink/20">
           <div className="w-full h-full border border-brand-black p-2 flex flex-col relative">
              {/* Top Bar */}
              <div className="flex justify-between items-start mb-4 px-2 pt-2">
                 <div className="text-[10px] uppercase tracking-[0.3em] font-bold">Ref No. {Math.floor(Math.random() * 10000)}</div>
                 <div className="font-serif font-bold text-xl tracking-tighter text-brand-rose">GOVISHA</div>
              </div>

              {/* Image Area */}
              <div className="flex-1 bg-brand-pink/10 relative overflow-hidden flex items-center justify-center">
                 {generatedImage ? (
                   <div className="w-full h-full relative group">
                      <img src={generatedImage.url} alt="Design" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                         <a href={generatedImage.url} download="govisha-design.png" className="bg-white text-brand-black px-6 py-3 uppercase tracking-widest text-xs font-bold hover:bg-brand-rose hover:text-white transition-colors flex items-center gap-2">
                            <Download size={14} /> Save Design
                         </a>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center opacity-30">
                     {loading ? (
                       <div className="flex flex-col items-center">
                         <div className="w-12 h-12 border-2 border-brand-black border-t-transparent rounded-full animate-spin mb-4"></div>
                         <p className="font-serif italic text-lg">Designing your outfit...</p>
                       </div>
                     ) : (
                       <>
                         <Wand2 size={48} className="mx-auto mb-4 text-brand-rose" />
                         <p className="font-serif text-2xl italic">Ready to design.</p>
                       </>
                     )}
                   </div>
                 )}
              </div>

              {/* Bottom Details */}
              <div className="mt-4 px-2 pb-2 flex justify-between items-end">
                 <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Collection</p>
                    <p className="font-serif text-lg leading-none">The New Collection</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Designed By</p>
                    <p className="font-serif text-sm text-brand-rose font-medium">Gouthami</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};