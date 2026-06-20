import { useState, useMemo, useCallback }  from 'react';
import { PARETO_KPIS, BSC_LEVERAGE_POINTS, type KPI, type BSCLeveragePoint } from '../data/bird/kpis';
import { ACTION_PLAN_2026, ACTION_SUMMARY, type ActionPlan } from '../data/bird/actions';
import { CAUSAL_LOOPS, SYSTEMS_ARCHETYPES, type CausalLoop, type SystemsArchetype } from '../data/bird/clds';
import { PHASES, type PhaseTracker } from '../data/bird/phases';

export interface BIRDDataState {
  // KPIs
  kpis: KPI[];
  bscLeveragePoints: BSCLeveragePoint[];
  
  // Actions
  actions: ActionPlan[];
  actionSummary: typeof ACTION_SUMMARY;
  
  // Systems
  causalLoops: CausalLoop[];
  systemsArchetypes: SystemsArchetype[];
  
  // Phases
  phases: PhaseTracker[];
  
  // Computed
  totalBudget: number;
  totalBudgetFormatted: string;
  criticalActions: number;
  activeLoops: number;
  completedMilestones: number;
  totalMilestones: number;
}

export function useBIRDData(): BIRDDataState {
  const kpis = useMemo(() => PARETO_KPIS, []);
  const bscLeveragePoints = useMemo(() => BSC_LEVERAGE_POINTS, []);
  const actions = useMemo(() => ACTION_PLAN_2026, []);
  const actionSummary = useMemo(() => ACTION_SUMMARY, []);
  const causalLoops = useMemo(() => CAUSAL_LOOPS, []);
  const systemsArchetypes = useMemo(() => SYSTEMS_ARCHETYPES, []);
  const phases = useMemo(() => PHASES, []);

  const computed = useMemo(() => {
    const totalBudget = actions.reduce((sum, a) => sum + a.budgetValue, 0);
    const criticalActions = actions.filter((a) => a.priority === 'critical').length;
    const activeLoops = causalLoops.filter((l) => l.status === 'active').length;
    const completedMilestones = phases.reduce((sum, p) => sum + p.milestones.filter((m) => m.status === 'done').length, 0);
    const totalMilestones = phases.reduce((sum, p) => sum + p.milestones.length, 1);
    
    const formatBudget = (v: number) => {
      if (v >= 1e9) return `₱${(v / 1e9).toFixed(1)}B`;
      if (v >= 1e6) return `₱${(v / 1e6).toFixed(0)}M`;
      return `₱${v.toLocaleString()}`;
    };
    
    return {
      totalBudget,
      totalBudgetFormatted: formatBudget(totalBudget),
      criticalActions,
      activeLoops,
      completedMilestones,
      totalMilestones,
    };
  }, [actions, causalLoops, phases]);

  return {
    kpis,
    bscLeveragePoints,
    actions,
    actionSummary,
    causalLoops,
    systemsArchetypes,
    phases,
    ...computed,
  };
}
