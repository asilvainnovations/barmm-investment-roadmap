import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, X, Brain, Sparkles, Crosshair, ArrowRight, Star, AlertTriangle, Globe, Shield } from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import type { SwotItem } from '../../types';

const BEIE_CLUSTERS = [
  'foundations', 'transformers', 'enablers', 'connectors', 'financiers'
];

const CATEGORY_CONFIG = {
  strength: { label: 'Strengths', color: 'border-green-500', bg: 'bg-green-500/5', icon: Shield, desc: 'Internal, positive factors' },
  weakness: { label: 'Weaknesses', color: 'border-red-500', bg: 'bg-red-500/5', icon: AlertTriangle, desc: 'Internal, negative factors' },
  opportunity: { label: 'Opportunities', color: 'border-blue-500', bg: 'bg-blue-500/5', icon: Globe, desc: 'External, positive factors' },
  threat: { label: 'Threats', color: 'border-yellow-500', bg: 'bg-yellow-500/5', icon: Star, desc: 'External, negative factors' },
};

function SwotCard({ item, onEdit, onDelete }: { item: SwotItem; onEdit: (item: SwotItem) => void; onDelete: (id: string) => void }) {
  const config = CATEGORY_CONFIG[item.category];
  const Icon = config.icon;
  return (
    <div className={`glass rounded-lg p-4 ${item.category === 'strength' ? 'swot-strength' : item.category === 'weakness' ? 'swot-weakness' : item.category === 'opportunity' ? 'swot-opportunity' : 'swot-threat'} card-hover group`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gold/60" />
          {item.ai_generated && <Sparkles size={12} className="text-gold" />}
          <span className={`badge badge-${item.priority === 'critical' ? 'critical' : item.priority === 'high' ? 'high' : item.priority === 'medium' ? 'medium' : 'low'}`}>{item.priority}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(item)} className="p-1 text-white/30 hover:text-gold transition-colors"><Crosshair size={12} /></button>
          <button onClick={() => onDelete(item.id)} className="p-1 text-white/30 hover:text-red-400 transition-colors"><X size={12} /></button>
        </div>
      </div>
      <h4 className="font-medium text-sm text-white mb-1">{item.title}</h4>
      <p className="text-xs text-white/40 mb-2">{item.description}</p>
      <div className="flex items-center gap-3 text-xs text-white/30">
        <span>I:{item.impact} L:{item.likelihood}</span>
        <span className="text-gold/60">RI:{item.resilience_index}</span>
        <span className="ml-auto capitalize">{item.beie_cluster}</span>
      </div>
    </div>
  );
}

