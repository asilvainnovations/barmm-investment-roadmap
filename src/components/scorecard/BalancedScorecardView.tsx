import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, DollarSign, Users, Cog, GraduationCap, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import type { ScorecardObjective, ScorecardKpi } from '../../types';

const PERSPECTIVE_CONFIG = {
  financial: { label: 'Financial', color: 'border-gold', bg: 'bg-gold/5', icon: DollarSign, weight: 25 },
  customer: { label: 'Customer / Resident', color: 'border-green-500', bg: 'bg-green-500/5', icon: Users, weight: 25 },
  internal_process: { label: 'Internal Process', color: 'border-blue-500', bg: 'bg-blue-500/5', icon: Cog, weight: 25 },
  learning_growth: { label: 'Learning & Growth', color: 'border-purple-500', bg: 'bg-purple-500/5', icon: GraduationCap, weight: 25 },
};

function KpiMiniCard({ kpi }: { kpi: ScorecardKpi }) {
  const statusColors = {
    on_track: 'text-green-400',
    at_risk: 'text-yellow-400',
    off_track: 'text-red-400',
    achieved: 'text-gold',
  };
  const progress = kpi.target_value > 0 ? Math.min(Math.round((kpi.current_value / kpi.target_value) * 100), 100) : 0;
  return (
    <div className="glass rounded-lg p-3 border border-white/5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/60">{kpi.name}</span>
        <span className={`text-xs ${statusColors[kpi.status]}`}>{kpi.status.replace('_', ' ')}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-white">{kpi.current_value.toLocaleString()}</span>
        <span className="text-xs text-white/30">/ {kpi.target_value.toLocaleString()} {kpi.unit}</span>
      </div>
      <div className="mt-1.5 w-full bg-white/10 rounded-full h-1">
        <div className="bg-gold h-1 rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function ObjectiveCard({ objective, onEdit, onDelete, onAddKpi }: { objective: ScorecardObjective; onEdit: (o: ScorecardObjective) => void; onDelete: (id: string) => void; onAddKpi: (objId: string) => void }) {
  return (
    <div className="glass rounded-lg p-4 card-hover bsc-financial">
      <div className="flex items-center justify-between mb-2">
        <span className={`badge badge-${objective.priority === 'critical' ? 'critical' : objective.priority === 'high' ? 'high' : 'medium'}`}>{objective.priority}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onAddKpi(objective.id)} className="p-1 text-white/30 hover:text-gold"><Plus size={12} /></button>
          <button onClick={() => onEdit(objective)} className="p-1 text-white/30 hover:text-gold"><Target size={12} /></button>
          <button onClick={() => onDelete(objective.id)} className="p-1 text-white/30 hover:text-red-400"><X size={12} /></button>
        </div>
      </div>
      <h4 className="font-medium text-sm text-white mb-1">{objective.title}</h4>
      <p className="text-xs text-white/40 mb-2">{objective.description}</p>
      <div className="flex items-center gap-3 text-xs text-white/30 mb-3">
        <span className="flex items-center gap-1"><Target size={12} /> {objective.target_value || 'N/A'}</span>
        <span className="flex items-center gap-1"><TrendingUp size={12} /> {objective.progress_pct}%</span>
      </div>
      <div className="space-y-2">
        {objective.kpis?.map((kpi) => <KpiMiniCard key={kpi.id} kpi={kpi} />)}
      </div>
    </div>
  );
}

function KpiModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (kpi: Partial<ScorecardKpi>) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [unit, setUnit] = useState('count');
  const [frequency, setFrequency] = useState<ScorecardKpi['frequency']>('monthly');
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [baselineValue, setBaselineValue] = useState(0);
  const [targetYear, setTargetYear] = useState(2026);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-gold/20 bg-gradient-to-b from-[#022c22] to-[#011a12] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-cinzel text-lg font-bold text-gold mb-4">Add KPI</h3>
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="KPI Name" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={targetValue} onChange={(e) => setTargetValue(Number(e.target.value))} placeholder="Target Value" />
            <input type="number" value={currentValue} onChange={(e) => setCurrentValue(Number(e.target.value))} placeholder="Current Value" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit (e.g. percent, count)" />
            <select value={frequency} onChange={(e) => setFrequency(e.target.value as ScorecardKpi['frequency'])}>
              {['daily', 'weekly', 'monthly', 'quarterly', 'annual'].map((f) => <option key={f} value={f} className="bg-[#022c22] capitalize">{f}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={alertThreshold} onChange={(e) => setAlertThreshold(Number(e.target.value))} placeholder="Alert Threshold %" />
            <input type="number" value={targetYear} onChange={(e) => setTargetYear(Number(e.target.value))} placeholder="Target Year" />
          </div>
          <button onClick={() => { onSave({ name, description, target_value: targetValue, current_value: currentValue, unit, frequency, alert_threshold: alertThreshold, baseline_value: baselineValue, target_year: targetYear }); onClose(); }} className="btn btn-primary w-full">
            <Plus size={14} /> Add KPI
          </button>
        </div>
      </div>
    </div>
  );
}

export function BalancedScorecardView() {
  const { getCurrentPlan, addObjective, addKpi, addNotification } = useStrategicPlanStore();
  const { isAuthenticated } = useAuth();
  const currentPlan = getCurrentPlan();
  const navigate = useNavigate();
  const [showKpiModal, setShowKpiModal] = useState(false);
  const [activeObjectiveId, setActiveObjectiveId] = useState<string | null>(null);

  const scorecards = currentPlan?.scorecards || [];
  const grouped = {
    financial: scorecards.find((s) => s.perspective === 'financial'),
    customer: scorecards.find((s) => s.perspective === 'customer'),
    internal_process: scorecards.find((s) => s.perspective === 'internal_process'),
    learning_growth: scorecards.find((s) => s.perspective === 'learning_growth'),
  };

  const handleAiKpi = async () => {
    const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
    const ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-strategy-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}` },
        body: JSON.stringify({
          section: 'kpi',
          plan_context: {
            title: currentPlan?.title,
            industry: currentPlan?.industry,
            region: currentPlan?.region,
          },
        }),
      });
      const data = await response.json();
      const suggestions: ScorecardKpi[] = (data.suggestions || []).map((s: Record<string, unknown>) => ({
        id: crypto.randomUUID(),
        objective_id: activeObjectiveId || '',
        plan_id: currentPlan?.id || '',
        name: s.name as string,
        description: s.description as string,
        target_value: s.target_value as number,
        current_value: 0,
        unit: s.unit as string,
        frequency: s.frequency as ScorecardKpi['frequency'],
        formula: null,
        data_source: null,
        status: 'on_track',
        ai_suggested: true,
        alert_threshold: s.alert_threshold as number,
        baseline_value: 0,
        target_year: s.target_year as number,
        assigned_to: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      if (suggestions.length > 0 && activeObjectiveId) {
        const planId = currentPlan?.id || currentPlan?.local_id || '';
        suggestions.forEach((kpi) => addKpi(planId, activeObjectiveId, kpi));
        addNotification({ message: `Added ${suggestions.length} AI KPI suggestions`, type: 'success' });
      }
    } catch (err) {
      addNotification({ message: 'AI KPI generation failed', type: 'error' });
    }
  };

  const handleAddKpi = (kpi: Partial<ScorecardKpi>) => {
    if (!currentPlan || !activeObjectiveId) return;
    const planId = currentPlan.id || currentPlan.local_id || '';
    const newKpi: ScorecardKpi = {
      id: crypto.randomUUID(),
      objective_id: activeObjectiveId,
      plan_id: planId,
      name: kpi.name!,
      description: kpi.description || null,
      target_value: kpi.target_value || 0,
      current_value: kpi.current_value || 0,
      unit: kpi.unit || 'count',
      frequency: kpi.frequency || 'monthly',
      formula: null,
      data_source: null,
      status: 'on_track',
      ai_suggested: false,
      alert_threshold: kpi.alert_threshold || 80,
      baseline_value: kpi.baseline_value || 0,
      target_year: kpi.target_year || 2026,
      assigned_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addKpi(planId, activeObjectiveId, newKpi);
    addNotification({ message: 'KPI added', type: 'success' });
    if (isAuthenticated && currentPlan.id) {
      supabase.from('scorecard_kpis').insert({ ...newKpi, plan_id: currentPlan.id });
    }
  };

  const handleAddObjective = (perspective: string) => {
    if (!currentPlan) return;
    const planId = currentPlan.id || currentPlan.local_id || '';
    const scorecard = scorecards.find((s) => s.perspective === perspective);
    if (!scorecard) {
      addNotification({ message: 'Scorecard not found for this perspective', type: 'error' });
      return;
    }
    const newObjective: ScorecardObjective = {
      id: crypto.randomUUID(),
      scorecard_id: scorecard.id,
      plan_id: planId,
      title: 'New Objective',
      description: null,
      target_value: null,
      current_value: null,
      progress_pct: 0,
      priority: 'medium',
      ai_suggested: false,
      beie_cluster: 'foundations',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      kpis: [],
      isNew: true,
    };
    addObjective(planId, scorecard.id, newObjective);
    addNotification({ message: 'Objective added', type: 'success' });
  };

  if (!currentPlan) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <BarChart3 size={48} className="text-gold/30 mx-auto mb-4" />
        <h3 className="font-cinzel text-xl font-bold text-white mb-2">No Plan Selected</h3>
        <p className="text-white/40 mb-6">Select or create a plan to build your balanced scorecard.</p>
        <button onClick={() => navigate('/app/templates')} className="btn btn-primary">Create Plan</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">Balanced Scorecard</h2>
          <p className="text-sm text-white/40">Track objectives and KPIs across four strategic perspectives</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(Object.keys(PERSPECTIVE_CONFIG) as Array<keyof typeof PERSPECTIVE_CONFIG>).map((perspective) => {
          const config = PERSPECTIVE_CONFIG[perspective];
          const Icon = config.icon;
          const scorecard = grouped[perspective];
          const objectives = scorecard?.objectives || [];
          return (
            <div key={perspective} className={`glass rounded-xl border-t-2 ${config.color} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-gold" />
                  <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">{config.label}</h3>
                  <span className="text-xs text-white/30">({objectives.length} objectives)</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAddObjective(perspective)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-gold transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {objectives.map((obj) => (
                  <ObjectiveCard
                    key={obj.id}
                    objective={obj}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onAddKpi={(objId) => { setActiveObjectiveId(objId); setShowKpiModal(true); }}
                  />
                ))}
                {objectives.length === 0 && (
                  <div className="text-center py-8 text-white/20 text-sm">
                    No objectives in this perspective.
                    <button onClick={() => handleAddObjective(perspective)} className="block mx-auto mt-2 text-gold hover:text-gold-light text-xs">
                      <Plus size={12} className="inline" /> Add objective
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <KpiModal isOpen={showKpiModal} onClose={() => setShowKpiModal(false)} onSave={handleAddKpi} />
    </div>
  );
}
