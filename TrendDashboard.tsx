import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendItem } from '../types';
import { getTrendReport } from '../services/geminiService';
import { Loader2, TrendingUp } from 'lucide-react';

export const TrendDashboard: React.FC = () => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      const data = await getTrendReport();
      setTrends(data);
      setLoading(false);
    };
    fetchTrends();
  }, []);

  // Custom palette including brand rose/pink
  const colors = ['#1a1a1a', '#9F1239', '#D4AF37', '#FCE8E6', '#000000'];

  return (
    <div className="pt-20 pb-24 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 bg-brand-pink rounded-full text-brand-rose">
             <TrendingUp size={24} />
           </div>
           <div>
             <h2 className="font-serif text-3xl md:text-4xl">Trend Forecast</h2>
             <p className="text-gray-500 text-sm md:text-base">Real-time analysis of fashion hype cycles.</p>
           </div>
        </div>

        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4 text-brand-rose" size={48} />
            <p>Analyzing global runways...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm h-[400px] md:h-[500px]">
              <h3 className="font-bold text-lg mb-6 uppercase tracking-widest text-gray-400">Hype Meter</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={trends} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{fill: '#1a1a1a', fontSize: 12, fontFamily: 'Lato'}} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={40}>
                    {trends.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* List Section */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-bold text-lg mb-6 uppercase tracking-widest text-gray-400 pl-2">Details</h3>
              {trends.map((trend, idx) => (
                <div key={idx} className="bg-white p-4 border-l-4 border-brand-black hover:border-brand-rose transition-colors duration-300 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif font-bold text-xl">{trend.name}</h4>
                    <span className="text-xs font-bold bg-brand-pink/30 px-2 py-1 rounded text-brand-rose">{trend.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{trend.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};