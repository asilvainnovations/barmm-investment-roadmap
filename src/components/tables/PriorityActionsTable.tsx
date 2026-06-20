import { useState } from 'react';
import { ACTION_PLAN_2026, type ActionPlan } from '../../data/bird/actions';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';

export function PriorityActionsTable() {
  const [actions, setActions] = useState<ActionPlan[]>(ACTION_PLAN_2026);
  const [sortField, setSortField] = useState<string>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const sort = (field: string) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    
    const sorted = [...actions].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      
      if (field === 'priority') {
        const priorityMap = { critical: 3, high: 2, medium: 1 };
        aVal = priorityMap[a.priority as keyof typeof priorityMap] || 0;
        bVal = priorityMap[b.priority as keyof typeof priorityMap] || 0;
      } else if (field === 'budget') {
        aVal = a.budgetValue;
        bVal = b.budgetValue;
      } else {
        aVal = a[field as keyof ActionPlan] as string;
        bVal = b[field as keyof ActionPlan] as string;
      }
      
      if (direction === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    setActions(sorted);
  };

  const filtered = filterPriority === 'all' ? actions : actions.filter((a) => a.priority === filterPriority);

  const priorityColors = {
    critical: 'bg-red-500/10 text-red-300 border-red-500/30',
    high: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    medium: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-cinzel text-lg font-bold text-white">Priority Actions Table</h2>
        <div className="flex gap-2">
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="text-sm w-32">
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gold/10">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-gold/10 border-b border-gold/20">
              <th className="text-left px-3 py-2 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">
                <button onClick={() => sort('lpTag')} className="flex items-center gap-1 hover:text-gold-light">LP <ArrowUpDown size={12} /></button>
              </th>
              <th className="text-left px-3 py-2 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Programme</th>
              <th className="text-center px-3 py-2 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">
                <button onClick={() => sort('priority')} className="flex items-center gap-1 hover:text-gold-light">Priority <ArrowUpDown size={12} /></button>
              </th>
              <th className="text-center px-3 py-2 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Due</th>
              <th className="text-center px-3 py-2 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Status</th>
              <th className="text-right px-3 py-2 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">
                <button onClick={() => sort('budget')} className="flex items-center gap-1 hover:text-gold-light ml-auto">Budget <ArrowUpDown size={12} /></button>
              </th>
              <th className="text-left px-3 py-2 text-xs font-cinzel font-bold text-gold uppercase tracking-wider">Lead</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((action) => (
              <tr key={action.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-3 py-2">
                  <span className="bg-gold/10 text-gold text-[0.65rem] font-bold px-2 py-0.5 rounded">{action.lpTag}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="text-xs font-medium text-white">{action.programme}</div>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded border ${priorityColors[action.priority]}`}>
                    {action.priority}
                  </span>
                </td>
                <td className="px-3 py-2 text-center text-xs text-light-green font-semibold">{action.dueQuarter}</td>
                <td className="px-3 py-2 text-center">
                  <span className="inline-flex items-center gap-1 text-[0.6rem] px-2 py-0.5 rounded border bg-blue-500/10 text-blue-300 border-blue-500/30">
                    <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                    {action.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-cinzel text-xs font-bold text-gold">{action.budget}</td>
                <td className="px-3 py-2 text-xs text-white/70">{action.leadUnit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
