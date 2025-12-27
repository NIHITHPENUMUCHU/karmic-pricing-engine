import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Search, 
  Settings2, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  X,
  Menu,
  ChevronRight,
  LayoutDashboard,
  Percent,
  ArrowUpRight,
  BarChart3,
  RefreshCcw,
  FileUp,
  FileCheck as LucideFileCheck,
  PlusCircle,
  Briefcase,
  Layers,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

/**
 * ASSIGNMENT DATA (Hardcoded from your specific uploaded CSVs)
 * This ensures the app works "perfectly" upon first load.
 */
const ASSIGNMENT_DATA = [
  { sku: "MN-01", desc: "Rectangle Tray - 14x10", role: "Core", fba: 15.11, storage: 0.44, handling: 0.75, cost: 16.00, current: 38.90, minM: 20, targetM: 35, dos: 47, comp: 36.90 },
  { sku: "MN-02", desc: "Rectangle Tray - 12x10", role: "Core", fba: 13.55, storage: 0.30, handling: 0.75, cost: 12.00, current: 33.90, minM: 20, targetM: 35, dos: 77, comp: 32.50 },
  { sku: "MN-03", desc: "Oval Tray - 15x10", role: "Core", fba: 13.94, storage: 0.34, handling: 0.75, cost: 15.00, current: 34.90, minM: 20, targetM: 35, dos: 52, comp: 35.20 },
  { sku: "MN-04", desc: "Oval Tray - 13x9", role: "Core", fba: 12.89, storage: 0.30, handling: 0.75, cost: 12.00, current: 29.90, minM: 20, targetM: 35, dos: 41, comp: 28.40 },
  { sku: "MN-05", desc: "Christmas Tray - 17x12", role: "Seasonal", fba: 11.80, storage: 0.22, handling: 0.75, cost: 13.00, current: 21.90, minM: 25, targetM: 45, dos: 145, comp: 23.90 },
  { sku: "MN-06", desc: "Star Tray - 14 Inch", role: "Seasonal", fba: 8.50, storage: 0.15, handling: 0.75, cost: 8.00, current: 14.95, minM: 25, targetM: 45, dos: 8, comp: 15.80 },
  { sku: "MN-07", desc: "Hexagon Plate - 10 Inch", role: "Core", fba: 11.20, storage: 0.25, handling: 0.75, cost: 10.00, current: 34.90, minM: 20, targetM: 35, dos: 85, comp: 33.50 },
  { sku: "MN-08", desc: "9 Inch Round Plate", role: "Core", fba: 10.50, storage: 0.20, handling: 0.75, cost: 9.00, current: 29.90, minM: 20, targetM: 35, dos: 42, comp: 31.20 },
  { sku: "MN-09", desc: "7 Inch Round Plate", role: "Core", fba: 8.20, storage: 0.15, handling: 0.75, cost: 7.00, current: 14.90, minM: 20, targetM: 35, dos: 33, comp: 15.60 },
  { sku: "MN-10", desc: "6 Inch Round Bowl", role: "Core", fba: 7.50, storage: 0.12, handling: 0.75, cost: 6.00, current: 19.90, minM: 20, targetM: 35, dos: 130, comp: 20.50 },
  { sku: "MN-11", desc: "4 Inch Square Bowl", role: "Core", fba: 6.80, storage: 0.10, handling: 0.75, cost: 5.50, current: 14.90, minM: 20, targetM: 35, dos: 95, comp: 17.80 },
  { sku: "MN-15", desc: "Compartment Tray", role: "Core", fba: 14.10, storage: 0.40, handling: 0.75, cost: 14.00, current: 42.90, minM: 20, targetM: 35, dos: 18, comp: 41.20 }
];

