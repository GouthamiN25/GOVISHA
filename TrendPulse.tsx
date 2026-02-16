
import React, { useState } from 'react';
import { searchFashionTrends } from '../gemini';

const TrendPulse: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string; sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const data = await searchFashionTrends(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-light tracking-tight serif text-govisha">Trend Pulse</h2>
        <p className="text-gray-500 font-light text-lg">Real-time intelligence from the fashion world.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Milan Runway news? / Color of the season..."
          className="w-full p-6 pl-12 bg-white border border-[#fce8eb] rounded-full focus:outline-none focus:ring-1 focus:ring-govisha font-light text-xl shadow-sm transition-all"
        />
        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-govisha/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          type="submit"
          className="absolute right-3 top-3 bottom-3 px-8 bg-govisha text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:bg-gray-200"
          disabled={loading || !query}
        >
          {loading ? 'Searching...' : 'Explore'}
        </button>
      </form>

      {results && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-white p-8 border border-[#fce8eb] card-shadow prose prose-neutral max-w-none font-light leading-relaxed rounded-sm">
            {results.text.split('\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-govisha">Verified Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-[#fce8eb] rounded-sm bg-white hover:border-govisha transition-all flex justify-between items-center group"
                >
                  <span className="text-xs font-medium truncate pr-4 text-gray-700">{source.title}</span>
                  <svg className="w-4 h-4 text-govisha/30 group-hover:text-govisha transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-20">
          <div className="space-y-4 text-center">
            <div className="w-10 h-10 border-2 border-gray-100 border-t-govisha rounded-full animate-spin mx-auto"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-govisha">Gathering Intelligence</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendPulse;
