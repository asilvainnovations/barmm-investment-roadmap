import { useMemo } from 'react';
import { PARETO_KPIS, type KPI } from '../../data/bird/kpis';
import { getStatusColor } from '../../lib/formulas';

function KPICard({ kpi }: { kpi: KPI }) {
  const circumference = 2 * Math.PI * 31;
  const offset = circumference - (kpi.pct / 100) * circumference;
  const colorMap = { green: '#10b981', gold: '#C9A84C', blue: '#3b82f6' };
  const ringColor = colorMap[kpi.color];
  const statusColor = getStatusColor(kpi.status);

  return (
    <div className="glass rounded-xl p-5 text-center card-hover relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg,${ringColor},${statusColor})` }} />
      
      {/* Circular progress */}
      <div className="relative w-20 h-20 mx-auto mb-3">
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 76 76">
          <circle cx="38" cy="38" r="31" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle cx="38" cy="38" r="31" fill="none" stroke={ringColor} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-cinzel text-lg font-bold text-gold">{kpi.pct}%</span>
          <span className="text-[0.6rem] text-white/40">of target</span>
        </div>
      </div>

      <h3 className="font-cinzel text-xs font-bold text-white mb-1 leading-tight">{kpi.label}</h3>
      <div className="text-sm text-light-green font-semibold mb-0.5">{kpi.current}</div>
      <div className="text-xs text-white/40 mb-2">Target: {kpi.target}</div>
      
      <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
        kpi.deltaType === 'up' ? 'bg-green-500/15 text-green-400' : 
        kpi.deltaType === 'flat' ? 'bg-yellow-500/15 text-yellow-400' : 
        'bg-red-500/15 text-red-400'
      }`}>
        {kpi.deltaType === 'up' ? '▲' : kpi.deltaType === 'flat' ? '~' : '▼'} {kpi.delta}
      </div>
      <div className="text-[0.6rem] text-white/30 mt-2">{kpi.source} · {kpi.leveragePoint}</div>
    </div>
  );
}

export function ParetoKPIPanel() {
  const kpis = useMemo(() => PARETO_KPIS, []);
  
  return (
    <section className="glass rounded-xl p-6 border-t-2 border-gold/40">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Panel A · Pareto Vital Few</span>
          <h2 className="font-cinzel text-xl font-bold text-white mt-1">Key Investment Targets — 2035 Vision</h2>
          <div className="w-10 h-1 bg-gold-grad rounded-full mt-2" />
        </div>
        <span className="text-xs text-white/50 bg-white/5 border border-gold/20 rounded-full px-3 py-1">{kpis.length} headline KPIs · Phase 1 progress</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={kpi.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <KPICard kpi={kpi} />
          </div>
        ))}
      </div>
    </section>
  );
}
