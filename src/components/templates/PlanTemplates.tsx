import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, Copy, CheckCircle, Star, Building, GraduationCap, Stethoscope, Cpu, Leaf, Briefcase } from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import { useAuth } from '../../hooks/useAuth';
import type { StrategicPlan, SwotItem, StrategyMatrix, BalancedScorecard, ScorecardObjective, ScorecardKpi, Pap } from '../../types';

const PREBUILT_TEMPLATES = [
  {
    id: 'investment-bird',
    name: 'BIRD 2026-2035 - Investment',
    industry: 'Investment',
    region: 'BARMM',
    icon: Briefcase,
    description: 'Bangsamoro Investment Roadmap with halal economy, Islamic finance, and green economy framework.',
    featured: true,
  },
  {
    id: 'healthcare',
    name: 'Healthcare Strategic Plan',
    industry: 'Healthcare',
    region: 'BARMM',
    icon: Stethoscope,
    description: 'Healthcare sector planning with patient outcomes, facility development, and workforce KPIs.',
    featured: false,
  },
  {
    id: 'education',
    name: 'Education Development Plan',
    industry: 'Education',
    region: 'BARMM',
    icon: GraduationCap,
    description: 'Education sector roadmap with literacy targets, enrollment growth, and curriculum development.',
    featured: false,
  },
  {
    id: 'technology',
    name: 'Digital Transformation',
    industry: 'Technology',
    region: 'BARMM',
    icon: Cpu,
    description: 'ICT and digital infrastructure planning with connectivity, literacy, and innovation KPIs.',
    featured: false,
  },
  {
    id: 'agriculture',
    name: 'Agribusiness & Fisheries',
    industry: 'Agriculture',
    region: 'BARMM',
    icon: Leaf,
    description: 'AFF sector planning with productivity, climate resilience, and value chain development.',
    featured: false,
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Ecozone',
    industry: 'Manufacturing',
    region: 'BARMM',
    icon: Building,
    description: 'Industrial planning with SEZ development, export capacity, and skills alignment.',
    featured: false,
  },
];

