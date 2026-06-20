import { useMemo } from 'react';
import { BSC_LEVERAGE_POINTS, type BSCLeveragePoint } from '../../data/bird/kpis';

function BSCCard({ lp }: { lp: BSCLeveragePoint }) {
  const colorMap = {
    finance: 'bg-green-500',
    stakeholder: 'bg-blue-500',
    process: 'bg-yellow-500',
    learning: 'bg-teal-400',
  };
  const progressMap = {
    green: 'bg-green-500',
    gold: 'bg-gold',
    blue: 'bg-blue-500',
    teal: 'bg-teal-400',
  };

  return (
    <div className="glass rounded-xl p-5 card-hover relative overflow-hidden border-l-2 border-l-gold/40">
      <div className={`absolute top-0 bottom-0 left-0 w-0.5 ${colorMap[lp.perspectiveClass as keyof typeof colorMap] || 'bg-gold'}`} />
      
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-gold-grad text-[#022c22] text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          {lp.lpBadge}
        </span>
      </div>
      <div className="text-[0.66rem] font-bold uppercase tracking-wider text-white/40 mb-1">{lp.perspective}</div>
      <div className="font-cinzel text-sm font-bold text-white mb-2 leading-tight">{lp.action}</div>
      <div className="text-xs text-light-green italic mb-3">{lp.kpi}</div>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between text-[0.7rem] mb-1">
          <span className="text-white/55">{lp.current}</span>
          <span className="text-gold font-bold">{lp.target}</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${progressMap[lp.progressColor as keyof typeof progressMap] || 'bg-gold'}`} style={{ width: `${lp.pct}%`, transition: 'width 1.6s cubic-bezier(.4,0,.2,1)' }} />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className={`inline-flex items-center gap-1 text-[0.68rem] px-2 py-0.5 rounded border ${
            lp.statusType === 'in-progress' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {lp.statusLabel}
          </span>
          <span className="text-[0.68rem] text-white/35">{lp.note}</span>
        </div>
      </div>
    </div>
  );
}

export function BSCViewPanel() {
  const lps = useMemo(() => BSC_LEVERAGE_POINTS, []);

  return (
    <section className="glass rounded-xl p-6 border-t-2 border-gold/40">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Panel B · Balanced Scorecard</span>
          <h2 className="font-cinzel text-xl font-bold text-white mt-1">Critical Leverage Points — BSC View</h2>
          <div className="w-10 h-1 bg-gold-grad rounded-full mt-2" />
        </div>
        <span className="text-xs text-white/50 bg-white/5 border border-gold/20 rounded-full px-3 py-1">5 KPIs · All 4 perspectives</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {lps.map((lp, i) => (
          <div key={lp.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <BSCCard lp={lp} />
          </div>
        ))}
      </div>
    </section>
  );
}
