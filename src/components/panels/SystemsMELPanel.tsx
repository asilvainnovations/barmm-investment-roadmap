import { useState } from 'react';
import { CAUSAL_LOOPS, SYSTEMS_ARCHETYPES, type CausalLoop, type SystemsArchetype } from '../../data/bird/clds';
import { Activity, RefreshCw, TrendingUp, AlertTriangle, Target, ArrowUpRight } from 'lucide-react';

function LoopCard({ loop }: { loop: CausalLoop }) {
  const statusMap = {
    active: { badge: 'bg-green-500/15 text-green-300 border-green-500/30', label: 'Active' },
    building: { badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', label: 'Building' },
    watch: { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', label: 'Watch' },
  };
  const status = statusMap[loop.status];
  const colorMap = { green: '#10b981', gold: '#C9A84C', blue: '#3b82f6' };

  return (
    <div className="glass rounded-xl p-5 card-hover border-l-2 border-l-gold/40">
      <div className="flex items-center justify-between mb-2">
        <div className={`font-cinzel text-3xl font-bold leading-none ${loop.loop_type === 'reinforcing' ? 'text-green-400' : 'text-gold'}`}>
          {loop.id}
        </div>
        <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded border ${status.badge}`}>
          {loop.typeLabel}
        </span>
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{loop.name}</h3>
      <p className="text-xs text-white/50 mb-3 leading-relaxed">{loop.description}</p>
      
      <div className="mb-3">
        <div className="text-[0.72rem] text-white/55 mb-1">Loop Activation</div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${loop.pct}%`, background: `linear-gradient(90deg,${colorMap[loop.color]},${colorMap[loop.color]}88)` }} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[0.72rem] text-white/55">{loop.pct}% active</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${status.badge}`}>{status.label}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {loop.leverage_points.map((lp) => (
          <span key={lp} className="bg-gold/10 text-gold text-[0.65rem] font-bold px-2 py-0.5 rounded border border-gold/20">{lp}</span>
        ))}
      </div>
    </div>
  );
}

function ArchetypeCard({ archetype }: { archetype: SystemsArchetype }) {
  const colorMap = {
    yellow: 'border-yellow-500',
    green: 'border-green-500',
    red: 'border-red-500',
  };

  return (
    <div className={`glass rounded-xl p-5 card-hover border-l-2 ${colorMap[archetype.color as keyof typeof colorMap] || 'border-gold'}`}>
      <h3 className="font-cinzel text-sm font-bold text-gold mb-2">{archetype.name}</h3>
      <p className="text-xs text-white/50 mb-3 leading-relaxed">{archetype.description}</p>
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-gold/70 font-medium">Symptoms:</span>
          <span className="text-white/40 ml-1">{archetype.symptoms}</span>
        </div>
        <div>
          <span className="text-gold/70 font-medium">Causes:</span>
          <span className="text-white/40 ml-1">{archetype.structural_causes}</span>
        </div>
        <div>
          <span className="text-gold/70 font-medium">Interventions:</span>
          <span className="text-white/40 ml-1">{archetype.interventions}</span>
        </div>
      </div>
    </div>
  );
}

export function SystemsMELPanel() {
  const [activeTab, setActiveTab] = useState<'loops' | 'archetypes'>('loops');
  const loops = CAUSAL_LOOPS;
  const archetypes = SYSTEMS_ARCHETYPES;

  return (
    <section className="glass rounded-xl p-6 border-t-2 border-gold/40">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Panel D · Systems Health Monitor</span>
          <h2 className="font-cinzel text-xl font-bold text-white mt-1">Causal Loops & Systems Archetypes</h2>
          <div className="w-10 h-1 bg-gold-grad rounded-full mt-2" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('loops')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'loops' ? 'bg-gold/20 text-gold' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <Activity size={12} className="inline mr-1" /> Loops
          </button>
          <button
            onClick={() => setActiveTab('archetypes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'archetypes' ? 'bg-gold/20 text-gold' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <AlertTriangle size={12} className="inline mr-1" /> Archetypes
          </button>
        </div>
      </div>

      {activeTab === 'loops' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loops.map((loop) => (
            <LoopCard key={loop.id} loop={loop} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {archetypes.map((arch) => (
            <ArchetypeCard key={arch.id} archetype={arch} />
          ))}
        </div>
      )}
    </section>
  );
}
