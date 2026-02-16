
import React, { useState, useEffect } from 'react';
import { AppTab, FashionSketch } from './types';
import SketchStudio from './components/SketchStudio';
import TrendPulse from './components/TrendPulse';
import Consultant from './components/Consultant';
import SavedGallery from './components/SavedGallery';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SKETCH);
  const [collection, setCollection] = useState<FashionSketch[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aura_collection');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCollection(parsed);
        }
      }
    } catch (e) {
      console.error("Govisha: Failed to load collection from storage", e);
      // Optional: Clear corrupted data to prevent repeat errors
      // localStorage.removeItem('aura_collection');
    }
  }, []);

  const saveToCollection = (sketch: FashionSketch) => {
    const updated = [sketch, ...collection];
    setCollection(updated);
    try {
      localStorage.setItem('aura_collection', JSON.stringify(updated));
    } catch (e) {
      console.error("Govisha: Failed to save to local storage", e);
    }
  };

  const removeFromCollection = (id: string) => {
    const updated = collection.filter(s => s.id !== id);
    setCollection(updated);
    try {
      localStorage.setItem('aura_collection', JSON.stringify(updated));
    } catch (e) {
      console.error("Govisha: Failed to update local storage after removal", e);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.SKETCH:
        return <SketchStudio onSave={saveToCollection} />;
      case AppTab.TRENDS:
        return <TrendPulse />;
      case AppTab.CONSULTANT:
        return <Consultant />;
      case AppTab.COLLECTION:
        return <SavedGallery sketches={collection} onRemove={removeFromCollection} />;
      default:
        return <SketchStudio onSave={saveToCollection} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffafb] text-gray-900">
      {/* Brand Header */}
      <div className="bg-white/50 border-b border-[#fce8eb] py-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter uppercase text-govisha serif">GOVISHA</h1>
      </div>

      {/* Hero Section */}
      <div className="py-20 flex flex-col items-center justify-center text-center px-4">
        <p className="text-[10px] font-medium tracking-widest-xl uppercase mb-8 text-gray-800">TIMELESS DESIGN</p>
        <h1 className="text-7xl md:text-9xl font-normal text-govisha serif mb-8 tracking-tight">GOVISHA</h1>
        <p className="text-xl md:text-2xl text-govisha italic serif mb-10 opacity-80">
          "Elegance is the only beauty that never fades."
        </p>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-1">FOUNDED BY</p>
          <p className="text-sm font-semibold tracking-widest text-govisha">GOUTHAMI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#fffafb]/80 backdrop-blur-md border-y border-[#fce8eb] px-6 py-4 mb-12">
        <div className="max-w-7xl mx-auto flex justify-center space-x-4 md:space-x-12">
          {Object.values(AppTab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] font-bold tracking-widest uppercase transition-all pb-1 border-b-2 ${
                activeTab === tab 
                  ? 'text-govisha border-govisha' 
                  : 'text-gray-400 border-transparent hover:text-govisha'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:px-8 pb-20">
        {renderContent()}
      </main>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-[10px] tracking-widest uppercase text-gray-300 border-t border-[#fce8eb]">
        &copy; {new Date().getFullYear()} Govisha High Fashion Studio. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