const App = () => {
  // --- Mode & Data State ---
  const [mode, setMode] = useState('assignment'); // 'assignment' or 'workspace'
  const [rawPricing, setRawPricing] = useState(null);
  const [rawInventory, setRawInventory] = useState(null);
  const [rawCompetitor, setRawCompetitor] = useState(null);
  
  // --- Simulation Parameters ---
  const [targetBoost, setTargetBoost] = useState(0);
  const [scarcityLimit, setScarcityLimit] = useState(15);
  const [liqLimit, setLiqLimit] = useState(120);
  const [stratMultipliers, setStratMultipliers] = useState({ scarcity: 15, liquidation: 15 });

  // --- UI Layout State ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSku, setSelectedSku] = useState(null);
  const [approvedSet, setApprovedSet] = useState(new Set());

  // --- CSV Parser Logic ---
  const handleUpload = (e, category) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((h, i) => {
          let val = values[i];
          if (val && typeof val === 'string' && (val.includes('$') || val.includes('%'))) {
            val = val.replace(/[\$\,\%]/g, '');
          }
          obj[h] = isNaN(val) || val === "" ? val : parseFloat(val);
        });
        return obj;
      });
      if (category === 'pricing') setRawPricing(data);
      if (category === 'inventory') setRawInventory(data);
      if (category === 'competitor') setRawCompetitor(data);
    };
    reader.readAsText(file);
  };

  const createNewDashboard = () => {
    setMode('workspace');
    setRawPricing(null);
    setRawInventory(null);
    setRawCompetitor(null);
    setApprovedSet(new Set());
    setTargetBoost(0);
    setActiveTab('dashboard');
  };

  // --- Calculation Engine ---
  const results = useMemo(() => {
    const base = mode === 'assignment' ? ASSIGNMENT_DATA : (rawPricing || []);
    
    return base.map(item => {
      const inv = mode === 'workspace' ? rawInventory?.find(i => i.SKU === item.SKU) : null;
      const comp = mode === 'workspace' ? rawCompetitor?.find(i => i.SKU === item.SKU) : null;

      const fba = item['FBA Fee'] ?? item.fba ?? 0;
      const storage = item['Storage Fee'] ?? item.storage ?? 0;
      const handling = item.Handling_Cost ?? item.handling ?? 0;
      const cost = item.Cost ?? item.cost ?? 0;
      const current = item.Current_Price ?? item.current ?? 0;
      const minM = item.Minimum_Acceptable_Margin_ ? parseFloat(item.Minimum_Acceptable_Margin_) : (item.minM || 20);
      const targetM = item.Target_Gross_Margin_ ? parseFloat(item.Target_Gross_Margin_) : (item.targetM || 35);
      const dos = inv ? (inv['days-of-supply'] ?? inv.dos) : (item.dos || 45);
      const compPrice = comp ? (comp.Avg_Competitor_Price ?? comp.comp) : (item.comp || current);

      const fees = fba + storage + handling;
      const totalCost = cost + fees;
      const tMargin = Math.min(0.99, (targetM + targetBoost) / 100);
      
      let rec = totalCost / (1 - tMargin);
      let strategy = "Target Alignment";

      if (dos < scarcityLimit) {
        rec *= (1 + stratMultipliers.scarcity / 100);
        strategy = "Stock Protection";
      } else if (dos > liqLimit) {
        rec *= (1 - stratMultipliers.liquidation / 100);
        strategy = "Inventory Liquidation";
      }

      const floor = totalCost / (1 - (minM / 100));
      if (rec < floor) {
        rec = floor;
        strategy = "Margin Guardrail";
      }

      return {
        sku: item.SKU || item.sku,
        desc: item.Product_description || item.desc,
        role: item['Product Role'] || item.role,
        current,
        rec,
        totalCost,
        fees,
        cost,
        fba,
        storage,
        handling,
        dos,
        comp: compPrice,
        margin: ((rec - totalCost) / rec) * 100,
        change: ((rec - current) / Math.max(0.01, current)) * 100,
        strategy
      };
    });
  }, [mode, rawPricing, rawInventory, rawCompetitor, targetBoost, scarcityLimit, liqLimit, stratMultipliers]);

  const filtered = results.filter(i => 
    i.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    lift: filtered.reduce((a, b) => a + b.change, 0) / (filtered.length || 1),
    margin: filtered.reduce((a, b) => a + b.margin, 0) / (filtered.length || 1),
    critical: filtered.filter(i => i.dos < scarcityLimit).length,
    excess: filtered.filter(i => i.dos > liqLimit).length
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 transition-transform duration-300 transform
        lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
                <TrendingUp size={20} />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none text-slate-800">Karmic Seed</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{mode}</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-300 hover:text-slate-500"><X /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-10">
            {mode === 'workspace' && (
              <div className="space-y-4">
                <header className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <FileUp size={14} /> Dataset Uploads
                </header>
                <UploadSlot label="Pricing Data" isDone={!!rawPricing} onUpload={(e) => handleUpload(e, 'pricing')} />
                <UploadSlot label="Inventory Health" isDone={!!rawInventory} onUpload={(e) => handleUpload(e, 'inventory')} />
                <UploadSlot label="Competitor Data" isDone={!!rawCompetitor} onUpload={(e) => handleUpload(e, 'competitor')} />
              </div>
            )}

            <div className="space-y-8">
              <header className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <Settings2 size={14} /> Strategy Sliders
              </header>
              
              <Slider label="Target Margin Boost" value={targetBoost} min={-10} max={20} unit="%" onChange={setTargetBoost} color="accent-indigo-600" />

              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 space-y-5">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-[10px] uppercase">
                  <AlertTriangle size={14} /> Stock Protection
                </div>
                <Slider label="DOS Limit" value={scarcityLimit} onChange={setScarcityLimit} min={5} max={30} unit="d" color="accent-rose-500" />
                <Slider label="Premium" value={stratMultipliers.scarcity} onChange={(v) => setStratMultipliers({...stratMultipliers, scarcity: v})} min={0} max={30} unit="%" color="accent-rose-500" />
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-5">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-[10px] uppercase">
                  <Package size={14} /> Liquidation
                </div>
                <Slider label="DOS Limit" value={liqLimit} onChange={setLiqLimit} min={60} max={180} unit="d" color="accent-slate-400" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
             <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all">
               Push Updates ({approvedSet.size})
             </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Menu /></button>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
              <TabBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={16}/>} label="Overview" />
              <TabBtn active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} icon={<BarChart3 size={16}/>} label="Catalog" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" placeholder="Search SKU..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-48 focus:w-64 transition-all focus:ring-2 focus:ring-indigo-500"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={createNewDashboard}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              <PlusCircle size={16} /> New Workspace
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-24">
          {mode === 'workspace' && !rawPricing && (
            <div className="max-w-xl mx-auto mt-20 text-center space-y-6 bg-white p-10 rounded-[3rem] border border-dashed border-slate-300 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <Layers size={40} />
               </div>
               <h2 className="text-2xl font-black text-slate-900 leading-tight">Prepare your new Workspace</h2>
               <p className="text-slate-400 font-medium">Please upload your Pricing, Inventory, and Competitor CSV files using the sidebar to begin analysis.</p>
            </div>
          )}

          {(mode === 'assignment' || (mode === 'workspace' && rawPricing)) && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                <KPICard title="Price Lift" value={`+${stats.lift.toFixed(1)}%`} icon={<ArrowUpRight className="text-indigo-600"/>} color="bg-indigo-50" />
                <KPICard title="Avg Margin" value={`${stats.margin.toFixed(1)}%`} icon={<Percent className="text-emerald-600"/>} color="bg-emerald-50" />
                <KPICard title="Scarcity" value={stats.critical} icon={<AlertTriangle className="text-rose-600"/>} color="bg-rose-50" />
                <KPICard title="Excess" value={stats.excess} icon={<Package className="text-slate-600"/>} color="bg-slate-100" />
              </div>

              {activeTab === 'dashboard' ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                  <div className="xl:col-span-2 bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-8 flex justify-between items-center">Pricing Delta by SKU (%)</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={results.slice(0, 15)}>
                          <defs>
                            <linearGradient id="pColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="sku" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                          <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} unit="%" />
                          <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                          <Area type="monotone" dataKey="change" stroke="#6366f1" fillOpacity={1} fill="url(#pColor)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-8 text-center">Strategy Mix</h3>
                    <div className="h-64 flex flex-col justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Target', value: results.filter(i => i.strategy === 'Target Alignment').length },
                              { name: 'Protect', value: results.filter(i => i.strategy === 'Stock Protection').length },
                              { name: 'Liquid', value: results.filter(i => i.strategy === 'Inventory Liquidation').length },
                              { name: 'Floor', value: results.filter(i => i.strategy === 'Margin Guardrail').length },
                            ]}
                            innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none"
                          >
                            <Cell fill="#6366f1" /><Cell fill="#f43f5e" /><Cell fill="#94a3b8" /><Cell fill="#f59e0b" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <Legend color="bg-indigo-500" label="Target" />
                        <Legend color="bg-rose-500" label="Protect" />
                        <Legend color="bg-slate-400" label="Liquid" />
                        <Legend color="bg-amber-500" label="Floor" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="px-10 py-6">Product Details</th>
                          <th className="px-10 py-6">Inventory status</th>
                          <th className="px-10 py-6">Rec. Pricing</th>
                          <th className="px-10 py-6">Active Strategy</th>
                          <th className="px-10 py-6 text-right">Approval</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map(item => (
                          <tr key={item.sku} onClick={() => setSelectedSku(item.sku)} className={`group cursor-pointer hover:bg-slate-50/80 transition-all ${selectedSku === item.sku ? 'bg-indigo-50/40' : ''}`}>
                            <td className="px-10 py-6">
                              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{item.sku}</span>
                              <div className="text-xs text-slate-400 truncate w-48 font-medium">{item.desc}</div>
                            </td>
                            <td className="px-10 py-6"><div className={`text-sm font-bold ${item.dos < scarcityLimit ? 'text-rose-600' : 'text-slate-700'}`}>{item.dos}d Supply</div></td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-3">
                                <span className="font-black text-slate-900 text-lg">${item.rec.toFixed(2)}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${item.change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-10 py-6"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${item.strategy.includes('Protection') ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>{item.strategy}</span></td>
                            <td className="px-10 py-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); const next = new Set(approvedSet); if (next.has(item.sku)) next.delete(item.sku); else next.add(item.sku); setApprovedSet(next); }} className={`p-3 rounded-2xl transition-all ${approvedSet.has(item.sku) ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300 hover:text-indigo-600'}`}>
                                <CheckCircle2 size={24} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* DETAIL DRAWER */}
      {selectedSku && (
        <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm flex justify-end animate-in fade-in" onClick={() => setSelectedSku(null)}>
          <div className="w-full sm:w-[500px] lg:w-[600px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500" onClick={e => e.stopPropagation()}>
            {(() => {
              const item = results.find(i => i.sku === selectedSku);
              if (!item) return null;
              return (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="p-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                    <div className="flex-1">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg mb-6 inline-block">{item.role} Listing</span>
                      <h2 className="text-4xl font-black text-slate-900 mb-2 leading-none uppercase">{item.sku}</h2>
                      <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <button onClick={() => setSelectedSku(null)} className="text-slate-300 hover:text-slate-500 p-2"><X size={32} /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 space-y-12">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-3xl bg-slate-50">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Current Marketplace</p>
                        <p className="text-2xl font-black tracking-tight">${item.current.toFixed(2)}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-100">
                        <p className="text-[10px] font-black uppercase text-indigo-300 mb-2">Recommended</p>
                        <p className="text-2xl font-black tracking-tight">${item.rec.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <header className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Landed Overhead</span>
                        <span className="text-slate-900">${item.totalCost.toFixed(2)} Total</span>
                      </header>
                      <BarItem label="Base Cost" val={item.cost} total={item.totalCost} color="bg-indigo-600" />
                      <BarItem label="FBA Fees" val={item.fba} total={item.totalCost} color="bg-sky-400" />
                      <BarItem label="Storage & Handling" val={item.fees - item.fba} total={item.totalCost} color="bg-slate-300" />
                    </div>

                    <div className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-100">
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Supply Pulse</h4>
                        <div className={`text-2xl font-black ${item.dos < scarcityLimit ? 'text-rose-600' : 'text-slate-900'}`}>{item.dos} Days</div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item.strategy} Phase</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Market Avg</h4>
                        <div className="text-2xl font-black text-slate-900">${item.comp.toFixed(2)}</div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{((item.rec - item.comp)/Math.max(1, item.comp) * 100).toFixed(1)}% vs Market</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 bg-slate-50 border-t border-slate-100">
                    <button 
                      onClick={() => { const next = new Set(approvedSet); if (next.has(item.sku)) next.delete(item.sku); else next.add(item.sku); setApprovedSet(next); setSelectedSku(null); }}
                      className={`w-full py-5 rounded-3xl font-black text-sm tracking-wide transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-4 ${approvedSet.has(item.sku) ? 'bg-white border-2 border-emerald-500 text-emerald-600' : 'bg-slate-900 text-white'}`}
                    >
                      {approvedSet.has(item.sku) ? 'SKU Fully Authorized' : 'Authorize Recommendation'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const UploadSlot = ({ label, isDone, onUpload }) => (
  <div className={`relative flex items-center justify-between p-3.5 rounded-2xl border-2 border-dashed transition-all ${isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-indigo-300'}`}>
    <div className="flex items-center gap-2 overflow-hidden">
      {isDone ? <LucideFileCheck className="text-emerald-500 shrink-0" size={16} /> : <FileUp className="shrink-0" size={16} />}
      <span className="text-[10px] font-black uppercase tracking-widest truncate">{label}</span>
    </div>
    <input type="file" accept=".csv" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
  </div>
);

const Slider = ({ label, value, onChange, min, max, unit, color }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-end">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <span className="text-sm font-black text-slate-900">{value > 0 ? '+' : ''}{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} className={`w-full h-1.5 rounded-lg appearance-none bg-slate-100 cursor-pointer ${color}`} />
  </div>
);

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-[11px] font-black transition-all ${active ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-900'}`}>{icon} {label}</button>
);

const KPICard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-start hover:scale-[1.03] transition-transform duration-300">
    <div className={`p-3 rounded-2xl text-white ${color} shadow-lg shadow-current/20 mb-6`}>{icon}</div>
    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
    <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{value}</div>
  </div>
);

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{label}</span>
  </div>
);

const BarItem = ({ label, val, total, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-tighter">
      <span>{label}</span>
      <span>${val.toFixed(2)}</span>
    </div>
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${(val / Math.max(1, total)) * 100}%` }} />
    </div>
  </div>
);

const DetailMetric = ({ label, value, accent }) => (
  <div className={`p-6 rounded-3xl border ${accent ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100'}`}>
    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${accent ? 'text-indigo-200' : 'text-slate-400'}`}>{label}</div>
    <div className="text-2xl md:text-3xl font-black tracking-tight">{value}</div>
  </div>
);

export default App;