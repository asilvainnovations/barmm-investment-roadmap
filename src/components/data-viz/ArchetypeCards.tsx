import { useState } from 'react';
import { SYSTEMS_ARCHETYPES, type SystemsArchetype } from '../../data/bird/clds';
import { AlertTriangle, TrendingUp, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

function ArchetypeCard({ archetype }: { archetype: SystemsArchetype }) {
  const [expanded, setExpanded] = useState(false);
  const iconMap = {
    limits_to_growth: TrendingUp,
    success_to_the_successful: TrendingUp,
    fixes_that_fail: RefreshCw,
  };
  const Icon = iconMap[archetype.archetype_type as keyof typeof iconMap] || AlertTriangle;
  const colorMap = {
    yellow: 'border-yellow-500/40 bg-yellow-500/5',
    green: 'border-green-500/40 bg-green-500/5',
    red: 'border-red-500/40 bg-red-500/5',
  };

  return (
    <div className={`glass rounded-xl p-5 card-hover border-l-2 ${colorMap[archetype.color as keyof typeof colorMap] || 'border-gold'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${archetype.color === 'red' ? 'bg-red-500/10' : archetype.color === 'green' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
          <Icon size={20} className={archetype.color === 'red' ? 'text-red-400' : archetype.color === 'green' ? 'text-green-400' : 'text-yellow-400'} />
        </div>
        <div>
          <h3 className="font-cinzel text-sm font-bold text-white">{archetype.name}</h3>
          <span className="text-[0.65rem] text-white/40 uppercase tracking-wider">{archetype.typeLabel}</span>
        </div>
      </div>
      <p className="text-xs text-white/50 mb-3 leading-relaxed">{archetype.description}</p>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors"
      >
        {expanded ? <><ChevronUp size={14} /> Less</> : <><ChevronDown size={14} /> More details</>}
      </button>
      
      {expanded && (
        <div className="mt-3 space-y-2 text-xs animate-fade-in">
          <div className="p-2 rounded bg-red-500/5 border border-red-500/20">
            <span className="text-red-300/70 font-medium">Symptoms: </span>
            <span className="text-white/50">{archetype.symptoms}</span>
          </div>
          <div className="p-2 rounded bg-white/5 border border-white/10">
            <span className="text-gold/70 font-medium">Structural Causes: </span>
            <span className="text-white/50">{archetype.structural_causes}</span>
          </div>
          <div className="p-2 rounded bg-green-500/5 border border-green-500/20">
            <span className="text-green-300/70 font-medium">Interventions: </span>
            <span className="text-white/50">{archetype.interventions}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ArchetypeCards() {
  const archetypes = SYSTEMS_ARCHETYPES;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Systems Thinking</span>
          <h2 className="font-cinzel text-xl font-bold text-white mt-1">Systems Archetypes</h2>
          <div className="w-10 h-1 bg-gold-grad rounded-full mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {archetypes.map((arch) => (
          <ArchetypeCard key={arch.id} archetype={arch} />
        ))}
      </div>
    </div>
  );
}