function SwotModal({ isOpen, onClose, onSave, editingItem }: { isOpen: boolean; onClose: () => void; onSave: (item: Partial<SwotItem>) => void; editingItem: SwotItem | null }) {
  const [category, setCategory] = useState<SwotItem['category']>('strength');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState(3);
  const [likelihood, setLikelihood] = useState(3);
  const [priority, setPriority] = useState<SwotItem['priority']>('medium');
  const [beieCluster, setBeieCluster] = useState('foundations');

  useEffect(() => {
    if (editingItem) {
      setCategory(editingItem.category);
      setTitle(editingItem.title);
      setDescription(editingItem.description || '');
      setImpact(editingItem.impact);
      setLikelihood(editingItem.likelihood);
      setPriority(editingItem.priority);
      setBeieCluster(editingItem.beie_cluster);
    } else {
      setCategory('strength');
      setTitle('');
      setDescription('');
      setImpact(3);
      setLikelihood(3);
      setPriority('medium');
      setBeieCluster('foundations');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-gold/20 bg-gradient-to-b from-[#022c22] to-[#011a12] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-cinzel text-lg font-bold text-gold">{editingItem ? 'Edit SWOT Item' : 'Add SWOT Item'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as SwotItem['category'][]).map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`py-2 rounded-lg text-xs font-medium capitalize transition-colors ${category === c ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40 hover:text-white/60'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter SWOT item title" />
          </div>
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Impact (1-5)</label>
              <input type="number" min={1} max={5} value={impact} onChange={(e) => setImpact(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Likelihood (1-5)</label>
              <input type="number" min={1} max={5} value={likelihood} onChange={(e) => setLikelihood(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'critical'] as SwotItem['priority'][]).map((p) => (
                <button key={p} onClick={() => setPriority(p)} className={`py-2 rounded-lg text-xs font-medium capitalize transition-colors ${priority === p ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40 hover:text-white/60'}`}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gold/70 mb-1 uppercase tracking-wider">BEIE Cluster</label>
            <select value={beieCluster} onChange={(e) => setBeieCluster(e.target.value)}>
              {BEIE_CLUSTERS.map((c) => <option key={c} value={c} className="bg-[#022c22] capitalize">{c}</option>)}
            </select>
          </div>
          <button onClick={() => { onSave({ category, title, description, impact, likelihood, priority, beie_cluster: beieCluster }); onClose(); }} className="btn btn-primary w-full">
            <Plus size={14} /> {editingItem ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AiSuggestionModal({ isOpen, onClose, suggestions, onAccept }: { isOpen: boolean; onClose: () => void; suggestions: SwotItem[]; onAccept: (items: SwotItem[]) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg rounded-2xl border border-gold/20 bg-gradient-to-b from-[#022c22] to-[#011a12] p-6 shadow-2xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cinzel text-lg font-bold text-gold flex items-center gap-2"><Brain size={20} /> AI Suggestions</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <p className="text-sm text-white/40 mb-4">Select the suggestions to add to your SWOT analysis.</p>
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.id} onClick={() => setSelected((prev) => { const next = new Set(prev); if (next.has(s.id)) next.delete(s.id); else next.add(s.id); return next; })} className={`glass rounded-lg p-3 cursor-pointer transition-colors ${selected.has(s.id) ? 'border-gold/40 bg-gold/5' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded border ${selected.has(s.id) ? 'bg-gold border-gold' : 'border-white/20'}`} />
                <span className={`text-xs capitalize ${s.category === 'strength' ? 'text-green-400' : s.category === 'weakness' ? 'text-red-400' : s.category === 'opportunity' ? 'text-blue-400' : 'text-yellow-400'}`}>{s.category}</span>
                <span className="badge badge-high text-xs">{s.priority}</span>
              </div>
              <h4 className="text-sm font-medium text-white">{s.title}</h4>
              <p className="text-xs text-white/40">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => { onAccept(suggestions.filter((s) => selected.has(s.id))); onClose(); }} className="btn btn-primary flex-1" disabled={selected.size === 0}>
            <Sparkles size={14} /> Accept {selected.size} Selected
          </button>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function SwotAnalysis() {
  const { plans, currentPlanId, addSwotItem, updateSwotItem, deleteSwotItem, getCurrentPlan, addNotification } = useStrategicPlanStore();
  const { isAuthenticated } = useAuth();
  const currentPlan = getCurrentPlan();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SwotItem | null>(null);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<SwotItem[]>([]);
  const [loading, setLoading] = useState(false);

  const swotItems = currentPlan?.swot_items || [];
  const grouped = {
    strength: swotItems.filter((s) => s.category === 'strength'),
    weakness: swotItems.filter((s) => s.category === 'weakness'),
    opportunity: swotItems.filter((s) => s.category === 'opportunity'),
    threat: swotItems.filter((s) => s.category === 'threat'),
  };

  const handleSave = async (item: Partial<SwotItem>) => {
    if (!currentPlan) return;
    const planId = currentPlan.id || currentPlan.local_id || '';
    if (editingItem) {
      updateSwotItem(planId, editingItem.id, item);
    } else {
      const newItem: SwotItem = {
        id: crypto.randomUUID(),
        plan_id: planId,
        category: item.category!,
        title: item.title!,
        description: item.description || null,
        impact: item.impact || 3,
        likelihood: item.likelihood || 3,
        resilience_index: 0,
        priority: item.priority || 'medium',
        ai_generated: false,
        ai_recommendation: null,
        beie_cluster: item.beie_cluster || 'foundations',
        assigned_to: null,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isNew: true,
      };
      addSwotItem(planId, newItem);
    }
    setEditingItem(null);
    addNotification({ message: editingItem ? 'SWOT item updated' : 'SWOT item added', type: 'success' });

    if (isAuthenticated && currentPlan.id) {
      const { error } = await supabase.from('swot_items').upsert({
        id: editingItem?.id || crypto.randomUUID(),
        plan_id: currentPlan.id,
        ...item,
        updated_at: new Date().toISOString(),
      });
      if (error) console.error('Sync error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentPlan) return;
    const planId = currentPlan.id || currentPlan.local_id || '';
    deleteSwotItem(planId, id);
    addNotification({ message: 'SWOT item deleted', type: 'info' });
    if (isAuthenticated && currentPlan.id) {
      await supabase.from('swot_items').delete().eq('id', id);
    }
  };

  const handleAiGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${(import.meta as any).env.VITE_SUPABASE_URL}/functions/v1/ai-strategy-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${(import.meta as any).env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({
          section: 'swot',
          plan_context: {
            title: currentPlan?.title,
            industry: currentPlan?.industry,
            region: currentPlan?.region,
            description: currentPlan?.description,
          },
        }),
      });
      const data = await response.json();
      const suggestions: SwotItem[] = (data.suggestions || []).map((s: Record<string, unknown>) => ({
        id: crypto.randomUUID(),
        plan_id: currentPlan?.id || '',
        category: s.category as SwotItem['category'],
        title: s.title as string,
        description: s.description as string,
        impact: s.impact as number,
        likelihood: s.likelihood as number,
        resilience_index: 0,
        priority: s.priority as SwotItem['priority'],
        ai_generated: true,
        ai_recommendation: null,
        beie_cluster: s.beie_cluster as string,
        assigned_to: null,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      setAiSuggestions(suggestions);
      setShowAiSuggestions(true);
    } catch (err) {
      addNotification({ message: 'AI generation failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAi = (items: SwotItem[]) => {
    if (!currentPlan) return;
    const planId = currentPlan.id || currentPlan.local_id || '';
    items.forEach((item) => addSwotItem(planId, item));
    addNotification({ message: `Added ${items.length} AI suggestions`, type: 'success' });
  };

  if (!currentPlan) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Crosshair size={48} className="text-gold/30 mx-auto mb-4" />
        <h3 className="font-cinzel text-xl font-bold text-white mb-2">No Plan Selected</h3>
        <p className="text-white/40 mb-6">Select or create a plan to start your SWOT analysis.</p>
        <button onClick={() => navigate('/app/templates')} className="btn btn-primary">Create Plan</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">SWOT Analysis</h2>
          <p className="text-sm text-white/40">Assess your strategic position with impact/likelihood scoring</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAiGenerate} disabled={loading} className="btn btn-secondary text-sm">
            {loading ? <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <><Brain size={14} /> AI Suggest</>}
          </button>
          <button onClick={() => { setEditingItem(null); setShowModal(true); }} className="btn btn-primary text-sm">
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(Object.keys(CATEGORY_CONFIG) as SwotItem['category'][]).map((category) => {
          const config = CATEGORY_CONFIG[category];
          const Icon = config.icon;
          const items = grouped[category];
          return (
            <div key={category} className={`glass rounded-xl border-t-2 ${config.color} p-4`}>
              <div className="flex items-center gap-2 mb-4">
                <Icon size={16} className="text-gold" />
                <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">{config.label}</h3>
                <span className="text-xs text-white/30 ml-1">({items.length})</span>
                <span className="text-xs text-white/30 ml-auto">{config.desc}</span>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <SwotCard key={item.id} item={item} onEdit={(i) => { setEditingItem(i); setShowModal(true); }} onDelete={handleDelete} />
                ))}
                {items.length === 0 && (
                  <div className="text-center py-8 text-white/20 text-sm">
                    No {config.label.toLowerCase()} added yet.
                    <button onClick={() => { setEditingItem(null); setShowModal(true); }} className="block mx-auto mt-2 text-gold hover:text-gold-light text-xs">
                      <Plus size={12} className="inline" /> Add first item
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SwotModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSave} editingItem={editingItem} />
      <AiSuggestionModal isOpen={showAiSuggestions} onClose={() => setShowAiSuggestions(false)} suggestions={aiSuggestions} onAccept={handleAcceptAi} />
    </div>
  );
}
