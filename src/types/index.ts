export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  organization: string | null;
  job_title: string | null;
  phone: string | null;
  role: 'user' | 'admin' | 'super_admin';
  assigned_regions: string[];
  notification_preferences: {
    email: boolean;
    kpi_alerts: boolean;
    weekly_digest: boolean;
    plan_reminders: boolean;
    team_updates: boolean;
  };
  is_active: boolean;
  last_seen_at: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  industry: string | null;
  region: string | null;
  created_by: string;
  created_at: string;
}

export interface StrategicPlan {
  id: string;
  user_id: string;
  organization_id: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  industry: string;
  region: string;
  start_year: number;
  end_year: number;
  status: 'draft' | 'active' | 'archived' | 'completed';
  budget_total: number;
  budget_allocated: number;
  progress_pct: number;
  last_synced_at: string | null;
  sync_status: 'synced' | 'pending' | 'syncing' | 'error' | 'offline';
  version: number;
  is_template: boolean;
  template_id: string | null;
  local_id: string | null;
  created_at: string;
  updated_at: string;
  // computed
  swot_items?: SwotItem[];
  strategies?: StrategyMatrix[];
  scorecards?: BalancedScorecard[];
  paps?: Pap[];
  causal_loops?: CausalLoop[];
  systems_archetypes?: SystemsArchetype[];
}

export interface SwotItem {
  id: string;
  plan_id: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  description: string | null;
  impact: number;
  likelihood: number;
  resilience_index: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  ai_generated: boolean;
  ai_recommendation: string | null;
  beie_cluster: string;
  assigned_to: string | null;
  status: 'active' | 'resolved' | 'archived';
  created_at: string;
  updated_at: string;
  // local
  isNew?: boolean;
  isModified?: boolean;
}

export interface StrategyMatrix {
  id: string;
  plan_id: string;
  quadrant: 'SO' | 'ST' | 'WO' | 'WT';
  strategy: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  ai_generated: boolean;
  linked_swot_items: string[];
  beie_cluster: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  isNew?: boolean;
  isModified?: boolean;
}

export interface BalancedScorecard {
  id: string;
  plan_id: string;
  perspective: 'financial' | 'customer' | 'internal_process' | 'learning_growth';
  description: string | null;
  weight_pct: number;
  created_at: string;
  objectives?: ScorecardObjective[];
}

export interface ScorecardObjective {
  id: string;
  scorecard_id: string;
  plan_id: string;
  title: string;
  description: string | null;
  target_value: string | null;
  current_value: string | null;
  progress_pct: number;
  priority: string;
  ai_suggested: boolean;
  beie_cluster: string;
  status: string;
  created_at: string;
  updated_at: string;
  kpis?: ScorecardKpi[];
  isNew?: boolean;
  isModified?: boolean;
}

export interface ScorecardKpi {
  id: string;
  objective_id: string;
  plan_id: string;
  name: string;
  description: string | null;
  target_value: number;
  current_value: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  formula: string | null;
  data_source: string | null;
  status: 'on_track' | 'at_risk' | 'off_track' | 'achieved';
  ai_suggested: boolean;
  alert_threshold: number;
  baseline_value: number;
  target_year: number;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  isNew?: boolean;
  isModified?: boolean;
}

export interface Pap {
  id: string;
  plan_id: string;
  type: 'program' | 'activity' | 'project';
  code: string | null;
  title: string;
  description: string | null;
  objective_id: string | null;
  beie_cluster: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planned' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  budget_allocated: number;
  budget_spent: number;
  progress_pct: number;
  start_date: string | null;
  end_date: string | null;
  due_quarter: string;
  lead_agency: string | null;
  dependencies: string[];
  ai_generated: boolean;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  isNew?: boolean;
  isModified?: boolean;
}

export interface ActivityLog {
  id: string;
  plan_id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: User;
}

export interface Comment {
  id: string;
  plan_id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  parent_id: string | null;
  content: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  replies?: Comment[];
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string | null;
  industry: string;
  region: string;
  template_data: Record<string, unknown>;
  is_public: boolean;
  created_by: string | null;
  organization_id: string | null;
  created_at: string;
}

export interface PlanShare {
  id: string;
  plan_id: string;
  shared_with_user_id: string | null;
  shared_with_org_id: string | null;
  permission_level: 'viewer' | 'editor' | 'admin';
  shared_by: string;
  shared_at: string;
  expires_at: string | null;
  accepted: boolean;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'member' | 'editor' | 'admin';
  joined_at: string;
}

export interface CausalLoop {
  id: string;
  plan_id?: string;
  name: string;
  description: string | null;
  loop_type: 'reinforcing' | 'balancing';
  variables: unknown[];
  connections: unknown[];
  leverage_points: unknown[];
  created_at?: string;
}

export interface SystemsArchetype {
  id: string;
  plan_id?: string;
  name: string;
  description: string | null;
  archetype_type: string;
  symptoms: string | null;
  structural_causes: string | null;
  interventions: string | null;
  created_at?: string;
}

export interface AppState {
  plans: StrategicPlan[];
  currentPlan: StrategicPlan | null;
  isLoading: boolean;
  isOnline: boolean;
  syncStatus: 'synced' | 'pending' | 'syncing' | 'error' | 'offline';
  lastSync: string | null;
  user: User | null;
  session: unknown | null;
}

export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error' | 'offline';
