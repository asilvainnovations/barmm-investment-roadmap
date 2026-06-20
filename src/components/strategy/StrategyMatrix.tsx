import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Brain, Sparkles, ArrowRight, Target, Shield, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import type { StrategyMatrix as StrategyMatrixType, SwotItem } from '../../types';

const QUADRANT_CONFIG = {
  SO: { label: 'SO - Aggressive', color: 'border-green-500', bg: 'bg-green-500/5', icon: Zap, desc: 'Use strengths to pursue opportunities' },
  ST: { label: 'ST - Diversification', color: 'border-blue-500', bg: 'bg-blue-500/5', icon: Shield, desc: 'Use strengths to avoid threats' },
  WO: { label: 'WO - Turnaround', color: 'border-yellow-500', bg: 'bg-yellow-500/5', icon: AlertTriangle, desc: 'Overcome weaknesses by pursuing opportunities' },
  WT: { label: 'WT - Defensive', color: 'border-red-500', bg: 'bg-red-500/5', icon: Target, desc: 'Minimize weaknesses and avoid threats' },
};

const BEIE_CLUSTERS = ['foundations', 'transformers', 'enablers', 'connectors', 'financiers'];

function StrategyCard({ strategy, onEdit, onDelete }: { strategy: StrategyMatrixType; onEdit: (s: StrategyMatrixType) => void; onDelete: (id: string) => void }) {
  const config = QUADRANT_CONFIG[strategy.quadrant];
  const Icon = config.icon;
  return (
    <div className={`glass rounded-lg p-4 card-hover group ${config.color} border-l-2`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gold/60" />
          {strategy.ai_generated && <Sparkles size={12} className="text-gold" />}
          <span className={`badge badge-${strategy.priority === 'critical' ? 'critical' : strategy.priority === 'high' ? 'high' : strategy.priority === 'medium' ? 'medium' : 'low'}`}>{strategy.priority}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(strategy)} className="p-1 text-white/30 hover:text-gold"><Target size={12} /></button>
          <button onClick={() => onDelete(strategy.id)} className="p-1 text-white/30 hover:text-red-400"><X size={12} /></button>
        </div>
      </div>
      <p className="text-sm font-medium text-white mb-1">{strategy.strategy}</p>
      {strategy.description && <p className="text-xs text-white/40 mb-2">{strategy.description}</p>}
      <div className="flex items-center gap-3 text-xs text-white/30">
        <span className="capitalize">{strategy.beie_cluster}</span>
        <span className={`ml-auto ${strategy.status === 'completed' ? 'text-green-400' : strategy.status === 'in_progress' ? 'text-blue-400' : 'text-white/30'}`}>{strategy.status.replace('_', ' ')}</span>
      </div>
    </div>
  );
}

