import { useState } from 'react';
import { calculateResilience } from '../../lib/formulas';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

interface SwotItem {
  id: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  impact: number;
  likelihood: number;
  control: number;
  beieCluster: string;
}

const INITIAL_SWOT: SwotItem[] = [
  { id: 'S1', category: 'strength', title: 'Halal Legitimacy & Cultural Credibility', impact: 5, likelihood: 5, control: 4, beieCluster: 'Transformers' },
  { id: 'S2', category: 'strength', title: 'Domestic Halal Demand (5.69M Muslims)', impact: 5, likelihood: 5, control: 4, beieCluster: 'Connectors' },
  { id: 'W1', category: 'weakness', title: 'Critical Infrastructure Deficits', impact: 5, likelihood: 5, control: 2, beieCluster: 'Enablers' },
  { id: 'W2', category: 'weakness', title: 'Highest Poverty Incidence (34.8%)', impact: 5, likelihood: 5, control: 2, beieCluster: 'Foundations' },
  { id: 'O1', category: 'opportunity', title: 'Global Halal Market (USD 2.3T)', impact: 5, likelihood: 5, control: 3, beieCluster: 'Connectors' },
  { id: 'O2', category: 'opportunity', title: 'Islamic Finance Ecosystem', impact: 4, likelihood: 5, control: 3, beieCluster: 'Financiers' },
  { id: 'T1', category: 'threat', title: 'Climate Change Vulnerabilities', impact: 5, likelihood: 4, control: 2, beieCluster: 'Foundations' },
  { id: 'T2', category: 'threat', title: 'Competition from Halal Hubs', impact: 4, likelihood: 4, control: 3, beieCluster: 'Connectors' },
];

const CATEGORY_CONFIG = {
  strength: { label: 'Strengths', color: 'border-green-500', bg: 'bg-green-500/5', text: 'text-green-400' },
  weakness: { label: 'Weaknesses', color: 'border-red-500', bg: 'bg-red-500/5', text: 'text-red-400' },
  opportunity: { label: 'Opportunities', color: 'border-blue-500', bg: 'bg-blue-500/5', text: 'text-blue-400' },
  threat: { label: 'Threats', color: 'border-yellow-500', bg: 'bg-yellow-500/5', text: 'text-yellow-400' },
};

export function QuantifiedSWOT() {
  const [items, setItems] = useState<SwotItem[]>(INITIAL_SWOT);
  const [expanded, setExpanded] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Partial<SwotItem>>({ category: 'strength', impact: 3, likelihood: 3, control: 3 });

  const addItem = () => {
    if (!newItem.title) return;
    const item: SwotItem = {
      id: `${newItem.category?.[0]?.toUpperCase() || 'X'}${items.length + 1}`,
      category: newItem.category as SwotItem['category'],
      title: newItem.title,
      impact: newItem.impact || 3,
      likelihood: newItem.likelihood || 3,
      control: newItem.control || 3,
      beieCluster: newItem.beieCluster || 'Foundations',
    };
    setItems([...items, item]);
    setShowAdd(false);
    setNewItem({ category: 'strength', impact: 3, likelihood: 3, control: 3 });
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const grouped = {
    strength: items.filter((i) => i.category === 'strength'),
    weakness: items.filter((i) => i.category === 'weakness'),
    opportunity: items.filter((i) => i.category === 'opportunity'),
    threat: items.filter((i) => i.category === 'threat'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Quantified Analysis</span>
          <h2 className="font-cinzel text-xl font-bold text-white mt-1">Quantified SWOT — RI / Risk / VI</h2>
          <div className="w-10 h-1 bg-gold-grad rounded-full mt-2" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setExpanded(!expanded)} className="btn btn-secondary text-sm px-3">
            {expanded ? <><ChevronUp size={14} /> Collapse</> : <><ChevronDown size={14} /> Expand</>}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary text-sm px-3">
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="glass rounded-xl p-4 border border-gold/20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value as SwotItem['category'] })} className="text-sm">
              <option value="strength">Strength</option>
              <option value="weakness">Weakness</option>
              <option value="opportunity">Opportunity</option>
              <option value="threat">Threat</option>
            </select>
            <input type="text" value={newItem.title || ''} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="Title" className="text-sm" />
            <input type="number" value={newItem.impact} onChange={(e) => setNewItem({ ...newItem, impact: Number(e.target.value) })} placeholder="Impact (1-5)" className="text-sm" min={1} max={5} />
            <input type="number" value={newItem.likelihood} onChange={(e) => setNewItem({ ...newItem, likelihood: Number(e.target.value) })} placeholder="Likelihood (1-5)" className="text-sm" min={1} max={5} />
            <input type="number" value={newItem.control} onChange={(e) => setNewItem({ ...newItem, control: Number(e.target.value) })} placeholder="Control (1-5)" className="text-sm" min={1} max={5} />
            <button onClick={addItem} className="btn btn-primary text-sm">Add</button>
          </div>
        </div>
      )}

      {expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const catItems = grouped[cat];
            return (
              <div key={cat} className={`glass rounded-xl border-t-2 ${config.color} overflow-hidden`}>
                <div className={`px-4 py-3 ${config.bg}`}>
                  <h3 className={`font-cinzel text-sm font-bold ${config.text} uppercase tracking-wider`}>
                    {config.label} ({catItems.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="text-left px-3 py-2 text-xs text-white/40">Item</th>
                        <th className="text-center px-2 py-2 text-xs text-white/40">I</th>
                        <th className="text-center px-2 py-2 text-xs text-white/40">L</th>
                        <th className="text-center px-2 py-2 text-xs text-white/40">C</th>
                        <th className="text-center px-2 py-2 text-xs text-white/40">RI</th>
                        <th className="text-center px-2 py-2 text-xs text-white/40">Risk</th>
                        <th className="text-center px-2 py-2 text-xs text-white/40">VI</th>
                        <th className="text-right px-2 py-2 text-xs text-white/40"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {catItems.map((item) => {
                        const scores = calculateResilience(item.impact, item.likelihood, item.control);
                        return (
                          <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-3 py-2">
                              <div className="text-xs font-medium text-white">{item.title}</div>
                              <div className="text-[0.6rem] text-white/30">{item.beieCluster}</div>
                            </td>
                            <td className="text-center px-2 py-2 text-xs text-white/60">{item.impact}</td>
                            <td className="text-center px-2 py-2 text-xs text-white/60">{item.likelihood}</td>
                            <td className="text-center px-2 py-2 text-xs text-white/60">{item.control}</td>
                            <td className="text-center px-2 py-2 text-xs font-bold text-gold">{scores.resilienceIndex.toFixed(2)}</td>
                            <td className="text-center px-2 py-2 text-xs">
                              <span className={`${scores.riskLevel === 'Critical' ? 'text-red-400' : scores.riskLevel === 'High' ? 'text-yellow-400' : 'text-green-400'}`}>
                                {scores.riskLevel}
                              </span>
                            </td>
                            <td className="text-center px-2 py-2 text-xs text-white/60">{scores.vulnerabilityIndex.toFixed(1)}</td>
                            <td className="text-right px-2 py-2">
                              <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                <X size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
