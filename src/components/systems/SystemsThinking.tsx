import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, RefreshCw, GitBranch, Target, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import { CAUSAL_LOOPS, SYSTEMS_ARCHETYPES } from '../../data/bird/clds';
import type { CausalLoop, SystemsArchetype } from '../../types';

const ARCHEtype_CONFIG = {
  limits_to_growth: { label: 'Limits to Growth', icon: TrendingUp, color: 'border-yellow-500' },
  shifting_the_burden: { label: 'Shifting the Burden', icon: AlertCircle, color: 'border-red-500' },
  tragedy_of_commons: { label: 'Tragedy of the Commons', icon: Target, color: 'border-blue-500' },
  success_to_the_successful: { label: 'Success to the Successful', icon: ArrowUpRight, color: 'border-green-500' },
  fixes_that_fail: { label: 'Fixes that Fail', icon: RefreshCw, color: 'border-purple-500' },
  erosion_of_goals: { label: 'Erosion of Goals', icon: TrendingUp, color: 'border-orange-500' },
  escalation: { label: 'Escalation', icon: AlertCircle, color: 'border-red-400' },
  growth_and_underinvestment: { label: 'Growth and Underinvestment', icon: TrendingUp, color: 'border-cyan-500' },
};

export function SystemsThinking() {
  const { getCurrentPlan } = useStrategicPlanStore();
  const currentPlan = getCurrentPlan();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cld' | 'archetypes' | 'leverage'>('cld');

  const loops = currentPlan?.causal_loops || CAUSAL_LOOPS;
  const archetypes = currentPlan?.systems_archetypes || SYSTEMS_ARCHETYPES;

  // Sample data for BIRD
  const sampleLoops: CausalLoop[] = [
    {
      id: '1', plan_id: '', name: 'R1: Investment-Development Virtuous Cycle',
      description: 'Investment inflows drive employment growth, expanding domestic markets and improving business climate, attracting further investment.',
      loop_type: 'reinforcing', variables: [], connections: [], leverage_points: [],
      created_at: '',
    },
    {
      id: '2', plan_id: '', name: 'R2: Governance-Investor Confidence Cycle',
      description: 'Governance transparency builds investor confidence, increasing investment inflows and expanding the tax base for further governance improvement.',
      loop_type: 'reinforcing', variables: [], connections: [], leverage_points: [],
      created_at: '',
    },
    {
      id: '3', plan_id: '', name: 'B1: Limits to Growth',
      description: 'Infrastructure and energy constraints act as a ceiling on growth, slowing the investment-development cycle unless proactively addressed.',
      loop_type: 'balancing', variables: [], connections: [], leverage_points: [],
      created_at: '',
    },
    {
      id: '4', plan_id: '', name: 'B2: Security-Investment Tensions',
      description: 'Security concerns deter investment, creating a downward spiral that must be interrupted through visible governance and infrastructure progress.',
      loop_type: 'balancing', variables: [], connections: [], leverage_points: [],
      created_at: '',
    },
  ];

  const sampleArchetypes: SystemsArchetype[] = [
    {
      id: '1', plan_id: '', name: 'Limits to Growth', archetype_type: 'limits_to_growth',
      description: 'The halal economy growth is constrained by infrastructure and energy limits. Acting on these constraints before they bind prevents the B1 balancing loop from binding.',
      symptoms: 'Investment inflows plateau after initial growth', structural_causes: 'Energy deficits, poor transport, low digital penetration',
      interventions: '₱500M WOW Matanog investment, ₱200M Energy Connectivity (ZBIP/mini-grids)',
      created_at: '',
    },
    {
      id: '2', plan_id: '', name: 'Success to the Successful', archetype_type: 'success_to_the_successful',
      description: 'Resources may flow disproportionately to established sectors unless balanced. The dual focus on Halal Park and Islamic Finance ensures equitable distribution.',
      symptoms: 'One sector dominates funding, starving innovation', structural_causes: 'Lack of cross-sector coordination, short-term ROI focus',
      interventions: 'Balanced budget allocation across all BEIE clusters, green economy safeguards',
      created_at: '',
    },
    {
      id: '3', plan_id: '', name: 'Fixes that Fail', archetype_type: 'fixes_that_fail',
      description: 'Ad-hoc tax incentives create temporary investment spikes but erode the tax base and fail to build institutional capacity.',
      symptoms: 'Investment spikes followed by withdrawals, weakened fiscal position', structural_causes: 'Reactive policymaking, short-term political incentives',
      interventions: 'Invest in systemic governance reforms (Forestry Code, JMC, BHB operationalization) rather than ad-hoc incentives',
      created_at: '',
    },
  ];

  if (!currentPlan) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Activity size={48} className="text-gold/30 mx-auto mb-4" />
        <h3 className="font-cinzel text-xl font-bold text-white mb-2">No Plan Selected</h3>
        <button onClick={() => navigate('/app/templates')} className="btn btn-primary">Create Plan</button>
      </div>
    );
  }

  const displayLoops = loops.length > 0 ? loops : sampleLoops;
  const displayArchetypes = archetypes.length > 0 ? archetypes : sampleArchetypes;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">Systems Thinking</h2>
          <p className="text-sm text-white/40">Causal loop diagrams, systems archetypes, and leverage points</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setActiveTab('cld')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'cld' ? 'bg-gold/20 text-gold' : 'text-white/40 hover:text-white/60'}`}>
          <GitBranch size={14} className="inline mr-1" /> Causal Loops
        </button>
        <button onClick={() => setActiveTab('archetypes')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'archetypes' ? 'bg-gold/20 text-gold' : 'text-white/40 hover:text-white/60'}`}>
          <Activity size={14} className="inline mr-1" /> Archetypes
        </button>
        <button onClick={() => setActiveTab('leverage')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'leverage' ? 'bg-gold/20 text-gold' : 'text-white/40 hover:text-white/60'}`}>
          <Target size={14} className="inline mr-1" /> Leverage Points
        </button>
      </div>

      {activeTab === 'cld' && (
        <div className="space-y-4">
          {displayLoops.map((loop) => (
            <div key={loop.id} className={`glass rounded-xl p-5 border-l-2 ${loop.loop_type === 'reinforcing' ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${loop.loop_type === 'reinforcing' ? 'badge-high' : 'badge-critical'}`}>{loop.loop_type === 'reinforcing' ? 'Reinforcing (R)' : 'Balancing (B)'}</span>
                <h3 className="font-cinzel text-sm font-bold text-white">{loop.name}</h3>
              </div>
              <p className="text-sm text-white/50 mb-3">{loop.description}</p>
              <div className="flex flex-wrap gap-2">
                {(loop.leverage_points || []).map((lp, i) => (
                  <span key={i} className="text-xs bg-gold/10 text-gold px-2 py-1 rounded">{String(lp)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'archetypes' && (
        <div className="space-y-4">
          {displayArchetypes.map((arch) => {
            const config = ARCHEtype_CONFIG[arch.archetype_type as keyof typeof ARCHEtype_CONFIG] || ARCHEtype_CONFIG.limits_to_growth;
            const Icon = config.icon;
            return (
              <div key={arch.id} className={`glass rounded-xl p-5 border-l-2 ${config.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className="text-gold" />
                  <h3 className="font-cinzel text-sm font-bold text-white">{arch.name}</h3>
                  <span className="badge badge-high text-xs ml-2">{config.label}</span>
                </div>
                <p className="text-sm text-white/50 mb-3">{arch.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-gold/70 font-medium mb-1">Symptoms</div>
                    <div className="text-white/40">{arch.symptoms}</div>
                  </div>
                  <div>
                    <div className="text-gold/70 font-medium mb-1">Structural Causes</div>
                    <div className="text-white/40">{arch.structural_causes}</div>
                  </div>
                  <div>
                    <div className="text-gold/70 font-medium mb-1">Interventions</div>
                    <div className="text-white/40">{arch.interventions}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'leverage' && (
        <div className="space-y-4">
          <div className="glass rounded-xl p-5 border-l-2 border-gold">
            <h3 className="font-cinzel text-sm font-bold text-gold mb-3">Critical Leverage Points for BIRD 2026-2035</h3>
            <div className="space-y-3">
              {[
                { id: 'LP1', name: 'Halal Governance & Certification', desc: 'Operationalizing BHB with OIC/SMIIC standards, breaking "Fixes that Fail" via credible certification. Budget: ₱200M', priority: 'Critical' },
                { id: 'LP2', name: 'Halal Hub Infrastructure', desc: 'WOW Matanog SEZ launch with anchor tenant pre-qualification, raising the B1 Growth Ceiling. Budget: ₱500M', priority: 'Critical' },
                { id: 'LP3', name: 'Digital Facilitation', desc: 'BEGMP/BIFOSS full rollout with 1-day digital business registration, activating R2 Governance-Confidence loop. Budget: ₱150M', priority: 'High' },
                { id: 'LP4', name: 'Islamic Finance Foundation', desc: 'Shariah-compliant microfinance, Takaful framework, Sukuk readiness. Budget: ₱100M', priority: 'High' },
                { id: 'LP5', name: 'Green Economy Framework', desc: 'Forestry Code, MENRE-MILG JMC for Carbon Credits and PES markets. Budget: ₱50M', priority: 'Critical' },
                { id: 'LP6', name: 'Energy Connectivity', desc: 'ZBIP facilitation and solar mini-grids for 80% electrification pathway. Budget: ₱200M', priority: 'High' },
                { id: 'LP7', name: 'Human Capital', desc: 'Halal Expert Training Program - first cadre of 50 certification officers. Budget: ₱100M', priority: 'Medium' },
              ].map((lp) => (
                <div key={lp.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-bold text-xs flex-shrink-0">{lp.id}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white">{lp.name}</span>
                      <span className={`badge badge-${lp.priority === 'Critical' ? 'critical' : lp.priority === 'High' ? 'high' : 'medium'}`}>{lp.priority}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1">{lp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
