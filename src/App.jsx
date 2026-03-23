import React, { useState } from 'react';
import { Target, Zap, BarChart3, Search, Trash2 } from 'lucide-react';

export default function StrategicApp() {
  const [brand, setBrand] = useState('TruthFinder.com');
  const [competitors, setCompetitors] = useState([{ url: '' }]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, competitors }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Server Communication Error");
      setAnalysis(data);
    } catch (err) {
      // NEW ERROR MESSAGE - If you see this, the code is updated!
      alert(`V3.2 SYSTEM ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><BarChart3 size={20} /></div>
          <h1 className="font-black text-xl tracking-tight uppercase">Strat-Intel <span className="text-indigo-600">v3.2</span></h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Active Brand</label>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-3 border rounded-xl font-bold bg-slate-50">
              <option>TruthFinder.com</option><option>Intelius.com</option><option>InstantCheckmate.com</option><option>USSearch.com</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Competitor Benchmarks</label>
            {competitors.map((c, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input placeholder="Competitor URL" className="flex-1 p-2 text-sm border rounded-lg bg-slate-50" onChange={(e) => {
                  const n = [...competitors]; n[i].url = e.target.value; setCompetitors(n);
                }}/>
                <button onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>

          <button onClick={runAudit} disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            {loading ? "IDENTIFYING GAPS..." : "GENERATE STRATEGY"} <Zap size={18} fill="currentColor"/>
          </button>
        </aside>

        <main className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-10 prose prose-indigo max-w-none shadow-sm min-h-[500px]">
          {analysis ? (
            <div dangerouslySetInnerHTML={{ __html: analysis.html_report }} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20 text-center">
              <Search size={48} strokeWidth={1} className="mb-4 opacity-20"/>
              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Ready for Market Analysis</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
