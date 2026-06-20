import { useState } from 'react';
import { ACTION_PLAN_2026, ACTION_SUMMARY, type ActionPlan } from '../../data/bird/actions';
import { getStatusColor } from '../../lib/formulas';

function ActionRow({ action }: { action: ActionPlan }) {
  const priorityColors = {
    critical: 'bg-red-500/10 text-red-300 border-red-500/30',
    high: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    medium: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  };

  const statusColors = {
    'in-progress': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    'not-started': 'bg-white/5 text-white/50 border-white/10',
    'on-track': 'bg-green-500/10 text-green-300 border-green-500/30',
    'at-risk': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  };

  return (
    <tr className="border-b border-gold/10 hover:bg-white/5 transition-colors">
      <td className="px-4 py-3">
        <span className="inline-block bg-gold/10 text-gold text-[0.65rem] font-bold font-cinzel px-2 py-0.5 rounded">{action.lpTag}</span>
        <div className="text-[0.75rem] text-white/50 mt-1 leading-relaxed">{action.lpDescription}</div>
      </td>
      <td className="px-4 py-3">
        <strong className="text-sm text-white block">{action.programme}</strong>
        <div className="text-[0.75rem] text-white/40 mt-1 leading-relaxed">{action.programmeDesc}</div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex items-center gap-1 text-[0.68rem] font-bold px-2 py-1 rounded border ${priorityColors[action.priority]}`}>
          {action.priority === 'critical' ? '🔴' : action.priority === 'high' ? '🟡' : '🔵'} {action.priority}
        </span>
      </td>
      <td className="px-4 py-3 text-center text-sm text-light-green font-semibold">{action.dueQuarter}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 text-[0.68rem] px-2 py-1 rounded border ${statusColors[action.statusBadge as keyof typeof statusColors] || statusColors['not-started']}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {action.status}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-cinzel text-sm font-bold text-gold">{action.budget}</td>
      <td className="px-4 py-3 text-[0.72rem] text-white/70">
        <strong className="text-white">{action.leadUnit}</strong>
        <br /><span className="text-white/40">{action.supportUnit}</span>
      </td>
    </tr>
  );
}

export function ActionPlanPanel() {
  const [filter, setFilter] = useState('all');
  const actions = ACTION_PLAN_2026;
  const summary = ACTION_SUMMARY;

  const filtered = filter === 'all' ? actions : actions.filter((a) => {
    if (filter === 'critical') return a.priority === 'critical';
    if (filter === 'high') return a.priority === 'high';
    if (filter === 'medium') return a.priority === 'medium';
    if (filter === 'q2') return a.dueQuarter === 'Q2 2026';
    if (filter === 'q4') return a.dueQuarter === 'Q4 2026';
    return true;
  });

  const filters = [
    { key: 'all', label: 'All Actions' },
    { key: 'critical', label: '🔴 Critical' },
    { key: 'high', label: '🟡 High' },
    { key: 'medium', label: '🔵 Medium' },
    { key: 'q2', label: '📅 Due Q2' },
    { key: 'q4', label: '📅 Due Q4' },
  ];

  return (
    <section className="glass rounded-xl p-6 border-t-2 border-gold/40">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Panel C · One Year Action Plan 2026</span>
          <h2 className="font-cinzel text-xl font-bold text-white mt-1">Urgent & Priority Actions — Foundation Phase</h2>
          <div className="w-10 h-1 bg-gold-grad rounded-full mt-2" />
        </div>
        <span className="text-xs text-white/50 bg-white/5 border border-gold/20 rounded-full px-3 py-1">{summary.critical} Critical · {summary.high} High · {summary.medium} Medium</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass rounded-lg p-4 text-center border-t-2 border-red-500">
          <div className="font-cinzel text-2xl font-bold text-red-400">{summary.critical}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Critical Actions</div>
        </div>
        <div className="glass rounded-lg p-4 text-center border-t-2 border-yellow-500">
          <div className="font-cinzel text-2xl font-bold text-yellow-400">{summary.high}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">High Priority</div>
        </div>
        <div className="glass rounded-lg p-4 text-center border-t-2 border-green-500">
          <div className="font-cinzel text-2xl font-bold text-green-400">{summary.q2}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Due Q2 2026</div>
        </div>
        <div className="glass rounded-lg p-4 text-center border-t-2 border-gold">
          <div className="font-cinzel text-2xl font-bold text-gold">{summary.totalBudgetFormatted}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">2026 Total Budget</div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f.key
                ? 'bg-gold-grad text-[#022c22] font-bold'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10 hover:border-gold/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gold/10">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-gold/10 border-b-2 border-gold/20">
              <th className="text-left px-4 py-3 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Strategic Objective</th>
              <th className="text-left px-4 py-3 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Programme / Action</th>
              <th className="text-center px-4 py-3 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Priority</th>
              <th className="text-center px-4 py-3 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Due</th>
              <th className="text-left px-4 py-3 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">MEL Status</th>
              <th className="text-right px-4 py-3 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Budget</th>
              <th className="text-left px-4 py-3 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Lead Unit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((action) => (
              <ActionRow key={action.id} action={action} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
