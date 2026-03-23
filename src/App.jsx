import React, { useState } from 'react';
import { Target, Zap, ShieldAlert, BarChart3, Search, Plus, Trash2 } from 'lucide-react';

export default function StrategicApp() {
  const [brand, setBrand] = useState('TruthFinder.com');
  const [competitors, setCompetitors] = useState([{ name: '', url: '' }]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, competitors }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error("Audit failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><BarChart3 size={20} /></div>
          <h1 className="font-black text-xl tracking-tight">STRAT-INTEL <span className="text-indigo-600">v3</span></h1>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth & Tactical Matrix</div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
              <ShieldAlert size={14} /> Our Core Asset
            </h3>
            <select 
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-3 border rounded-xl font-bold text-slate-700 bg-slate-50 focus:ring-2 ring-indigo-500 outline-none"
            >
              <option>TruthFinder.com</option>
              <option>Intelius.com</option>
              <option>InstantCheckmate.com</option>
              <option>USSearch.com</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
              <Target size={14} /> Market Competitors
            </h3>
            {competitors.map((c, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input 
                  placeholder="Competitor URL" 
                  className="flex-1 p-2 text-sm border rounded-lg bg-slate-50 focus:bg-white transition"
                  onChange={(e) => {
                    const n = [...competitors]; n[i].url = e.target.value; setCompetitors(n);
                  }}
                />
                <button 
                  onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))}
                  className="text-slate-300 hover:text-red-500 transition"
                ><Trash2 size={16}/></button>
              </div>
            ))}
            <button 
              onClick={() => setCompetitors([...competitors, { name: '', url: '' }])}
              className="text-xs font-bold text-indigo-600 mt-2 flex items-center gap-1 hover:underline"
            >
              <Plus size={12} /> Add Competitor
            </button>
          </div>

          <button 
            onClick={runAudit}
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Processing Market Data..." : "Run Tactical Audit"} <Zap size={18} fill="currentColor"/>
          </button>
        </aside>

        {/* Results Panel */}
        <main className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[600px] overflow-hidden">
          {analysis ? (
            <div className="p-10 prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: analysis.html_report }} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 p-12 text-center">
              <Search size={48} strokeWidth={1}/>
              <div>
                <p className="font-bold text-slate-400">Ready for Strategic Discovery</p>
                <p className="text-sm max-w-xs mx-auto mt-2">Enter your competitors to identify the tactical gaps for {brand}.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
