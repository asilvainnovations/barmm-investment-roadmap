export interface ActionPlan {
  id: string;
  lpTag: string;
  lpDescription: string;
  programme: string;
  programmeDesc: string;
  priority: 'critical' | 'high' | 'medium';
  dueQuarter: string;
  status: string;
  statusBadge: string;
  budget: string;
  budgetValue: number;
  leadUnit: string;
  supportUnit: string;
}

export const ACTION_PLAN_2026: ActionPlan[] = [
  {
    id: 'act-1',
    lpTag: 'LP1',
    lpDescription: 'Halal Certification System Integrity — Breaking "Fixes that Fail" archetype',
    programme: 'BHB Operationalisation',
    programmeDesc: 'Aligning certification with OIC/SMIIC standards; establishing audit protocols; initial certification of 50 enterprises.',
    priority: 'critical',
    dueQuarter: 'Q2 2026',
    status: 'In Progress',
    statusBadge: 'in-progress',
    budget: '₱200M',
    budgetValue: 200000000,
    leadUnit: 'BHB',
    supportUnit: 'MTIT (Support)',
  },
  {
    id: 'act-2',
    lpTag: 'LP5',
    lpDescription: 'Green Economy Framework — Monetizing environmental assets',
    programme: 'Forestry Code & JMC 2026-01',
    programmeDesc: 'Enact Bangsamoro Forestry Code; sign MENRE-MILG JMC for Carbon Credits, PES, and Eco-tourism User Fees.',
    priority: 'critical',
    dueQuarter: 'Q2 2026',
    status: 'Drafting',
    statusBadge: 'in-progress',
    budget: '₱50M',
    budgetValue: 50000000,
    leadUnit: 'MENRE',
    supportUnit: 'Parliament / MILG',
  },
  {
    id: 'act-3',
    lpTag: 'LP3',
    lpDescription: 'Governance–Investor Confidence — Digital transformation for ease of doing business',
    programme: 'BEGMP Digital Rollout',
    programmeDesc: 'Complete deployment of Bangsamoro e-Governance Master Plan; 1-day digital business registration via BBOI.',
    priority: 'high',
    dueQuarter: 'Q3 2026',
    status: 'Development',
    statusBadge: 'in-progress',
    budget: '₱150M',
    budgetValue: 150000000,
    leadUnit: 'BDTA',
    supportUnit: 'BBOI, MICT',
  },
  {
    id: 'act-4',
    lpTag: 'LP2',
    lpDescription: 'Infrastructure–Energy Nexus — Raising the B1 Growth Ceiling',
    programme: 'WOW Matanog SEZ Groundbreaking',
    programmeDesc: 'Halal Park anchor tenant pre-qualification; utility infrastructure; phased construction launch.',
    priority: 'high',
    dueQuarter: 'Q4 2026',
    status: 'Pre-qualification',
    statusBadge: 'in-progress',
    budget: '₱500M',
    budgetValue: 500000000,
    leadUnit: 'BEZA',
    supportUnit: 'MTIT, MENRE',
  },
  {
    id: 'act-5',
    lpTag: 'LP2',
    lpDescription: 'Energy Connectivity — Mini-grid strategy for unserved areas',
    programme: 'ZBIP Facilitation & Mini-grids',
    programmeDesc: 'Investment matchmaking for ₱6.67B pipeline; solar mini-grids in Tawi-Tawi and Sulu.',
    priority: 'high',
    dueQuarter: 'Q4 2026',
    status: 'Investment',
    statusBadge: 'in-progress',
    budget: '₱200M',
    budgetValue: 200000000,
    leadUnit: 'MENRE',
    supportUnit: 'DOE / NGCP',
  },
  {
    id: 'act-6',
    lpTag: 'LP4',
    lpDescription: 'Islamic Finance Ecosystem — Financial inclusion',
    programme: 'Shariah-Compliant Microfinance Pilot',
    programmeDesc: 'First 500 Shariah-compliant micro-entrepreneurs; Takaful framework; Sukuk readiness assessment.',
    priority: 'medium',
    dueQuarter: 'Q4 2026',
    status: 'Framework',
    statusBadge: 'in-progress',
    budget: '₱100M',
    budgetValue: 100000000,
    leadUnit: 'Min. Finance',
    supportUnit: 'BPDA / Amanah',
  },
];

export const ACTION_SUMMARY = {
  critical: 2,
  high: 3,
  medium: 1,
  totalBudget: 1200000000,
  totalBudgetFormatted: '₱1.2B',
  q2: 2,
  q3: 1,
  q4: 3,
};
