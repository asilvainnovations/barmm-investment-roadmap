export interface KPI {
  id: string;
  name: string;
  label: string;
  current: string;
  target: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  pct: number;
  status: 'on-track' | 'watch' | 'behind' | 'building';
  color: 'green' | 'gold' | 'blue';
  source: string;
  leveragePoint: string;
  delta: string;
  deltaType: 'up' | 'flat' | 'down';
}

export const PARETO_KPIS: KPI[] = [
  {
    id: 'kpi-1',
    name: 'Annual Investment Approvals',
    label: 'Annual Investment Approvals',
    current: '₱5.1B',
    target: '₱15B p.a. by 2035',
    targetValue: 15,
    currentValue: 5.1,
    unit: 'B PHP',
    pct: 34,
    status: 'watch',
    color: 'gold',
    source: 'BBOI / BEZA',
    leveragePoint: 'LP1 + LP3',
    delta: 'Structural Shift',
    deltaType: 'up',
  },
  {
    id: 'kpi-2',
    name: 'Total Export Value',
    label: 'Total Export Value',
    current: '<₱10B',
    target: '₱40B+ by 2035',
    targetValue: 40,
    currentValue: 10,
    unit: 'B PHP',
    pct: 25,
    status: 'watch',
    color: 'blue',
    source: 'PSA / Customs',
    leveragePoint: 'LP1',
    delta: 'Baseline Phase',
    deltaType: 'flat',
  },
  {
    id: 'kpi-3',
    name: 'Halal-Certified Firms',
    label: 'Halal-Certified Firms',
    current: '~500',
    target: '5,000+ by 2035',
    targetValue: 5000,
    currentValue: 500,
    unit: 'firms',
    pct: 10,
    status: 'watch',
    color: 'gold',
    source: 'BHB Registry',
    leveragePoint: 'LP1',
    delta: '2,000 by 2030',
    deltaType: 'flat',
  },
  {
    id: 'kpi-4',
    name: 'Islamic Finance Penetration',
    label: 'Islamic Finance Penetration',
    current: 'Minimal',
    target: '25% of adults by 2035',
    targetValue: 25,
    currentValue: 2,
    unit: 'percent',
    pct: 2,
    status: 'watch',
    color: 'blue',
    source: 'Min. Finance',
    leveragePoint: 'LP4',
    delta: 'Framework 2026',
    deltaType: 'flat',
  },
  {
    id: 'kpi-5',
    name: 'Electrification Rate',
    label: 'Electrification Rate',
    current: '~75%',
    target: '100% by 2035',
    targetValue: 100,
    currentValue: 75,
    unit: 'percent',
    pct: 75,
    status: 'on-track',
    color: 'green',
    source: 'MENRE / DOE',
    leveragePoint: 'LP2',
    delta: '90% by 2030',
    deltaType: 'up',
  },
  {
    id: 'kpi-6',
    name: 'Broadband Connectivity',
    label: 'Broadband Connectivity',
    current: '<30% est.',
    target: '85% by 2035',
    targetValue: 85,
    currentValue: 30,
    unit: 'percent',
    pct: 35,
    status: 'on-track',
    color: 'green',
    source: 'DICT / MICT',
    leveragePoint: 'LP2',
    delta: '60% by 2030',
    deltaType: 'up',
  },
];

export interface BSCLeveragePoint {
  id: string;
  lpBadge: string;
  perspective: string;
  perspectiveClass: string;
  action: string;
  kpi: string;
  current: string;
  target: string;
  pct: number;
  progressColor: string;
  statusBadge: string;
  statusLabel: string;
  statusType: string;
  note: string;
}

export const BSC_LEVERAGE_POINTS: BSCLeveragePoint[] = [
  {
    id: 'lp-1',
    lpBadge: 'LP1 + LP3',
    perspective: 'Financial Perspective',
    perspectiveClass: 'finance',
    action: 'Increase FDI & domestic investment inflows',
    kpi: 'Annual Investment Approvals',
    current: '₱5.1B (Q1 2026)',
    target: '₱15B p.a. target',
    pct: 34,
    progressColor: 'gold',
    statusBadge: 'in-progress',
    statusLabel: 'In Progress',
    statusType: 'in-progress',
    note: '34% of 2035 goal',
  },
  {
    id: 'lp-2',
    lpBadge: 'LP1',
    perspective: 'Financial Perspective',
    perspectiveClass: 'finance',
    action: 'Expand halal & agro-industrial exports',
    kpi: 'Total Export Value',
    current: '<₱10B',
    target: '₱40B+ target',
    pct: 25,
    progressColor: 'blue',
    statusBadge: 'in-progress',
    statusLabel: 'Building Corridors',
    statusType: 'in-progress',
    note: 'UAE/GCC focus',
  },
  {
    id: 'lp-3',
    lpBadge: 'LP3',
    perspective: 'Stakeholder Perspective',
    perspectiveClass: 'stakeholder',
    action: 'Enhance investor satisfaction & retention',
    kpi: 'Investor Satisfaction Score (1–10)',
    current: 'TBD baseline',
    target: '8.0+ rating',
    pct: 50,
    progressColor: 'blue',
    statusBadge: 'in-progress',
    statusLabel: 'Measuring',
    statusType: 'in-progress',
    note: 'BICC activates R2 loop',
  },
  {
    id: 'lp-4',
    lpBadge: 'LP1 Critical',
    perspective: 'Internal Process Perspective',
    perspectiveClass: 'process',
    action: 'Achieve OIC/SMIIC international accreditation',
    kpi: 'BHB International Accreditation Status',
    current: 'National only',
    target: 'OIC/SMIIC by 2028',
    pct: 20,
    progressColor: 'gold',
    statusBadge: 'in-progress',
    statusLabel: 'Q2 2026 operationalisation',
    statusType: 'in-progress',
    note: '',
  },
  {
    id: 'lp-5',
    lpBadge: 'LP1 Enabler',
    perspective: 'Learning & Growth Perspective',
    perspectiveClass: 'learning',
    action: 'Develop technical halal expertise',
    kpi: 'Halal Certification Officers Trained',
    current: 'Minimal pool',
    target: '100+ officers by 2035',
    pct: 10,
    progressColor: 'teal',
    statusBadge: 'in-progress',
    statusLabel: '50 target for 2026',
    statusType: 'in-progress',
    note: '',
  },
];
