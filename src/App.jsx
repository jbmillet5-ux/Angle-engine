import React, { useState } from 'react';
import { Target, Zap, ShieldAlert, BarChart3, Search, Plus, Trash2 } from 'lucide-react';

export default function StrategicApp() {
  const [brand, setBrand] = useState('TruthFinder.com');
  const [competitors, setCompetitors] = useState([{ url: '' }]);
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
      
      if (!response.ok) {
        // This will now tell us EXACTLY what the server said
        throw new Error(data.error || `Server Error: ${response.status}`);
      }
      
      setAnalysis(data);
    } catch (err) {
      alert(`STRATEGIC ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><BarChart3 size={20} /></div>
          <h1 className="font-black text-xl tracking-tight">STRAT-INTEL</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4">Our Brand</h3>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-3 border rounded-xl font-bold text-slate-700 bg-slate-50">
              <option>TruthFinder.com</option>
              <option>Intelius.com</option>
              <option>InstantCheckmate.com</option>
              <option>USSearch.com</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4">Market Competitors</h3>
            {competitors.map((c, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input placeholder="Competitor URL" className="flex-1 p-2 text-sm border rounded-lg bg-slate-50" onChange={(e) => {
                  const n = [...competitors]; n[i].url = e.target.value; setCompetitors(n);
                }}/>
                <button onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            ))}
            <button onClick={() => setCompetitors([...competitors, { url: '' }])} className="text-xs font-bold text-indigo-600 mt-2 flex items-center gap-1"><Plus size={12} /> Add Competitor</button>
          </div>

          <button onClick={runAudit} disabled={loading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
            {loading ? "MAPPING GAPS..." : "RUN TACTICAL AUDIT"} <Zap size={18} fill="currentColor"/>
          </button>
        </aside>

        <main className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[600px] p-10 prose prose-slate max-w-none">
          {analysis ? (
            <div dangerouslySetInnerHTML={{ __html: analysis.html_report }} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center">
              <Search size={48} strokeWidth={1} className="mb-4"/>
              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Ready for Analysis</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