function StrategyModal({ isOpen, onClose, onSave, editingItem, swotItems }: { isOpen: boolean; onClose: () => void; onSave: (item: Partial<StrategyMatrixType>) => void; editingItem: StrategyMatrixType | null; swotItems: SwotItem[] }) {
  const [quadrant, setQuadrant] = useState<StrategyMatrixType['quadrant']>('SO');
  const [strategy, setStrategy] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<StrategyMatrixType['priority']>('medium');
  const [status, setStatus] = useState<StrategyMatrixType['status']>('pending');
  const [beieCluster, setBeieCluster] = useState('foundations');
  const [linkedSwot, setLinkedSwot] = useState<string[]>([]);

  useEffect(() => {
    if (editingItem) {
      setQuadrant(editingItem.quadrant);
      setStrategy(editingItem.strategy);
      setDescription(editingItem.description || '');
      setPriority(editingItem.priority);
      setStatus(editingItem.status);
      setBeieCluster(editingItem.beie_cluster);
      setLinkedSwot(editingItem.linked_swot_items || []);
    } else {
      setQuadrant('SO');
      setStrategy('');
      setDescription('');
      setPriority('medium');
      setStatus('pending');
      setBeieCluster('foundations');
      setLinkedSwot([]);
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg rounded-2xl border border-gold/20 bg-gradient-to-b from-[#022c22] to-[#011a12] p-6 shadow-2xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-cinzel text-lg font-bold text-gold">{editingItem ? 'Edit Strategy' : 'Add Strategy'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Quadrant</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(QUADRANT_CONFIG) as StrategyMatrixType['quadrant'][]).map((q) => (
                <button key={q} onClick={() => setQuadrant(q)} className={`py-2 rounded-lg text-xs font-medium transition-colors ${quadrant === q ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40 hover:text-white/60'}`}>{q}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Strategy</label>
            <textarea value={strategy} onChange={(e) => setStrategy(e.target.value)} placeholder="Enter strategy statement" rows={2} />
          </div>
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Implementation details" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Priority</label>
              <div className="grid grid-cols-2 gap-2">
                {(['low', 'medium', 'high', 'critical'] as StrategyMatrixType['priority'][]).map((p) => (
                  <button key={p} onClick={() => setPriority(p)} className={`py-2 rounded-lg text-xs font-medium capitalize transition-colors ${priority === p ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40 hover:text-white/60'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as StrategyMatrixType['status'])}>
                {['pending', 'in_progress', 'completed', 'cancelled'].map((s) => <option key={s} value={s} className="bg-[#022c22] capitalize">{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">BEIE Cluster</label>
            <select value={beieCluster} onChange={(e) => setBeieCluster(e.target.value)}>
              {BEIE_CLUSTERS.map((c) => <option key={c} value={c} className="bg-[#022c22] capitalize">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Linked SWOT Items</label>
            <div className="max-h-32 overflow-auto space-y-1">
              {swotItems.map((s) => (
                <div key={s.id} onClick={() => setLinkedSwot((prev) => prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id])} className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/5">
                  <div className={`w-3 h-3 rounded border ${linkedSwot.includes(s.id) ? 'bg-gold border-gold' : 'border-white/20'}`} />
                  <span className="text-xs text-white/60 capitalize">[{s.category}] {s.title}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => { onSave({ quadrant, strategy, description, priority, status, beie_cluster: beieCluster, linked_swot_items: linkedSwot }); onClose(); }} className="btn btn-primary w-full">
            <Plus size={14} /> {editingItem ? 'Update Strategy' : 'Add Strategy'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function StrategyMatrix() {
  const { getCurrentPlan, addStrategy, updateStrategy, deleteStrategy, addNotification } = useStrategicPlanStore();
  const { isAuthenticated } = useAuth();
  const currentPlan = getCurrentPlan();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<StrategyMatrixType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<StrategyMatrixType[]>([]);

  const strategies = currentPlan?.strategies || [];
  const swotItems = currentPlan?.swot_items || [];
  const grouped = {
    SO: strategies.filter((s) => s.quadrant === 'SO'),
    ST: strategies.filter((s) => s.quadrant === 'ST'),
    WO: strategies.filter((s) => s.quadrant === 'WO'),
    WT: strategies.filter((s) => s.quadrant === 'WT'),
  };

  const handleSave = async (item: Partial<StrategyMatrixType>) => {
    if (!currentPlan) return;
    const planId = currentPlan.id || currentPlan.local_id || '';
    if (editingItem) {
      updateStrategy(planId, editingItem.id, item);
    } else {
      const newStrategy: StrategyMatrixType = {
        id: crypto.randomUUID(),
        plan_id: planId,
        quadrant: item.quadrant!,
        strategy: item.strategy!,
        description: item.description || null,
        priority: item.priority || 'medium',
        status: item.status || 'pending',
        ai_generated: false,
        linked_swot_items: item.linked_swot_items || [],
        beie_cluster: item.beie_cluster || 'foundations',
        assigned_to: null,
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isNew: true,
      };
      addStrategy(planId, newStrategy);
    }
    setEditingItem(null);
    addNotification({ message: editingItem ? 'Strategy updated' : 'Strategy added', type: 'success' });
    if (isAuthenticated && currentPlan.id) {
      await supabase.from('strategy_matrix').upsert({ id: editingItem?.id || crypto.randomUUID(), plan_id: currentPlan.id, ...item });
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentPlan) return;
    const planId = currentPlan.id || currentPlan.local_id || '';
    deleteStrategy(planId, id);
    addNotification({ message: 'Strategy deleted', type: 'info' });
    if (isAuthenticated && currentPlan.id) {
      await supabase.from('strategy_matrix').delete().eq('id', id);
    }
  };

  const handleAiGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${(import.meta as any).env.VITE_SUPABASE_URL}/functions/v1/ai-strategy-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${(import.meta as any).env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({
          section: 'strategy',
          plan_context: {
            title: currentPlan?.title,
            industry: currentPlan?.industry,
            swot_items: currentPlan?.swot_items?.map((s) => ({ category: s.category, title: s.title, description: s.description, impact: s.impact, likelihood: s.likelihood })),
          },
        }),
      });
      const data = await response.json();
      const suggestions: StrategyMatrixType[] = (data.suggestions || []).map((s: Record<string, unknown>) => ({
        id: crypto.randomUUID(),
        plan_id: currentPlan?.id || '',
        quadrant: s.quadrant as StrategyMatrixType['quadrant'],
        strategy: s.strategy as string,
        description: s.description as string,
        priority: s.priority as StrategyMatrixType['priority'],
        status: 'pending',
        ai_generated: true,
        linked_swot_items: [],
        beie_cluster: s.beie_cluster as string,
        assigned_to: null,
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      setAiSuggestions(suggestions);
      setShowAi(true);
    } catch (err) {
      addNotification({ message: 'AI generation failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAi = (items: StrategyMatrixType[]) => {
    if (!currentPlan) return;
    const planId = currentPlan.id || currentPlan.local_id || '';
    items.forEach((item) => addStrategy(planId, item));
    addNotification({ message: `Added ${items.length} AI strategies`, type: 'success' });
  };

  if (!currentPlan) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <GitBranch size={48} className="text-gold/30 mx-auto mb-4" />
        <h3 className="font-cinzel text-xl font-bold text-white mb-2">No Plan Selected</h3>
        <p className="text-white/40 mb-6">Select or create a plan to build your strategy matrix.</p>
        <button onClick={() => navigate('/app/templates')} className="btn btn-primary">Create Plan</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">Strategy Matrix</h2>
          <p className="text-sm text-white/40">TOWS strategies derived from SWOT analysis</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAiGenerate} disabled={loading} className="btn btn-secondary text-sm">
            {loading ? <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <><Brain size={14} /> AI Suggest</>}
          </button>
          <button onClick={() => { setEditingItem(null); setShowModal(true); }} className="btn btn-primary text-sm">
            <Plus size={14} /> Add Strategy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(Object.keys(QUADRANT_CONFIG) as StrategyMatrixType['quadrant'][]).map((q) => {
          const config = QUADRANT_CONFIG[q];
          const Icon = config.icon;
          const items = grouped[q];
          return (
            <div key={q} className={`glass rounded-xl border-t-2 ${config.color} p-4`}>
              <div className="flex items-center gap-2 mb-4">
                <Icon size={16} className="text-gold" />
                <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">{config.label}</h3>
                <span className="text-xs text-white/30 ml-1">({items.length})</span>
                <span className="text-xs text-white/30 ml-auto">{config.desc}</span>
              </div>
              <div className="space-y-3">
                {items.map((strategy) => (
                  <StrategyCard key={strategy.id} strategy={strategy} onEdit={(s) => { setEditingItem(s); setShowModal(true); }} onDelete={handleDelete} />
                ))}
                {items.length === 0 && (
                  <div className="text-center py-8 text-white/20 text-sm">
                    No {q} strategies yet.
                    <button onClick={() => { setEditingItem(null); setShowModal(true); }} className="block mx-auto mt-2 text-gold hover:text-gold-light text-xs">
                      <Plus size={12} className="inline" /> Add first strategy
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <StrategyModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSave} editingItem={editingItem} swotItems={swotItems} />
      {showAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAi(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg rounded-2xl border border-gold/20 bg-gradient-to-b from-[#022c22] to-[#011a12] p-6 shadow-2xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-cinzel text-lg font-bold text-gold flex items-center gap-2 mb-4"><Brain size={20} /> AI Strategy Suggestions</h3>
            <div className="space-y-3">
              {aiSuggestions.map((s) => (
                <div key={s.id} className="glass rounded-lg p-3">
                  <span className={`text-xs font-bold ${s.quadrant === 'SO' ? 'text-green-400' : s.quadrant === 'ST' ? 'text-blue-400' : s.quadrant === 'WO' ? 'text-yellow-400' : 'text-red-400'}`}>{s.quadrant}</span>
                  <span className="badge badge-high text-xs ml-2">{s.priority}</span>
                  <p className="text-sm font-medium text-white mt-1">{s.strategy}</p>
                  <p className="text-xs text-white/40">{s.description}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { handleAcceptAi(aiSuggestions); setShowAi(false); }} className="btn btn-primary flex-1"><Sparkles size={14} /> Accept All</button>
              <button onClick={() => setShowAi(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
