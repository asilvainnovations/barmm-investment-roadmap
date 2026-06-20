import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCompare, ArrowRight, Plus, Minus, Equal, CheckCircle, X } from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import type { StrategicPlan } from '../../types';

export function PlanComparison() {
  const { plans } = useStrategicPlanStore();
  const navigate = useNavigate();
  const [planA, setPlanA] = useState<string>('');
  const [planB, setPlanB] = useState<string>('');

  const selectedA = plans.find((p) => (p.id || p.local_id) === planA);
  const selectedB = plans.find((p) => (p.id || p.local_id) === planB);

  const compareCount = (key: keyof StrategicPlan) => {
    const a = (selectedA?.[key] as Array<unknown> | undefined)?.length || 0;
    const b = (selectedB?.[key] as Array<unknown> | undefined)?.length || 0;
    if (a > b) return { diff: a - b, icon: Plus, color: 'text-green-400' };
    if (a < b) return { diff: b - a, icon: Minus, color: 'text-red-400' };
    return { diff: 0, icon: Equal, color: 'text-white/40' };
  };

  const comparisonItems = [
    { label: 'SWOT Items', key: 'swot_items' as keyof StrategicPlan },
    { label: 'Strategies', key: 'strategies' as keyof StrategicPlan },
    { label: 'Scorecards', key: 'scorecards' as keyof StrategicPlan },
    { label: 'PAPs', key: 'paps' as keyof StrategicPlan },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">Plan Comparison</h2>
          <p className="text-sm text-white/40">Compare two strategic plans side by side</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Plan A</label>
          <select value={planA} onChange={(e) => setPlanA(e.target.value)} className="text-sm">
            <option value="">Select plan...</option>
            {plans.map((p) => (
              <option key={p.id || p.local_id || ''} value={p.id || p.local_id || ''}>{p.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Plan B</label>
          <select value={planB} onChange={(e) => setPlanB(e.target.value)} className="text-sm">
            <option value="">Select plan...</option>
            {plans.map((p) => (
              <option key={p.id || p.local_id || ''} value={p.id || p.local_id || ''}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedA && selectedB && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-xl p-5 border-l-2 border-green-500">
              <h3 className="font-cinzel text-lg font-bold text-green-400 mb-2">{selectedA.title}</h3>
              <p className="text-sm text-white/50 mb-4">{selectedA.description || 'No description'}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Progress</span>
                  <span className="text-green-400 font-bold">{selectedA.progress_pct}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Status</span>
                  <span className={`badge badge-${selectedA.status === 'active' ? 'high' : selectedA.status === 'completed' ? 'success' : 'medium'}`}>{selectedA.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Region</span>
                  <span className="text-white/70">{selectedA.region}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-5 border-l-2 border-blue-500">
              <h3 className="font-cinzel text-lg font-bold text-blue-400 mb-2">{selectedB.title}</h3>
              <p className="text-sm text-white/50 mb-4">{selectedB.description || 'No description'}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Progress</span>
                  <span className="text-blue-400 font-bold">{selectedB.progress_pct}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Status</span>
                  <span className={`badge badge-${selectedB.status === 'active' ? 'high' : selectedB.status === 'completed' ? 'success' : 'medium'}`}>{selectedB.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Region</span>
                  <span className="text-white/70">{selectedB.region}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="font-cinzel text-sm font-bold text-gold mb-4">Detailed Comparison</h3>
            <div className="space-y-3">
              {comparisonItems.map((item) => {
                const result = compareCount(item.key);
                const Icon = result.icon;
                return (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <span className="text-sm text-white/70">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white/60">{((selectedA?.[item.key] as Array<unknown> | undefined)?.length || 0)}</span>
                      <Icon size={14} className={result.color} />
                      <span className="text-sm font-bold text-white/60">{((selectedB?.[item.key] as Array<unknown> | undefined)?.length || 0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
