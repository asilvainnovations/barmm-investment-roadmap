import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ListChecks, Calendar, DollarSign, TrendingUp, Filter, CheckCircle, Clock, AlertTriangle, Ban } from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import type { Pap } from '../../types';

const TYPE_COLORS = {
  program: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  activity: 'bg-green-500/10 text-green-300 border-green-500/30',
  project: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
};

const STATUS_COLORS = {
  planned: 'bg-white/5 text-white/40',
  in_progress: 'bg-blue-500/10 text-blue-300',
  completed: 'bg-green-500/10 text-green-300',
  delayed: 'bg-red-500/10 text-red-300',
  cancelled: 'bg-gray-500/10 text-gray-300',
};

export function PapsManagement() {
  const { getCurrentPlan, addPap, updatePap, deletePap } = useStrategicPlanStore();
  const currentPlan = getCurrentPlan();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingPap, setEditingPap] = useState<Pap | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const paps = currentPlan?.paps || [];
  const filtered = paps.filter((p) => (filterType === 'all' || p.type === filterType) && (filterStatus === 'all' || p.status === filterStatus));

  const totalBudget = paps.reduce((sum, p) => sum + p.budget_allocated, 0);
  const spentBudget = paps.reduce((sum, p) => sum + p.budget_spent, 0);
  const avgProgress = paps.length > 0 ? Math.round(paps.reduce((sum, p) => sum + p.progress_pct, 0) / paps.length) : 0;

  const handleSave = (pap: Partial<Pap>) => {
    if (!currentPlan) return;
    const planId = currentPlan.id || currentPlan.local_id || '';
    if (editingPap) {
      updatePap(planId, editingPap.id, pap);
    } else {
      const newPap: Pap = {
        id: crypto.randomUUID(),
        plan_id: planId,
        type: pap.type || 'activity',
        code: pap.code || null,
        title: pap.title || 'Untitled',
        description: pap.description || null,
        objective_id: null,
        beie_cluster: pap.beie_cluster || 'foundations',
        priority: pap.priority || 'medium',
        status: pap.status || 'planned',
        budget_allocated: pap.budget_allocated || 0,
        budget_spent: pap.budget_spent || 0,
        progress_pct: pap.progress_pct || 0,
        start_date: pap.start_date || null,
        end_date: pap.end_date || null,
        due_quarter: pap.due_quarter || 'Q1',
        lead_agency: pap.lead_agency || null,
        dependencies: pap.dependencies || [],
        ai_generated: false,
        assigned_to: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isNew: true,
      };
      addPap(planId, newPap);
    }
    setEditingPap(null);
    setShowModal(false);
  };

  if (!currentPlan) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <ListChecks size={48} className="text-gold/30 mx-auto mb-4" />
        <h3 className="font-cinzel text-xl font-bold text-white mb-2">No Plan Selected</h3>
        <button onClick={() => navigate('/app/templates')} className="btn btn-primary">Create Plan</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">PAPs Management</h2>
          <p className="text-sm text-white/40">Programs, Activities, and Projects with budget and progress tracking</p>
        </div>
        <button onClick={() => { setEditingPap(null); setShowModal(true); }} className="btn btn-primary text-sm">
          <Plus size={14} /> Add PAP
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <DollarSign size={20} className="text-gold mx-auto mb-1" />
          <div className="font-cinzel text-xl font-bold text-white">₱{spentBudget.toLocaleString()}</div>
          <div className="text-xs text-white/40">of ₱{totalBudget.toLocaleString()} allocated</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <TrendingUp size={20} className="text-gold mx-auto mb-1" />
          <div className="font-cinzel text-xl font-bold text-white">{avgProgress}%</div>
          <div className="text-xs text-white/40">Average progress</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <ListChecks size={20} className="text-gold mx-auto mb-1" />
          <div className="font-cinzel text-xl font-bold text-white">{paps.length}</div>
          <div className="text-xs text-white/40">Total PAPs</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="text-sm w-32">
          <option value="all">All Types</option>
          <option value="program">Programs</option>
          <option value="activity">Activities</option>
          <option value="project">Projects</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm w-32">
          <option value="all">All Status</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* PAPs Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left p-3 text-xs text-gold/70 uppercase tracking-wider">Code</th>
                <th className="text-left p-3 text-xs text-gold/70 uppercase tracking-wider">Title</th>
                <th className="text-left p-3 text-xs text-gold/70 uppercase tracking-wider">Type</th>
                <th className="text-left p-3 text-xs text-gold/70 uppercase tracking-wider">Status</th>
                <th className="text-left p-3 text-xs text-gold/70 uppercase tracking-wider">Budget</th>
                <th className="text-left p-3 text-xs text-gold/70 uppercase tracking-wider">Progress</th>
                <th className="text-left p-3 text-xs text-gold/70 uppercase tracking-wider">Due</th>
                <th className="text-left p-3 text-xs text-gold/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pap) => (
                <tr key={pap.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 text-white/60 font-mono text-xs">{pap.code || '-'}</td>
                  <td className="p-3 text-white font-medium">{pap.title}</td>
                  <td className="p-3"><span className={`badge ${TYPE_COLORS[pap.type]}`}>{pap.type}</span></td>
                  <td className="p-3"><span className={`badge ${STATUS_COLORS[pap.status]}`}>{pap.status.replace('_', ' ')}</span></td>
                  <td className="p-3 text-white/60">₱{pap.budget_allocated.toLocaleString()}</td>
                  <td className="p-3">
                    <div className="w-24 bg-white/10 rounded-full h-1.5">
                      <div className="bg-gold h-1.5 rounded-full" style={{ width: `${pap.progress_pct}%` }} />
                    </div>
                    <span className="text-xs text-white/40">{pap.progress_pct}%</span>
                  </td>
                  <td className="p-3 text-white/40 text-xs">{pap.end_date || pap.due_quarter}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingPap(pap); setShowModal(true); }} className="p-1 text-white/30 hover:text-gold"><TrendingUp size={12} /></button>
                      <button onClick={() => deletePap(currentPlan.id || currentPlan.local_id || '', pap.id)} className="p-1 text-white/30 hover:text-red-400"><X size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/20 text-sm">No PAPs match your filters.</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl border border-gold/20 bg-gradient-to-b from-[#022c22] to-[#011a12] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-cinzel text-lg font-bold text-gold mb-4">{editingPap ? 'Edit PAP' : 'Add PAP'}</h3>
            <div className="space-y-3">
              <input defaultValue={editingPap?.title || ''} placeholder="Title" id="pap-title" />
              <textarea defaultValue={editingPap?.description || ''} placeholder="Description" rows={2} id="pap-desc" />
              <div className="grid grid-cols-2 gap-3">
                <select defaultValue={editingPap?.type || 'activity'} id="pap-type">
                  <option value="program">Program</option>
                  <option value="activity">Activity</option>
                  <option value="project">Project</option>
                </select>
                <select defaultValue={editingPap?.status || 'planned'} id="pap-status">
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" defaultValue={editingPap?.budget_allocated || 0} placeholder="Budget (PHP)" id="pap-budget" />
                <input type="number" defaultValue={editingPap?.progress_pct || 0} placeholder="Progress %" id="pap-progress" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" defaultValue={editingPap?.start_date || ''} id="pap-start" />
                <input type="date" defaultValue={editingPap?.end_date || ''} id="pap-end" />
              </div>
              <input defaultValue={editingPap?.lead_agency || ''} placeholder="Lead Agency" id="pap-agency" />
              <button onClick={() => handleSave({
                title: (document.getElementById('pap-title') as HTMLInputElement)?.value,
                description: (document.getElementById('pap-desc') as HTMLTextAreaElement)?.value,
                type: (document.getElementById('pap-type') as HTMLSelectElement)?.value as Pap['type'],
                status: (document.getElementById('pap-status') as HTMLSelectElement)?.value as Pap['status'],
                budget_allocated: Number((document.getElementById('pap-budget') as HTMLInputElement)?.value),
                progress_pct: Number((document.getElementById('pap-progress') as HTMLInputElement)?.value),
                start_date: (document.getElementById('pap-start') as HTMLInputElement)?.value || null,
                end_date: (document.getElementById('pap-end') as HTMLInputElement)?.value || null,
                lead_agency: (document.getElementById('pap-agency') as HTMLInputElement)?.value || null,
              })} className="btn btn-primary w-full">
                <Plus size={14} /> {editingPap ? 'Update' : 'Add'} PAP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
