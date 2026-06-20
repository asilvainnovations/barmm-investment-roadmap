import { useState } from 'react';
import { Target, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';

interface LeveragePoint {
  id: string;
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  budget: string;
  beieCluster: string;
  actions: string[];
  impact: string;
}

const LEVERAGE_POINTS: LeveragePoint[] = [
  {
    id: 'LP1',
    name: 'Halal Governance & Certification',
    description: 'Operationalizing BHB with OIC/SMIIC standards, breaking "Fixes that Fail" via credible certification.',
    priority: 'critical',
    budget: '₱200M',
    beieCluster: 'Transformers',
    actions: ['Audit 50 enterprises', 'OIC/SMIIC alignment', 'Train 50 officers'],
    impact: 'Breaks Fixes that Fail archetype',
  },
  {
    id: 'LP2',
    name: 'Halal Hub Infrastructure',
    description: 'WOW Matanog SEZ launch with anchor tenant pre-qualification, raising the B1 Growth Ceiling.',
    priority: 'critical',
    budget: '₱500M',
    beieCluster: 'Enablers',
    actions: ['Groundbreaking Q4 2026', 'Utility infrastructure', 'Anchor tenant pre-qualification'],
    impact: 'Raises B1 Growth Ceiling',
  },
  {
    id: 'LP3',
    name: 'Digital Facilitation',
    description: 'BEGMP/BIFOSS full rollout with 1-day digital business registration, activating R2 Governance-Confidence loop.',
    priority: 'high',
    budget: '₱150M',
    beieCluster: 'Enablers',
    actions: ['1-day registration', 'e-Permitting integration', 'One-stop shops'],
    impact: 'Activates R2 Governance Loop',
  },
  {
    id: 'LP4',
    name: 'Islamic Finance Foundation',
    description: 'Shariah-compliant microfinance, Takaful framework, Sukuk readiness.',
    priority: 'high',
    budget: '₱100M',
    beieCluster: 'Financiers',
    actions: ['Microfinance pilot', 'Takaful framework', 'Sukuk assessment'],
    impact: 'Builds financial inclusion',
  },
  {
    id: 'LP5',
    name: 'Green Economy Framework',
    description: 'Forestry Code, MENRE-MILG JMC for Carbon Credits and PES markets.',
    priority: 'critical',
    budget: '₱50M',
    beieCluster: 'Foundations',
    actions: ['Enact Forestry Code', 'Sign JMC 2026-01', 'Carbon credit baseline'],
    impact: 'Monetizes environmental assets',
  },
  {
    id: 'LP6',
    name: 'Energy Connectivity',
    description: 'ZBIP facilitation and solar mini-grids for 80% electrification pathway.',
    priority: 'high',
    budget: '₱200M',
    beieCluster: 'Enablers',
    actions: ['ZBIP matchmaking', 'Solar mini-grids', 'Tawi-Tawi/Sulu deployment'],
    impact: 'Accelerates electrification',
  },
  {
    id: 'LP7',
    name: 'Human Capital',
    description: 'Halal Expert Training Program - first cadre of 50 certification officers.',
    priority: 'medium',
    budget: '₱100M',
    beieCluster: 'Foundations',
    actions: ['Train 50 officers', 'International mentorship', 'BHB capacity building'],
    impact: 'Builds institutional capacity',
  },
];

function LPCard({ lp }: { lp: LeveragePoint }) {
  const [expanded, setExpanded] = useState(false);
  const priorityColors = {
    critical: 'border-red-500/40 bg-red-500/5',
    high: 'border-yellow-500/40 bg-yellow-500/5',
    medium: 'border-blue-500/40 bg-blue-500/5',
    low: 'border-white/20 bg-white/5',
  };
  const priorityBadge = {
    critical: 'bg-red-500/10 text-red-300 border-red-500/30',
    high: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    medium: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    low: 'bg-white/5 text-white/40 border-white/10',
  };

  return (
    <div className={`glass rounded-xl p-5 card-hover border-l-2 ${priorityColors[lp.priority]}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-cinzel font-bold text-lg">
          {lp.id}
        </div>
        <div>
          <h3 className="font-cinzel text-sm font-bold text-white">{lp.name}</h3>
          <span className="text-[0.65rem] text-white/40">{lp.beieCluster} · {lp.budget}</span>
        </div>
        <span className={`ml-auto text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded border ${priorityBadge[lp.priority]}`}>
          {lp.priority}
        </span>
      </div>
      <p className="text-xs text-white/50 mb-3">{lp.description}</p>
      <div className="text-[0.7rem] text-gold/70 mb-2">{lp.impact}</div>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors"
      >
        {expanded ? <><ChevronUp size={14} /> Collapse</> : <><ChevronDown size={14} /> Actions ({lp.actions.length})</>}
      </button>
      
      {expanded && (
        <ul className="mt-3 space-y-1.5 animate-fade-in">
          {lp.actions.map((action, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
              {action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LeveragePoints() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Strategic Intervention</span>
          <h2 className="font-cinzel text-xl font-bold text-white mt-1">Critical Leverage Points</h2>
          <div className="w-10 h-1 bg-gold-grad rounded-full mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEVERAGE_POINTS.map((lp) => (
          <LPCard key={lp.id} lp={lp} />
        ))}
      </div>
    </div>
  );
}
