import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Crosshair, GitBranch, BarChart3, ListChecks,
  Activity, FileText, Plus, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Clock, DollarSign, Users, Calendar, ArrowRight,
  Target, Zap, Shield, Globe, Sparkles
} from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import type { StrategicPlan, ScorecardKpi, Pap } from '../../types';

function KpiCard({ kpi }: { kpi: ScorecardKpi }) {
  const statusColors = {
    on_track: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: CheckCircle, color: 'text-green-400' },
    at_risk: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertTriangle, color: 'text-yellow-400' },
    off_track: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: TrendingDown, color: 'text-red-400' },
    achieved: { bg: 'bg-gold/10', border: 'border-gold/30', icon: CheckCircle, color: 'text-gold' },
  };
  const style = statusColors[kpi.status] || statusColors.on_track;
  const Icon = style.icon;
  const progress = kpi.target_value > 0 ? Math.min(Math.round((kpi.current_value / kpi.target_value) * 100), 100) : 0;

  return (
    <div className={`rounded-lg border p-4 ${style.bg} ${style.border}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">{kpi.name}</span>
        <Icon size={16} className={style.color} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-white">{kpi.current_value.toLocaleString()}</span>
        <span className="text-xs text-white/40">/ {kpi.target_value.toLocaleString()} {kpi.unit}</span>
      </div>
      <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${style.color.replace('text-', 'bg-')}`} style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-1 flex justify-between">
        <span className="text-xs text-white/40">{progress}%</span>
        <span className={`text-xs ${style.color} capitalize`}>{kpi.status.replace('_', ' ')}</span>
      </div>
    </div>
  );
}

function PapCard({ pap }: { pap: Pap }) {
  const statusColors = {
    planned: 'bg-white/5 text-white/40',
    in_progress: 'bg-blue-500/10 text-blue-300',
    completed: 'bg-green-500/10 text-green-300',
    delayed: 'bg-red-500/10 text-red-300',
    cancelled: 'bg-gray-500/10 text-gray-300',
  };

  return (
    <div className="glass rounded-lg p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <span className={`badge ${statusColors[pap.status]}`}>{pap.status.replace('_', ' ')}</span>
        <span className="text-xs text-white/30">{pap.type}</span>
      </div>
      <h4 className="font-medium text-sm text-white mb-1">{pap.title}</h4>
      <p className="text-xs text-white/40 mb-3">{pap.lead_agency || 'No lead agency'}</p>
      <div className="flex items-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1"><DollarSign size={12} /> ₱{pap.budget_allocated.toLocaleString()}</span>
        <span className="flex items-center gap-1"><Calendar size={12} /> {pap.end_date || 'TBD'}</span>
      </div>
      <div className="mt-2 w-full bg-white/10 rounded-full h-1">
        <div className="bg-gold h-1 rounded-full" style={{ width: `${pap.progress_pct}%` }} />
      </div>
    </div>
  );
}

