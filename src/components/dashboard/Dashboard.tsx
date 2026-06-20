import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, TrendingUp, Target, Shield, Users, Activity, Brain, Zap, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import { useAuth } from '../../hooks/useAuth';
import type { StrategicPlan } from '../../types';

const PILLAR_CONFIG = {
  'financial': { label: 'Financial', color: 'border-green-500', icon: TrendingUp, accent: 'text-green-400' },
  'customer': { label: 'Stakeholder', color: 'border-blue-500', icon: Users, accent: 'text-blue-400' },
  'internal_process': { label: 'Process', color: 'border-yellow-500', icon: Target, accent: 'text-yellow-400' },
  'learning_growth': { label: 'Learning', color: 'border-purple-500', icon: Brain, accent: 'text-purple-400' },
};

export function Dashboard() {
  const { plans, getCurrentPlan, setCurrentPlan } = useStrategicPlanStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const currentPlan = getCurrentPlan();

  useEffect(() => {
    if (currentPlan) {
      setCurrentPlanId(currentPlan.id || currentPlan.local_id || null);
    }
  }, [currentPlan]);

  const stats = {
    totalPlans: plans.length,
    activePlans: plans.filter((p: StrategicPlan) => p.status === 'active').length,
    completedPlans: plans.filter((p: StrategicPlan) => p.status === 'completed').length,
    avgProgress: plans.length > 0
      ? Math.round(plans.reduce((sum: number, p: StrategicPlan) => sum + p.progress_pct, 0) / plans.length)
      : 0,
  };

  const recentPlans = [...plans]
    .sort((a: StrategicPlan, b: StrategicPlan) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">Dashboard</h2>
          <p className="text-sm text-white/40">Overview of your strategic plans and activities</p>
        </div>
        <button onClick={() => navigate('/app/templates')} className="btn btn-primary">
          <Plus size={16} /> New Plan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 border-l-2 border-gold">
          <div className="font-cinzel text-2xl font-bold text-gold">{stats.totalPlans}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Total Plans</div>
        </div>
        <div className="glass rounded-xl p-4 border-l-2 border-green-500">
          <div className="font-cinzel text-2xl font-bold text-green-400">{stats.activePlans}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Active</div>
        </div>
        <div className="glass rounded-xl p-4 border-l-2 border-blue-500">
          <div className="font-cinzel text-2xl font-bold text-blue-400">{stats.completedPlans}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Completed</div>
        </div>
        <div className="glass rounded-xl p-4 border-l-2 border-yellow-500">
          <div className="font-cinzel text-2xl font-bold text-yellow-400">{stats.avgProgress}%</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Avg Progress</div>
        </div>
      </div>

      {/* Current Plan Selection */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cinzel text-sm font-bold text-gold">Current Plan</h3>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={currentPlanId || ''}
            onChange={(e) => setCurrentPlan(e.target.value)}
            className="text-sm w-64"
          >
            <option value="">Select a plan...</option>
            {plans.map((p) => (
              <option key={p.id || p.local_id || ''} value={p.id || p.local_id || ''}>{p.title}</option>
            ))}
          </select>
          <button onClick={() => navigate('/app/templates')} className="btn btn-primary text-sm px-3 py-2">
            <Plus size={14} /> New Plan
          </button>
        </div>
      </div>

      {/* Recent Plans */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cinzel text-sm font-bold text-gold">Recent Plans</h3>
          <button onClick={() => navigate('/app/templates')} className="text-sm text-gold hover:text-gold-light transition-colors">
            View All <ArrowRight size={14} className="inline" />
          </button>
        </div>
        <div className="space-y-3">
          {recentPlans.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <FileText size={32} className="mx-auto mb-2 opacity-30" />
              <p>No plans yet. Create your first strategic plan.</p>
              <button onClick={() => navigate('/app/templates')} className="btn btn-primary mt-4">
                <Plus size={14} /> Create Plan
              </button>
            </div>
          ) : (
            recentPlans.map((plan: StrategicPlan) => (
              <div
                key={plan.id || plan.local_id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => { setCurrentPlan(plan.id || plan.local_id || ''); navigate('/app/swot'); }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${plan.status === 'active' ? 'bg-green-400' : plan.status === 'completed' ? 'bg-blue-400' : 'bg-yellow-400'}`} />
                  <div>
                    <div className="font-medium text-sm text-white">{plan.title}</div>
                    <div className="text-xs text-white/40">{plan.industry} · {plan.region}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-white/60">{plan.progress_pct}%</div>
                  <ArrowRight size={14} className="text-white/20" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => navigate('/app/swot')} className="glass rounded-xl p-4 card-hover text-center">
          <Shield size={20} className="text-green-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-white">SWOT</div>
          <div className="text-xs text-white/40">Analysis</div>
        </button>
        <button onClick={() => navigate('/app/strategy')} className="glass rounded-xl p-4 card-hover text-center">
          <Zap size={20} className="text-yellow-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-white">Strategy</div>
          <div className="text-xs text-white/40">Matrix</div>
        </button>
        <button onClick={() => navigate('/app/scorecard')} className="glass rounded-xl p-4 card-hover text-center">
          <TrendingUp size={20} className="text-blue-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-white">Scorecard</div>
          <div className="text-xs text-white/40">BSC</div>
        </button>
        <button onClick={() => navigate('/app/systems')} className="glass rounded-xl p-4 card-hover text-center">
          <Activity size={20} className="text-purple-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-white">Systems</div>
          <div className="text-xs text-white/40">Thinking</div>
        </button>
      </div>
    </div>
  );
}
