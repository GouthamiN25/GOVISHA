
import React from 'react';
import { FashionSketch } from '../types';

interface SavedGalleryProps {
  sketches: FashionSketch[];
  onRemove: (id: string) => void;
}

const SavedGallery: React.FC<SavedGalleryProps> = ({ sketches, onRemove }) => {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="border-b border-gray-100 pb-8">
        <h2 className="text-5xl font-light tracking-tight">The Collection</h2>
        <p className="text-gray-400 font-light mt-2 italic">Curating your creative journey.</p>
      </div>

      {sketches.length === 0 ? (
        <div className="py-20 text-center space-y-6">
          <div className="w-32 h-32 border border-dashed border-gray-200 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-gray-400 font-light uppercase tracking-widest text-xs">No sketches saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sketches.map((sketch) => (
            <div key={sketch.id} className="group relative bg-white border border-gray-100 rounded-sm overflow-hidden transition-all hover:shadow-2xl">
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={sketch.url} 
                  alt={sketch.prompt} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-2 bg-white">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{sketch.style}</span>
                  <button 
                    onClick={() => onRemove(sketch.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="Remove from collection"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs font-light text-gray-600 line-clamp-2 leading-relaxed">
                  {sketch.prompt}
                </p>
                <div className="pt-2 flex justify-between items-center text-[9px] text-gray-300 uppercase font-bold tracking-tighter">
                  <span>ID {sketch.id}</span>
                  <span>{new Date(sketch.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button 
                  onClick={() => {
                    const win = window.open();
                    win?.document.write(`<img src="${sketch.url}" style="width:100%; height:auto;">`);
                  }}
                  className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-sm pointer-events-auto shadow-lg"
                >
                  View High Res
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedGallery;
