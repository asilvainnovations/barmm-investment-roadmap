import { useMemo } from 'react';
import { PHASES, TOTAL_ROADMAP_BUDGET_FORMATTED, type PhaseTracker } from '../../data/bird/phases';

function PhaseCard({ phase }: { phase: PhaseTracker }) {
  const colorMap = {
    gold: 'bg-gold',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    teal: 'bg-teal-400',
  };
  const statusMap = {
    'Active Phase': { badge: 'bg-green-500/15 text-green-300 border-green-500/30', dot: 'bg-green-400' },
    'Planned': { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
  };
  const status = statusMap[phase.status as keyof typeof statusMap] || statusMap.Planned;

  return (
    <div className="glass rounded-xl p-5 card-hover relative overflow-hidden">
      <div className="absolute top-4 right-5 font-cinzel text-5xl font-bold text-gold/20 leading-none">
        {phase.id}
      </div>
      
      <h3 className="font-cinzel text-sm font-bold text-white mb-1">{phase.name}</h3>
      <div className="text-xs text-light-green font-medium mb-3">{phase.years}</div>
      <div className="font-cinzel text-xl font-bold text-gold mb-2">{phase.budget}</div>
      <div className="text-xs mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${status.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
          {phase.status}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${colorMap[phase.progressColor as keyof typeof colorMap] || 'bg-gold'}`} style={{ width: `${phase.pct}%`, transition: 'width 1.6s ease' }} />
        </div>
        <div className="text-[0.68rem] text-white/40 text-right mt-1">{phase.pct}%</div>
      </div>

      <div className="space-y-1.5">
        {phase.milestones.map((m, i) => (
          <div key={i} className="flex items-center gap-2 text-[0.74rem] text-white/60">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              m.status === 'done' ? 'bg-green-500' : m.status === 'active' ? 'bg-gold animate-pulse' : 'bg-white/20'
            }`} />
            <span className={m.status === 'done' ? 'text-white/30 line-through' : ''}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PhaseTrackerPanel() {
  const phases = useMemo(() => PHASES, []);

  return (
    <section className="glass rounded-xl p-6 border-t-2 border-gold/40">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Phase Tracker</span>
          <h2 className="font-cinzel text-xl font-bold text-white mt-1">2026-2035 Strategic Horizon</h2>
          <div className="w-10 h-1 bg-gold-grad rounded-full mt-2" />
        </div>
        <span className="text-xs text-white/50 bg-white/5 border border-gold/20 rounded-full px-3 py-1">Total: {TOTAL_ROADMAP_BUDGET_FORMATTED}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase, i) => (
          <div key={phase.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <PhaseCard phase={phase} />
          </div>
        ))}
      </div>
    </section>
  );
}
