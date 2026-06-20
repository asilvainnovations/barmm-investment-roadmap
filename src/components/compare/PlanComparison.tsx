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

  if (plans.length < 2) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <GitCompare size={48} className="text-gold/30 mx-auto mb-4" />
        <h3 className="font-cinzel text-xl font-bold text-white mb-2">Need More Plans</h3>
        <p className="text-white/40 mb-6">Create at least two plans to compare them side-by-side.</p>
        <button onClick={() => navigate('/app/templates')} className="btn btn-primary">Create Plan</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">Plan Comparison</h2>
          <p className="text-sm text-white/40">Compare two strategic plans side-by-side</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Plan A</label>
          <select value={planA} onChange={(e) => setPlanA(e.target.value)} className="text-sm">
            <option value="">Select plan...</option>
            {plans.map((p) => (
              <option key={p.id || p.local_id || undefined} value={p.id || p.local_id || undefined}>{p.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Plan B</label>
          <select value={planB} onChange={(e) => setPlanB(e.target.value)} className="text-sm">
            <option value="">Select plan...</option>
            {plans.map((p) => (
              <option key={p.id || p.local_id} value={p.id || p.local_id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedA && selectedB && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-cinzel text-sm font-bold text-gold mb-4">Overview Comparison</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass rounded-lg p-4">
                <div className="font-cinzel text-sm font-bold text-white">{selectedA.title}</div>
                <div className="text-xs text-white/40 mt-1">{selectedA.region} | {selectedA.industry}</div>
                <div className="text-xs text-white/40">{selectedA.start_year}-{selectedA.end_year}</div>
                <div className="mt-2 font-cinzel text-lg font-bold text-gold">{selectedA.progress_pct}%</div>
                <div className="text-xs text-white/40">Progress</div>
              </div>
              <div className="glass rounded-lg p-4 flex items-center justify-center">
                <GitCompare size={32} className="text-gold/50" />
              </div>
              <div className="glass rounded-lg p-4">
                <div className="font-cinzel text-sm font-bold text-white">{selectedB.title}</div>
                <div className="text-xs text-white/40 mt-1">{selectedB.region} | {selectedB.industry}</div>
                <div className="text-xs text-white/40">{selectedB.start_year}-{selectedB.end_year}</div>
                <div className="mt-2 font-cinzel text-lg font-bold text-gold">{selectedB.progress_pct}%</div>
                <div className="text-xs text-white/40">Progress</div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-cinzel text-sm font-bold text-gold mb-4">Metrics Comparison</h3>
            <div className="space-y-3">
              {comparisonItems.map((item) => {
                const result = compareCount(item.key);
                const Icon = result.icon;
                const a = (selectedA[item.key] as Array<unknown> | undefined)?.length || 0;
                const b = (selectedB[item.key] as Array<unknown> | undefined)?.length || 0;
                return (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <span className="text-sm text-white/60">{item.label}</span>
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-bold text-white w-8 text-right">{a}</span>
                      <div className="flex items-center gap-1">
                        <Icon size={14} className={result.color} />
                        <span className={`text-xs ${result.color}`}>{result.diff > 0 ? result.diff : ''}</span>
                      </div>
                      <span className="text-sm font-bold text-white w-8 text-left">{b}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SWOT Diff */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4">
              <h3 className="font-cinzel text-sm font-bold text-gold mb-3">SWOT - Plan A</h3>
              <div className="space-y-2">
                {selectedA.swot_items?.map((s) => (
                  <div key={s.id} className={`text-xs p-2 rounded bg-white/5 border-l-2 ${s.category === 'strength' ? 'border-green-500' : s.category === 'weakness' ? 'border-red-500' : s.category === 'opportunity' ? 'border-blue-500' : 'border-yellow-500'}`}>
                    <span className="text-white/60">[{s.category}] {s.title}</span>
                  </div>
                )) || <div className="text-xs text-white/20">No SWOT items</div>}
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <h3 className="font-cinzel text-sm font-bold text-gold mb-3">SWOT - Plan B</h3>
              <div className="space-y-2">
                {selectedB.swot_items?.map((s) => (
                  <div key={s.id} className={`text-xs p-2 rounded bg-white/5 border-l-2 ${s.category === 'strength' ? 'border-green-500' : s.category === 'weakness' ? 'border-red-500' : s.category === 'opportunity' ? 'border-blue-500' : 'border-yellow-500'}`}>
                    <span className="text-white/60">[{s.category}] {s.title}</span>
                  </div>
                )) || <div className="text-xs text-white/20">No SWOT items</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