function generateBIRDPlan(): StrategicPlan {
  const planId = crypto.randomUUID();
  const now = new Date().toISOString();

  const swotItems: SwotItem[] = [
    { id: crypto.randomUUID(), plan_id: planId, category: 'strength', title: 'Halal Legitimacy & Cultural Credibility', description: 'Authentic Muslim-majority identity providing unmatched branding advantage for OIC markets', impact: 5, likelihood: 5, resilience_index: 5.0, priority: 'critical', ai_generated: false, ai_recommendation: null, beie_cluster: 'transformers', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'strength', title: 'Domestic Halal Demand (5.69M Muslims)', description: 'Strong local consumer base driving market absorption and product testing', impact: 5, likelihood: 5, resilience_index: 5.0, priority: 'critical', ai_generated: false, ai_recommendation: null, beie_cluster: 'connectors', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'strength', title: 'Young, Growing Population (3.43% annual)', description: 'Highest growth in Maguindanao del Norte (4.3%), providing workforce pipeline', impact: 5, likelihood: 5, resilience_index: 5.0, priority: 'high', ai_generated: false, ai_recommendation: null, beie_cluster: 'foundations', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'strength', title: 'Strategic BIMP-EAGA Location', description: 'Proximity to Sabah and ASEAN trade corridors', impact: 4, likelihood: 4, resilience_index: 4.0, priority: 'high', ai_generated: false, ai_recommendation: null, beie_cluster: 'connectors', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'weakness', title: 'Critical Infrastructure Deficits', description: 'Energy, transport, digital, and water gaps constrain industrial growth', impact: 5, likelihood: 5, resilience_index: 25.0, priority: 'critical', ai_generated: false, ai_recommendation: null, beie_cluster: 'enablers', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'weakness', title: 'Highest Poverty Incidence (34.8%)', description: 'Limiting domestic market depth and investment absorption', impact: 5, likelihood: 5, resilience_index: 25.0, priority: 'critical', ai_generated: false, ai_recommendation: null, beie_cluster: 'foundations', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'weakness', title: 'Weak Halal Certification System', description: 'BHB resource-constrained; 45-60 day processing vs 15-day Malaysia benchmark', impact: 5, likelihood: 4, resilience_index: 20.0, priority: 'critical', ai_generated: false, ai_recommendation: null, beie_cluster: 'transformers', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'weakness', title: 'Lowest Functional Literacy (59.3%)', description: 'Severe human capital constraints limiting workforce readiness', impact: 5, likelihood: 4, resilience_index: 20.0, priority: 'high', ai_generated: false, ai_recommendation: null, beie_cluster: 'foundations', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'opportunity', title: 'Global Halal Market (USD 2.3T)', description: 'Growing demand across food, cosmetics, pharmaceuticals, and tourism', impact: 5, likelihood: 5, resilience_index: 5.0, priority: 'critical', ai_generated: false, ai_recommendation: null, beie_cluster: 'connectors', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'opportunity', title: 'Renewable Energy Investments', description: 'Solar, hydro, and biomass potential aligned with BSEMP', impact: 4, likelihood: 5, resilience_index: 4.5, priority: 'high', ai_generated: false, ai_recommendation: null, beie_cluster: 'enablers', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'opportunity', title: 'Islamic Finance Ecosystem', description: 'Growing global Shariah-compliant capital seeking ethical investments', impact: 4, likelihood: 5, resilience_index: 4.5, priority: 'high', ai_generated: false, ai_recommendation: null, beie_cluster: 'financiers', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'opportunity', title: 'BIMP-EAGA Regional Integration', description: 'Cross-border trade facilitation and eco-corridor development', impact: 4, likelihood: 4, resilience_index: 4.0, priority: 'high', ai_generated: false, ai_recommendation: null, beie_cluster: 'connectors', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'threat', title: 'Climate Change Vulnerabilities', description: 'El Nino, flooding, shifting rainfall affecting agriculture and infrastructure', impact: 5, likelihood: 4, resilience_index: 5.0, priority: 'critical', ai_generated: false, ai_recommendation: null, beie_cluster: 'foundations', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'threat', title: 'Competition from Established Halal Hubs', description: 'Malaysia, Indonesia, Thailand hold established market share', impact: 4, likelihood: 4, resilience_index: 4.0, priority: 'high', ai_generated: false, ai_recommendation: null, beie_cluster: 'connectors', assigned_to: null, status: 'active', created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, category: 'threat', title: 'Standards Recognition Risk', description: 'BARMM certifications not yet aligned with OIC/SMIIC international standards', impact: 4, likelihood: 4, resilience_index: 4.0, priority: 'high', ai_generated: false, ai_recommendation: null, beie_cluster: 'transformers', assigned_to: null, status: 'active', created_at: now, updated_at: now },
  ];

  const strategies: StrategyMatrix[] = [
    { id: crypto.randomUUID(), plan_id: planId, quadrant: 'SO', strategy: 'Halal Export Acceleration', description: 'Leverage cultural credibility and BIMP-EAGA location to capture global halal market share through OIC/SMIIC-aligned certification', priority: 'critical', status: 'pending', ai_generated: false, linked_swot_items: [], beie_cluster: 'connectors', assigned_to: null, due_date: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, quadrant: 'SO', strategy: 'Islamic Finance Hub Development', description: 'Use Muslim-majority identity to attract Shariah-compliant investment and banking, establishing BARMM as a regional Islamic finance center', priority: 'high', status: 'pending', ai_generated: false, linked_swot_items: [], beie_cluster: 'financiers', assigned_to: null, due_date: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, quadrant: 'ST', strategy: 'OIC Standards Alignment Fast-Track', description: 'Fast-track BHB certification to OIC/SMIIC standards to compete with Malaysia and Indonesia in global halal markets', priority: 'critical', status: 'pending', ai_generated: false, linked_swot_items: [], beie_cluster: 'transformers', assigned_to: null, due_date: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, quadrant: 'ST', strategy: 'Climate-Resilient AFF Base', description: 'Deploy climate-smart practices to protect agriculture while leveraging halal brand advantage for premium products', priority: 'high', status: 'pending', ai_generated: false, linked_swot_items: [], beie_cluster: 'foundations', assigned_to: null, due_date: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, quadrant: 'WO', strategy: 'Digital Infrastructure Leap', description: 'Invest in digital backbone to enable e-commerce, global supply chain integration, and 1-day business registration', priority: 'high', status: 'pending', ai_generated: false, linked_swot_items: [], beie_cluster: 'enablers', assigned_to: null, due_date: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, quadrant: 'WO', strategy: 'Capacity Building for Halal Certification', description: 'Train auditors and modernize labs to meet global demand, reducing processing time to 15 days', priority: 'critical', status: 'pending', ai_generated: false, linked_swot_items: [], beie_cluster: 'foundations', assigned_to: null, due_date: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, quadrant: 'WT', strategy: 'Diversification Beyond Commodities', description: 'Reduce commodity dependency through value-added processing and new crop varieties', priority: 'medium', status: 'pending', ai_generated: false, linked_swot_items: [], beie_cluster: 'foundations', assigned_to: null, due_date: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, quadrant: 'WT', strategy: 'Disaster Risk Financing', description: 'Establish Islamic catastrophe bonds and micro-Takaful for climate resilience', priority: 'medium', status: 'pending', ai_generated: false, linked_swot_items: [], beie_cluster: 'financiers', assigned_to: null, due_date: null, created_at: now, updated_at: now },
  ];

  const bscPerspectives: BalancedScorecard[] = [
    { id: crypto.randomUUID(), plan_id: planId, perspective: 'financial', description: 'Fiscal sustainability, revenue growth, and investment attraction', weight_pct: 25, created_at: now },
    { id: crypto.randomUUID(), plan_id: planId, perspective: 'customer', description: 'Citizen satisfaction, investor confidence, and stakeholder engagement', weight_pct: 25, created_at: now },
    { id: crypto.randomUUID(), plan_id: planId, perspective: 'internal_process', description: 'Governance efficiency, service delivery, and regulatory quality', weight_pct: 25, created_at: now },
    { id: crypto.randomUUID(), plan_id: planId, perspective: 'learning_growth', description: 'Human capital, digital literacy, and institutional capacity', weight_pct: 25, created_at: now },
  ];

  const financialObjectives: ScorecardObjective[] = [
    { id: crypto.randomUUID(), scorecard_id: bscPerspectives[0].id, plan_id: planId, title: 'Increase Investment Inflows', description: 'Attract ₱5B annually by 2030', target_value: '₱5B', current_value: '₱3.5B', progress_pct: 70, priority: 'critical', ai_suggested: false, beie_cluster: 'connectors', status: 'active', created_at: now, updated_at: now, kpis: [
      { id: crypto.randomUUID(), objective_id: '', plan_id: planId, name: 'Annual Investment Inflows', description: 'Total registered investment in BARMM', target_value: 5000000000, current_value: 3500000000, unit: 'PHP', frequency: 'annual', formula: null, data_source: 'BBOI', status: 'on_track', ai_suggested: false, alert_threshold: 80, baseline_value: 3500000000, target_year: 2030, assigned_to: null, created_at: now, updated_at: now },
    ] },
    { id: crypto.randomUUID(), scorecard_id: bscPerspectives[0].id, plan_id: planId, title: 'Halal Industry Revenue Growth', description: 'Grow halal sector contribution to GDP', target_value: '15%', current_value: '8%', progress_pct: 53, priority: 'high', ai_suggested: false, beie_cluster: 'transformers', status: 'active', created_at: now, updated_at: now, kpis: [
      { id: crypto.randomUUID(), objective_id: '', plan_id: planId, name: 'Halal GDP Contribution', description: 'Percentage of GDP from halal-certified enterprises', target_value: 15, current_value: 8, unit: 'percent', frequency: 'annual', formula: null, data_source: 'PSA', status: 'on_track', ai_suggested: false, alert_threshold: 75, baseline_value: 6, target_year: 2030, assigned_to: null, created_at: now, updated_at: now },
    ] },
  ];

  const customerObjectives: ScorecardObjective[] = [
    { id: crypto.randomUUID(), scorecard_id: bscPerspectives[1].id, plan_id: planId, title: 'Reduce Poverty Incidence', description: 'Reduce from 34.8% to below 20% by 2030', target_value: '20%', current_value: '34.8%', progress_pct: 0, priority: 'critical', ai_suggested: false, beie_cluster: 'foundations', status: 'active', created_at: now, updated_at: now, kpis: [
      { id: crypto.randomUUID(), objective_id: '', plan_id: planId, name: 'Poverty Reduction Rate', description: 'Year-on-year reduction in poverty incidence', target_value: 5, current_value: 0, unit: 'percent', frequency: 'annual', formula: null, data_source: 'PSA', status: 'on_track', ai_suggested: false, alert_threshold: 80, baseline_value: 0, target_year: 2030, assigned_to: null, created_at: now, updated_at: now },
    ] },
  ];

  const processObjectives: ScorecardObjective[] = [
    { id: crypto.randomUUID(), scorecard_id: bscPerspectives[2].id, plan_id: planId, title: 'Accelerate Business Registration', description: 'Reduce registration time to 1 day by 2028', target_value: '1 day', current_value: '7 days', progress_pct: 0, priority: 'high', ai_suggested: false, beie_cluster: 'enablers', status: 'active', created_at: now, updated_at: now, kpis: [
      { id: crypto.randomUUID(), objective_id: '', plan_id: planId, name: 'Business Registration Time', description: 'Average days to complete business registration', target_value: 1, current_value: 7, unit: 'days', frequency: 'monthly', formula: null, data_source: 'BDTA', status: 'at_risk', ai_suggested: false, alert_threshold: 90, baseline_value: 14, target_year: 2028, assigned_to: null, created_at: now, updated_at: now },
    ] },
  ];

  const learningObjectives: ScorecardObjective[] = [
    { id: crypto.randomUUID(), scorecard_id: bscPerspectives[3].id, plan_id: planId, title: 'Improve Digital Literacy', description: 'Increase working-age population with ICT skills to 60%', target_value: '60%', current_value: '35%', progress_pct: 0, priority: 'high', ai_suggested: false, beie_cluster: 'enablers', status: 'active', created_at: now, updated_at: now, kpis: [
      { id: crypto.randomUUID(), objective_id: '', plan_id: planId, name: 'Digital Literacy Rate', description: 'Percentage with basic ICT skills', target_value: 60, current_value: 35, unit: 'percent', frequency: 'annual', formula: null, data_source: 'MICT', status: 'on_track', ai_suggested: false, alert_threshold: 70, baseline_value: 30, target_year: 2030, assigned_to: null, created_at: now, updated_at: now },
    ] },
  ];

  bscPerspectives[0].objectives = financialObjectives;
  bscPerspectives[1].objectives = customerObjectives;
  bscPerspectives[2].objectives = processObjectives;
  bscPerspectives[3].objectives = learningObjectives;

  const paps: Pap[] = [
    { id: crypto.randomUUID(), plan_id: planId, type: 'project', code: 'BHB-001', title: 'Operationalize BHB - OIC/SMIIC Alignment', description: 'Align certification with OIC/SMIIC standards; audit 50 enterprises', objective_id: null, beie_cluster: 'transformers', priority: 'critical', status: 'planned', budget_allocated: 200000000, budget_spent: 0, progress_pct: 0, start_date: '2026-01-01', end_date: '2026-06-30', due_quarter: 'Q2', lead_agency: 'BHB / MTIT', dependencies: [], ai_generated: false, assigned_to: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, type: 'project', code: 'GRN-001', title: 'Enact Bangsamoro Forestry Code', description: 'Legal architecture for carbon & PES markets; forest inventory baseline', objective_id: null, beie_cluster: 'foundations', priority: 'critical', status: 'planned', budget_allocated: 50000000, budget_spent: 0, progress_pct: 0, start_date: '2026-01-01', end_date: '2026-06-30', due_quarter: 'Q2', lead_agency: 'MENRE / Parliament', dependencies: [], ai_generated: false, assigned_to: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, type: 'project', code: 'DIG-001', title: 'BEGMP / BIFOSS Full Rollout', description: '1-day digital registration; e-permitting integration; one-stop shops', objective_id: null, beie_cluster: 'enablers', priority: 'high', status: 'planned', budget_allocated: 150000000, budget_spent: 0, progress_pct: 0, start_date: '2026-07-01', end_date: '2026-09-30', due_quarter: 'Q3', lead_agency: 'BDTA / BBOI', dependencies: [], ai_generated: false, assigned_to: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, type: 'project', code: 'INF-001', title: 'WOW Matanog SEZ Groundbreaking', description: 'Halal Park anchor tenant pre-qualification; utility infrastructure', objective_id: null, beie_cluster: 'enablers', priority: 'high', status: 'planned', budget_allocated: 500000000, budget_spent: 0, progress_pct: 0, start_date: '2026-10-01', end_date: '2026-12-31', due_quarter: 'Q4', lead_agency: 'BEZA / MTIT', dependencies: [], ai_generated: false, assigned_to: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, type: 'project', code: 'ENR-001', title: 'ZBIP Facilitation & Mini-grids', description: 'Investment matchmaking for ₱6.67B; solar mini-grids in Tawi-Tawi/Sulu', objective_id: null, beie_cluster: 'enablers', priority: 'high', status: 'planned', budget_allocated: 200000000, budget_spent: 0, progress_pct: 0, start_date: '2026-10-01', end_date: '2026-12-31', due_quarter: 'Q4', lead_agency: 'MENRE / DOE', dependencies: [], ai_generated: false, assigned_to: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, type: 'project', code: 'FIN-001', title: 'Islamic Finance Foundation', description: 'Shariah-compliant microfinance; Takaful framework; Sukuk readiness', objective_id: null, beie_cluster: 'financiers', priority: 'high', status: 'planned', budget_allocated: 100000000, budget_spent: 0, progress_pct: 0, start_date: '2026-10-01', end_date: '2026-12-31', due_quarter: 'Q4', lead_agency: 'Min. Finance / BPDA', dependencies: [], ai_generated: false, assigned_to: null, created_at: now, updated_at: now },
    { id: crypto.randomUUID(), plan_id: planId, type: 'activity', code: 'HUM-001', title: 'Halal Expert Training Program', description: 'First cadre of 50 certification officers; international mentorship', objective_id: null, beie_cluster: 'foundations', priority: 'medium', status: 'planned', budget_allocated: 100000000, budget_spent: 0, progress_pct: 0, start_date: '2026-07-01', end_date: '2026-12-31', due_quarter: 'Q4', lead_agency: 'BHB / MOLE', dependencies: [], ai_generated: false, assigned_to: null, created_at: now, updated_at: now },
  ];

  return {
    id: planId,
    user_id: '',
    organization_id: null,
    title: 'BIRD 2026-2035: Bangsamoro Investment Roadmap',
    subtitle: 'The Emerging Bangsamoro: A Hub for Resilient and Ethical Growth',
    description: 'Integrated Ecosystem Development Strategy (IEDS) for BARMM, operationalizing the Investment-Development Virtuous Cycle (R1) and Governance-Investor Confidence Loop (R2) through targeted interventions at Critical Leverage Points.',
    industry: 'Investment',
    region: 'BARMM',
    start_year: 2026,
    end_year: 2035,
    status: 'active',
    budget_total: 1300000000,
    budget_allocated: 1300000000,
    progress_pct: 0,
    last_synced_at: null,
    sync_status: 'pending',
    version: 1,
    is_template: false,
    template_id: null,
    local_id: planId,
    created_at: now,
    updated_at: now,
    swot_items: swotItems,
    strategies,
    scorecards: bscPerspectives,
    paps,
  };
}

