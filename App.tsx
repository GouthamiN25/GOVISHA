import React, { useState } from 'react';
import { ViewState } from './types';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ChatInterface } from './components/ChatInterface';
import { OutfitGenerator } from './components/OutfitGenerator';
import { TrendDashboard } from './components/TrendDashboard';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.HOME);

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <Hero setView={setView} />;
      case ViewState.CHAT:
        return <ChatInterface />;
      case ViewState.GENERATOR:
        return <OutfitGenerator />;
      case ViewState.TRENDS:
        return <TrendDashboard />;
      default:
        return <Hero setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream relative">
      {renderView()}
      <Navigation currentView={currentView} setView={setView} />
    </div>
  );
};

export default App;