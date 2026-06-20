export interface PhaseTracker {
  id: number;
  name: string;
  years: string;
  budget: string;
  budgetValue: number;
  pct: number;
  progressColor: string;
  status: string;
  milestones: Milestone[];
}

export interface Milestone {
  label: string;
  status: 'done' | 'active' | 'pending';
}

export const PHASES: PhaseTracker[] = [
  {
    id: 1,
    name: 'Foundation Building',
    years: '2026–2027',
    budget: '₱5B',
    budgetValue: 5000000000,
    pct: 25,
    progressColor: 'gold',
    status: 'Active Phase',
    milestones: [
      { label: 'BHB operationalisation complete', status: 'active' },
      { label: 'Forestry Code enacted', status: 'active' },
      { label: 'BEGMP Phase 1 deployed', status: 'active' },
      { label: 'Matanog SEZ groundbreaking', status: 'pending' },
      { label: 'ZBIP matchmaking launched', status: 'pending' },
    ],
  },
  {
    id: 2,
    name: 'Investment Acceleration',
    years: '2028–2029',
    budget: '₱15B',
    budgetValue: 15000000000,
    pct: 0,
    progressColor: 'blue',
    status: 'Planned',
    milestones: [
      { label: 'Export corridors to GCC active', status: 'pending' },
      { label: 'Halal Park 50% operational', status: 'pending' },
      { label: 'Islamic Finance framework live', status: 'pending' },
      { label: '100% electrification pathway', status: 'pending' },
    ],
  },
  {
    id: 3,
    name: 'Expansion & Scaling',
    years: '2030–2032',
    budget: '₱25B',
    budgetValue: 25000000000,
    pct: 0,
    progressColor: 'green',
    status: 'Planned',
    milestones: [
      { label: 'BHB OIC/SMIIC accredited', status: 'pending' },
      { label: 'Halal-certified firms: 2,000+', status: 'pending' },
      { label: 'Export value: ₱20B+', status: 'pending' },
      { label: 'Carbon credit market active', status: 'pending' },
    ],
  },
  {
    id: 4,
    name: 'Resilience & 2035 Horizon',
    years: '2033–2035',
    budget: '₱10B',
    budgetValue: 10000000000,
    pct: 0,
    progressColor: 'teal',
    status: 'Planned',
    milestones: [
      { label: '₱55B cumulative investment', status: 'pending' },
      { label: '5,000+ halal-certified firms', status: 'pending' },
      { label: '₱40B+ export value', status: 'pending' },
      { label: 'Full MEL institutionalisation', status: 'pending' },
    ],
  },
];

export const TOTAL_ROADMAP_BUDGET = 55000000000;
export const TOTAL_ROADMAP_BUDGET_FORMATTED = '₱55B';
