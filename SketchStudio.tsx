
import React, { useState, useRef } from 'react';
import { generateFashionSketch } from '../gemini';
import { FashionSketch } from '../types';

interface SketchStudioProps {
  onSave: (sketch: FashionSketch) => void;
}

const STYLES = [
  'Pencil Sketch',
  'Watercolor Illustration',
  'Runway Photography',
  'Avant-Garde Concept',
  'Technical Flat Sketch'
];

const SketchStudio: React.FC<SketchStudioProps> = ({ onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null); // Clear previous result
    try {
      const url = await generateFashionSketch(prompt, selectedStyle, uploadedImage || undefined);
      setResult(url);
    } catch (e: any) {
      alert(`Generation Failed: ${e.message}\n\nMake sure your API key has access to Imagen models.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      onSave({
        id: Math.random().toString(36).substr(2, 9),
        url: result,
        prompt,
        style: selectedStyle,
        timestamp: Date.now()
      });
      alert("Design added to collection!");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fadeIn">
      {/* Input Side */}
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-light mb-4 tracking-tight serif text-govisha">Visualize your vision.</h2>
          <p className="text-gray-500 font-light leading-relaxed">
            Describe the garment, fabric movement, and silhouette. Govisha AI captures the essence of luxury fashion.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Design Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A shimmering midnight blue silk gown with cascading ruffles..."
              className="w-full h-24 p-4 bg-white border border-[#fce8eb] focus:outline-none focus:ring-1 focus:ring-govisha transition-all font-light resize-none rounded-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Reference Image (Optional)</label>
            <div className="relative group">
              {uploadedImage ? (
                <div className="relative aspect-video w-full bg-[#fffcfd] border border-[#fce8eb] rounded-sm overflow-hidden">
                  <img src={uploadedImage} alt="Reference" className="w-full h-full object-contain" />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-govisha hover:bg-white shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 border-2 border-dashed border-[#fce8eb] rounded-sm text-gray-300 hover:border-govisha/30 hover:text-govisha transition-all flex flex-col items-center justify-center space-y-2"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] font-medium uppercase tracking-widest">Upload Reference</span>
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Illustration Style</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 text-[10px] font-bold tracking-widest text-left border rounded-sm transition-all uppercase ${selectedStyle === style
                    ? 'bg-govisha text-white border-govisha'
                    : 'bg-white text-gray-400 border-[#fce8eb] hover:border-govisha/50'
                    }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className={`w-full py-4 uppercase tracking-widest-xl text-xs font-bold transition-all rounded-sm ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-govisha text-white hover:opacity-90'
              }`}
          >
            {loading ? 'Manifesting Style...' : 'Generate Style'}
          </button>
        </div>
      </div>

      {/* Result Side */}
      <div className="flex flex-col">
        <div className="aspect-[3/4] bg-white border border-[#fce8eb] flex items-center justify-center relative overflow-hidden rounded-sm group card-shadow">
          {loading ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-2 border-gray-100 border-t-govisha rounded-full animate-spin mx-auto"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-govisha animate-pulse">Rendering Design...</p>
            </div>
          ) : result ? (
            <img src={result} alt="Generated fashion sketch" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <div className="mb-4 text-govisha/10">
                <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <p className="text-govisha/40 serif italic text-lg">Your design will appear here.</p>
            </div>
          )}
        </div>

        {result && !loading && (
          <div className="mt-4 flex space-x-4 animate-fadeIn">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-white border border-govisha text-govisha text-[10px] font-bold uppercase tracking-widest hover:bg-govisha hover:text-white transition-all rounded-sm"
            >
              Add to Collection
            </button>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = result;
                link.download = `govisha-style-${Date.now()}.png`;
                link.click();
              }}
              className="p-3 border border-[#fce8eb] text-govisha hover:bg-[#fff0f3] transition-all rounded-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SketchStudio;
