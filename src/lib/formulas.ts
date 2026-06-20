export interface ResilienceScore {
  resilienceIndex: number;
  riskLevel: string;
  vulnerabilityIndex: number;
  interpretation: string;
}

export function calculateResilienceIndex(impact: number, likelihood: number): number {
  return Math.sqrt(impact * likelihood);
}

export function calculateRiskLevel(impact: number, likelihood: number): string {
  const riskScore = impact * likelihood;
  if (riskScore >= 20) return 'Critical';
  if (riskScore >= 15) return 'High';
  if (riskScore >= 10) return 'Medium';
  if (riskScore >= 5) return 'Low';
  return 'Minimal';
}

export function calculateVulnerabilityIndex(impact: number, likelihood: number, control: number): number {
  return (impact * likelihood) / Math.max(control, 1);
}

export function calculateResilience(impact: number, likelihood: number, control: number = 1): ResilienceScore {
  const resilienceIndex = calculateResilienceIndex(impact, likelihood);
  const riskLevel = calculateRiskLevel(impact, likelihood);
  const vulnerabilityIndex = calculateVulnerabilityIndex(impact, likelihood, control);
  
  let interpretation: string;
  if (resilienceIndex >= 4.0) {
    interpretation = 'Strong resilience capacity; maintain momentum';
  } else if (resilienceIndex >= 3.0) {
    interpretation = 'Moderate resilience; targeted interventions recommended';
  } else if (resilienceIndex >= 2.0) {
    interpretation = 'Vulnerable; requires priority resource allocation';
  } else {
    interpretation = 'High vulnerability; immediate corrective action required';
  }
  
  return { resilienceIndex, riskLevel, vulnerabilityIndex, interpretation };
}

export function calculateKPIProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

export function formatCurrency(value: number): string {
  if (value >= 1e9) return `₱${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `₱${(value / 1e6).toFixed(0)}M`;
  return `₱${value.toLocaleString()}`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    'on-track': '#10b981',
    'watch': '#3b82f6',
    'behind': '#f59e0b',
    'building': '#f59e0b',
    'critical': '#ef4444',
    'active': '#10b981',
    'planned': '#64748b',
  };
  return map[status] || '#64748b';
}