export function PlanTemplates() {
  const { addPlan, setCurrentPlan, addNotification } = useStrategicPlanStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const handleCreateFromTemplate = (templateId: string) => {
    setCreating(true);
    if (templateId === 'investment-bird') {
      const plan = generateBIRDPlan();
      addPlan(plan);
      setCurrentPlan(plan.local_id!);
      addNotification({ message: 'BIRD plan created from template', type: 'success' });
      navigate('/app/dashboard');
    } else {
      const newPlan: StrategicPlan = {
        id: crypto.randomUUID(),
        user_id: '',
        organization_id: null,
        title: 'New Strategic Plan',
        subtitle: '',
        description: '',
        industry: 'Investment',
        region: 'BARMM',
        start_year: 2026,
        end_year: 2035,
        status: 'draft',
        budget_total: 0,
        budget_allocated: 0,
        progress_pct: 0,
        last_synced_at: null,
        sync_status: 'pending',
        version: 1,
        is_template: false,
        template_id: null,
        local_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      addPlan(newPlan);
      setCurrentPlan(newPlan.local_id!);
      addNotification({ message: 'Blank plan created', type: 'success' });
      navigate('/app/dashboard');
    }
    setCreating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">Plan Templates</h2>
          <p className="text-sm text-white/40">Start with pre-built templates or create a blank plan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PREBUILT_TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <div key={template.id} className="glass rounded-xl p-5 card-hover group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Icon size={24} className="text-gold" />
                </div>
                {template.featured && <Star size={16} className="text-gold" />}
              </div>
              <h3 className="font-cinzel text-sm font-bold text-white mb-2">{template.name}</h3>
              <p className="text-xs text-white/40 mb-4 leading-relaxed">{template.description}</p>
              <div className="flex items-center gap-3 text-xs text-white/30 mb-4">
                <span className="capitalize">{template.industry}</span>
                <span>{template.region}</span>
              </div>
              <button
                onClick={() => handleCreateFromTemplate(template.id)}
                disabled={creating}
                className="btn btn-primary w-full text-sm"
              >
                {creating ? <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <><Copy size={14} /> Use Template</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