function QuickNavCard({ icon: Icon, title, desc, path, color }: { icon: typeof LayoutDashboard; title: string; desc: string; path: string; color: string }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/app/${path}`)} className="glass rounded-xl p-5 card-hover text-left group">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="font-cinzel text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-white/40">{desc}</p>
      <ArrowRight size={14} className="mt-3 text-white/20 group-hover:text-gold transition-colors" />
    </button>
  );
}

export function Dashboard() {
  const { plans, currentPlanId, setCurrentPlan, isLoading, user } = useStrategicPlanStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlanLocal] = useState<StrategicPlan | null>(null);
  const [kpis, setKpis] = useState<ScorecardKpi[]>([]);
  const [paps, setPaps] = useState<Pap[]>([]);
  const [activity, setActivity] = useState<Array<{ action_type: string; created_at: string; details: Record<string, unknown> }>>([]);

  useEffect(() => {
    const plan = plans.find((p) => p.id === currentPlanId || p.local_id === currentPlanId);
    if (plan) {
      setCurrentPlanLocal(plan);
      setKpis(plan.scorecards?.flatMap((sc) => sc.objectives?.flatMap((o) => o.kpis || []) || []) || []);
      setPaps(plan.paps || []);
    }
  }, [plans, currentPlanId]);

  useEffect(() => {
    if (!isAuthenticated || !currentPlan?.id) return;
    (async () => {
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('plan_id', currentPlan.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setActivity(data);
    })();
  }, [isAuthenticated, currentPlan?.id]);

  const quickNav = [
    { icon: Crosshair, title: 'SWOT Analysis', desc: 'Assess strengths, weaknesses, opportunities, threats', path: 'swot', color: 'bg-green-500/20' },
    { icon: GitBranch, title: 'Strategy Matrix', desc: 'Generate TOWS strategies from SWOT', path: 'strategy', color: 'bg-blue-500/20' },
    { icon: BarChart3, title: 'Scorecard', desc: 'Track KPIs across 4 BSC perspectives', path: 'scorecard', color: 'bg-gold/20' },
    { icon: ListChecks, title: 'PAPs', desc: 'Manage programs, activities, projects', path: 'paps', color: 'bg-purple-500/20' },
    { icon: Activity, title: 'Systems Thinking', desc: 'Causal loops and archetypes', path: 'systems', color: 'bg-teal-500/20' },
    { icon: FileText, title: 'Export', desc: 'Generate professional plan documents', path: 'export', color: 'bg-orange-500/20' },
  ];

  const planSelector = (
    <div className="glass rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-lg font-bold text-gold">{currentPlan?.title || 'Select a Plan'}</h2>
          <p className="text-xs text-white/40 mt-0.5">{currentPlan?.description || 'No plan selected'}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={currentPlanId || ''}
            onChange={(e) => setCurrentPlan(e.target.value)}
            className="text-sm w-64"
          >
            <option value="">Select a plan...</option>
            {plans.map((p) => (
              <option key={p.id || p.local_id || undefined} value={p.id || p.local_id || undefined}>{p.title}</option>
            ))}
          </select>
          <button onClick={() => navigate('/app/templates')} className="btn btn-primary text-sm px-3 py-2">
            <Plus size={14} /> New Plan
          </button>
        </div>
      </div>
      {currentPlan && (
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="font-cinzel text-xl font-bold text-gold">{currentPlan.progress_pct}%</div>
            <div className="text-xs text-white/40">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="font-cinzel text-xl font-bold text-gold">₱{currentPlan.budget_allocated?.toLocaleString() || 0}</div>
            <div className="text-xs text-white/40">Budget Allocated</div>
          </div>
          <div className="text-center">
            <div className="font-cinzel text-xl font-bold text-gold">{currentPlan.swot_items?.length || 0}</div>
            <div className="text-xs text-white/40">SWOT Items</div>
          </div>
          <div className="text-center">
            <div className="font-cinzel text-xl font-bold text-gold">{currentPlan.paps?.length || 0}</div>
            <div className="text-xs text-white/40">PAPs</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Plan selector */}
      {planSelector}

      {/* Quick nav */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickNav.map((item) => (
          <QuickNavCard key={item.path} {...item} />
        ))}
      </div>

      {/* KPIs */}
      {kpis.length > 0 && (
        <div>
          <h3 className="font-cinzel text-sm font-bold text-gold/70 mb-3 uppercase tracking-wider">Key Performance Indicators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.slice(0, 8).map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>
      )}

      {/* PAPs */}
      {paps.length > 0 && (
        <div>
          <h3 className="font-cinzel text-sm font-bold text-gold/70 mb-3 uppercase tracking-wider">Programs, Activities & Projects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paps.slice(0, 6).map((pap) => (
              <PapCard key={pap.id} pap={pap} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {activity.length > 0 && (
        <div className="glass rounded-xl p-4">
          <h3 className="font-cinzel text-sm font-bold text-gold/70 mb-3 uppercase tracking-wider">Recent Activity</h3>
          <div className="space-y-2">
            {activity.slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/60 py-2 border-b border-white/5 last:border-0">
                <Clock size={14} className="text-gold/50" />
                <span className="capitalize">{a.action_type.replace(/_/g, ' ')}</span>
                <span className="text-white/30 ml-auto text-xs">{new Date(a.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!currentPlan && (
        <div className="glass rounded-xl p-12 text-center">
          <Sparkles size={48} className="text-gold/30 mx-auto mb-4" />
          <h3 className="font-cinzel text-xl font-bold text-white mb-2">No Strategic Plan Selected</h3>
          <p className="text-white/40 mb-6 max-w-md mx-auto">Create a new plan or select an existing one to start your strategic planning journey.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/app/templates')} className="btn btn-primary">
              <Plus size={14} /> Create Plan
            </button>
            <button onClick={() => navigate('/app/templates')} className="btn btn-secondary">
              <FileText size={14} /> Browse Templates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
