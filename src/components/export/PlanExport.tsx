import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, FileCode, Printer, CheckCircle, Clock, DollarSign, Target, Users } from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import type { StrategicPlan } from '../../types';

export function PlanExport() {
  const { getCurrentPlan } = useStrategicPlanStore();
  const currentPlan = getCurrentPlan();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState<'html' | 'markdown' | 'json'>('html');

  const generateHTML = (plan: StrategicPlan) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${plan.title} - Strategic Plan</title>
<style>
body { font-family: 'DM Sans', sans-serif; margin: 0; padding: 40px; background: #f8f4ec; color: #2c3020; }
.header { background: #022c22; color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; }
.header h1 { font-family: 'Cinzel', serif; color: #C9A84C; margin: 0; }
.header p { color: rgba(255,255,255,0.6); margin: 8px 0 0; }
.section { background: white; border-radius: 12px; padding: 30px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.section h2 { font-family: 'Cinzel', serif; color: #064e3b; border-bottom: 2px solid #C9A84C; padding-bottom: 10px; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th { background: #f0f4f0; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #064e3b; }
td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.badge-critical { background: #fee2e2; color: #991b1b; }
.badge-high { background: #fef3c7; color: #92400e; }
.badge-medium { background: #dbeafe; color: #1e40af; }
.footer { text-align: center; padding: 30px; color: #6b7060; font-size: 12px; }
</style>
</head>
<body>
<div class="header">
  <h1>${plan.title}</h1>
  <p>${plan.subtitle || ''}</p>
  <p>${plan.description || ''}</p>
  <p><strong>Period:</strong> ${plan.start_year}-${plan.end_year} | <strong>Region:</strong> ${plan.region} | <strong>Industry:</strong> ${plan.industry}</p>
</div>

<div class="section">
  <h2>SWOT Analysis</h2>
  <table>
    <thead><tr><th>Category</th><th>Item</th><th>Impact</th><th>Likelihood</th><th>Priority</th></tr></thead>
    <tbody>
      ${plan.swot_items?.map(s => `<tr><td class="badge badge-${s.category === 'strength' ? 'high' : s.category === 'weakness' ? 'critical' : s.category === 'opportunity' ? 'medium' : 'critical'}">${s.category}</td><td><strong>${s.title}</strong><br><small>${s.description || ''}</small></td><td>${s.impact}</td><td>${s.likelihood}</td><td><span class="badge badge-${s.priority === 'critical' ? 'critical' : s.priority === 'high' ? 'high' : 'medium'}">${s.priority}</span></td></tr>`).join('') || '<tr><td colspan="5">No SWOT items</td></tr>'}
    </tbody>
  </table>
</div>

<div class="section">
  <h2>Strategy Matrix</h2>
  <table>
    <thead><tr><th>Quadrant</th><th>Strategy</th><th>Priority</th><th>Status</th></tr></thead>
    <tbody>
      ${plan.strategies?.map(s => `<tr><td class="badge badge-${s.quadrant === 'SO' ? 'high' : s.quadrant === 'ST' ? 'medium' : s.quadrant === 'WO' ? 'critical' : 'critical'}">${s.quadrant}</td><td><strong>${s.strategy}</strong><br><small>${s.description || ''}</small></td><td><span class="badge badge-${s.priority === 'critical' ? 'critical' : s.priority === 'high' ? 'high' : 'medium'}">${s.priority}</span></td><td>${s.status}</td></tr>`).join('') || '<tr><td colspan="4">No strategies</td></tr>'}
    </tbody>
  </table>
</div>

<div class="section">
  <h2>Balanced Scorecard</h2>
  ${plan.scorecards?.map(sc => `
    <h3 style="color:#064e3b;font-family:Cinzel;margin-top:20px;">${sc.perspective.replace('_', ' ').toUpperCase()}</h3>
    <table>
      <thead><tr><th>Objective</th><th>KPI</th><th>Target</th><th>Current</th><th>Status</th></tr></thead>
      <tbody>
        ${sc.objectives?.map(o => o.kpis?.map(k => `<tr><td>${o.title}</td><td>${k.name}</td><td>${k.target_value} ${k.unit}</td><td>${k.current_value} ${k.unit}</td><td><span class="badge badge-${k.status === 'on_track' ? 'high' : k.status === 'at_risk' ? 'critical' : 'medium'}">${k.status}</span></td></tr>`).join('') || `<tr><td>${o.title}</td><td colspan="4">No KPIs</td></tr>`).join('') || '<tr><td colspan="5">No objectives</td></tr>'}
      </tbody>
    </table>
  `).join('') || '<p>No scorecards defined</p>'}
</div>

<div class="section">
  <h2>Programs, Activities & Projects</h2>
  <table>
    <thead><tr><th>Code</th><th>Title</th><th>Type</th><th>Status</th><th>Budget</th><th>Progress</th></tr></thead>
    <tbody>
      ${plan.paps?.map(p => `<tr><td>${p.code || '-'}</td><td><strong>${p.title}</strong><br><small>${p.description || ''}</small></td><td>${p.type}</td><td><span class="badge badge-${p.status === 'completed' ? 'high' : p.status === 'in_progress' ? 'medium' : 'critical'}">${p.status}</span></td><td>₱${p.budget_allocated.toLocaleString()}</td><td>${p.progress_pct}%</td></tr>`).join('') || '<tr><td colspan="6">No PAPs</td></tr>'}
    </tbody>
  </table>
</div>

<div class="footer">
  <p>BIRD Strategic Planning Platform | Bangsamoro Investment Roadmap Development ${plan.start_year}-${plan.end_year}</p>
  <p>The Emerging Bangsamoro: A Hub for Resilient and Ethical Growth</p>
</div>
</body>
</html>`;
  };

  const handleExport = () => {
    if (!currentPlan) return;
    setExporting(true);
    const content = generateHTML(currentPlan);
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPlan.title.replace(/\s+/g, '_')}_strategic_plan.html`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  if (!currentPlan) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <FileText size={48} className="text-gold/30 mx-auto mb-4" />
        <h3 className="font-cinzel text-xl font-bold text-white mb-2">No Plan Selected</h3>
        <button onClick={() => navigate('/app/templates')} className="btn btn-primary">Create Plan</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">Plan Export</h2>
          <p className="text-sm text-white/40">Generate professional strategic plan documents</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="mb-6">
          <h3 className="font-cinzel text-sm font-bold text-white mb-4">Export Format</h3>
          <div className="flex gap-3">
            <button onClick={() => setFormat('html')} className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${format === 'html' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-white/40 hover:text-white/60'}`}>
              <FileCode size={18} /> HTML Document
            </button>
            <button onClick={() => setFormat('markdown')} className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${format === 'markdown' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-white/40 hover:text-white/60'}`}>
              <FileText size={18} /> Markdown
            </button>
            <button onClick={() => setFormat('json')} className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${format === 'json' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-white/40 hover:text-white/60'}`}>
              <FileCode size={18} /> JSON
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-cinzel text-sm font-bold text-white mb-4">Plan Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-lg p-3 text-center">
              <FileText size={16} className="text-gold mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{currentPlan.swot_items?.length || 0}</div>
              <div className="text-xs text-white/40">SWOT Items</div>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <Target size={16} className="text-gold mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{currentPlan.strategies?.length || 0}</div>
              <div className="text-xs text-white/40">Strategies</div>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <DollarSign size={16} className="text-gold mx-auto mb-1" />
              <div className="text-sm font-bold text-white">₱{currentPlan.budget_allocated?.toLocaleString() || 0}</div>
              <div className="text-xs text-white/40">Budget Allocated</div>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <CheckCircle size={16} className="text-gold mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{currentPlan.progress_pct}%</div>
              <div className="text-xs text-white/40">Progress</div>
            </div>
          </div>
        </div>

        <button onClick={handleExport} disabled={exporting} className="btn btn-primary w-full">
          {exporting ? <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <><Download size={16} /> Export Plan</>}
        </button>
      </div>
    </div>
  );
}
