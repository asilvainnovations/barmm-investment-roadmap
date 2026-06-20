export interface CausalLoop {
  id: string;
  plan_id?: string;
  name: string;
  loop_type: 'reinforcing' | 'balancing';
  typeLabel: string;
  description: string;
  status: 'active' | 'building' | 'watch';
  statusLabel: string;
  pct: number;
  color: 'green' | 'gold' | 'blue';
  nodes: { id: string; label: string; x: number; y: number }[];
  connections: { from: string; to: string; label: string; polarity: '+' | '-' }[];
  leverage_points: string[];
  created_at?: string;
}

export const CAUSAL_LOOPS: CausalLoop[] = [
  {
    id: 'R1',
    plan_id: '',
    name: 'Investment-Development Virtuous Cycle',
    loop_type: 'reinforcing',
    typeLabel: 'Reinforcing',
    description: 'Investment inflows drive employment growth, expanding domestic markets and improving business climate, attracting further investment.',
    status: 'active',
    statusLabel: 'Active',
    pct: 65,
    color: 'green',
    nodes: [
      { id: 'inv', label: 'Investment Inflows', x: 50, y: 20 },
      { id: 'emp', label: 'Employment Growth', x: 80, y: 40 },
      { id: 'mkt', label: 'Domestic Market Expansion', x: 80, y: 70 },
      { id: 'clm', label: 'Business Climate', x: 50, y: 80 },
    ],
    connections: [
      { from: 'inv', to: 'emp', label: '+', polarity: '+' },
      { from: 'emp', to: 'mkt', label: '+', polarity: '+' },
      { from: 'mkt', to: 'clm', label: '+', polarity: '+' },
      { from: 'clm', to: 'inv', label: '+', polarity: '+' },
    ],
    leverage_points: ['LP1', 'LP3'],
    created_at: '',
  },
  {
    id: 'R2',
    plan_id: '',
    name: 'Governance-Investor Confidence Loop',
    loop_type: 'reinforcing',
    typeLabel: 'Reinforcing',
    description: 'Governance transparency builds investor confidence, increasing investment inflows and expanding the tax base for further governance improvement.',
    status: 'building',
    statusLabel: 'Building',
    pct: 45,
    color: 'gold',
    nodes: [
      { id: 'gov', label: 'Governance Transparency', x: 50, y: 20 },
      { id: 'con', label: 'Investor Confidence', x: 80, y: 40 },
      { id: 'tax', label: 'Tax Base Expansion', x: 80, y: 70 },
      { id: 'svc', label: 'Service Delivery', x: 50, y: 80 },
    ],
    connections: [
      { from: 'gov', to: 'con', label: '+', polarity: '+' },
      { from: 'con', to: 'tax', label: '+', polarity: '+' },
      { from: 'tax', to: 'svc', label: '+', polarity: '+' },
      { from: 'svc', to: 'gov', label: '+', polarity: '+' },
    ],
    leverage_points: ['LP3', 'LP4'],
    created_at: '',
  },
  {
    id: 'B1',
    plan_id: '',
    name: 'Limits to Growth',
    loop_type: 'balancing',
    typeLabel: 'Balancing',
    description: 'Infrastructure and energy constraints act as a ceiling on growth, slowing the investment-development cycle unless proactively addressed.',
    status: 'watch',
    statusLabel: 'Watch',
    pct: 35,
    color: 'blue',
    nodes: [
      { id: 'gro', label: 'Growth Pressure', x: 50, y: 20 },
      { id: 'inf', label: 'Infrastructure Strain', x: 80, y: 40 },
      { id: 'eng', label: 'Energy Shortage', x: 80, y: 70 },
      { id: 'lim', label: 'Growth Ceiling', x: 50, y: 80 },
    ],
    connections: [
      { from: 'gro', to: 'inf', label: '+', polarity: '+' },
      { from: 'inf', to: 'eng', label: '+', polarity: '+' },
      { from: 'eng', to: 'lim', label: '+', polarity: '+' },
      { from: 'lim', to: 'gro', label: '-', polarity: '-' },
    ],
    leverage_points: ['LP2', 'LP6'],
    created_at: '',
  },
  {
    id: 'B2',
    plan_id: '',
    name: 'Security-Investment Tensions',
    loop_type: 'balancing',
    typeLabel: 'Balancing',
    description: 'Security concerns deter investment, creating a downward spiral that must be interrupted through visible governance and infrastructure progress.',
    status: 'watch',
    statusLabel: 'Watch',
    pct: 30,
    color: 'blue',
    nodes: [
      { id: 'sec', label: 'Security Stability', x: 50, y: 20 },
      { id: 'inv', label: 'Investment Inflows', x: 80, y: 40 },
      { id: 'dev', label: 'Development Speed', x: 80, y: 70 },
      { id: 'str', label: 'Structural Reform', x: 50, y: 80 },
    ],
    connections: [
      { from: 'sec', to: 'inv', label: '+', polarity: '+' },
      { from: 'inv', to: 'dev', label: '+', polarity: '+' },
      { from: 'dev', to: 'str', label: '+', polarity: '+' },
      { from: 'str', to: 'sec', label: '-', polarity: '-' },
    ],
    leverage_points: ['LP3', 'LP7'],
    created_at: '',
  },
];

export interface SystemsArchetype {
  id: string;
  plan_id?: string;
  name: string;
  archetype_type: string;
  typeLabel: string;
  description: string;
  symptoms: string;
  structural_causes: string;
  interventions: string;
  color: string;
  created_at?: string;
}

export const SYSTEMS_ARCHETYPES: SystemsArchetype[] = [
  {
    id: '1',
    plan_id: '',
    name: 'Limits to Growth',
    archetype_type: 'limits_to_growth',
    typeLabel: 'Limits to Growth',
    description: 'The halal economy growth is constrained by infrastructure and energy limits. Acting on these constraints before they bind prevents the B1 balancing loop from binding.',
    symptoms: 'Investment inflows plateau after initial growth',
    structural_causes: 'Energy deficits, poor transport, low digital penetration',
    interventions: '₱500M WOW Matanog investment, ₱200M Energy Connectivity (ZBIP/mini-grids)',
    color: 'yellow',
    created_at: '',
  },
  {
    id: '2',
    plan_id: '',
    name: 'Success to the Successful',
    archetype_type: 'success_to_the_successful',
    typeLabel: 'Success to the Successful',
    description: 'Resources may flow disproportionately to established sectors unless balanced. The dual focus on Halal Park and Islamic Finance ensures equitable distribution.',
    symptoms: 'One sector dominates funding, starving innovation',
    structural_causes: 'Lack of cross-sector coordination, short-term ROI focus',
    interventions: 'Balanced budget allocation across all BEIE clusters, green economy safeguards',
    color: 'green',
    created_at: '',
  },
  {
    id: '3',
    plan_id: '',
    name: 'Fixes that Fail',
    archetype_type: 'fixes_that_fail',
    typeLabel: 'Fixes that Fail',
    description: 'Ad-hoc tax incentives create temporary investment spikes but erode the tax base and fail to build institutional capacity.',
    symptoms: 'Investment spikes followed by withdrawals, weakened fiscal position',
    structural_causes: 'Reactive policymaking, short-term political incentives',
    interventions: 'Invest in systemic governance reforms (Forestry Code, JMC, BHB operationalization) rather than ad-hoc incentives',
    color: 'red',
    created_at: '',
  },
];
