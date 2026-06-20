import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  StrategicPlan, SwotItem, StrategyMatrix, BalancedScorecard,
  ScorecardObjective, ScorecardKpi, Pap, SyncStatus, User
} from '../types';

interface PlanState {
  plans: StrategicPlan[];
  currentPlanId: string | null;
  isLoading: boolean;
  isOnline: boolean;
  syncStatus: SyncStatus;
  lastSync: string | null;
  user: User | null;
  sidebarOpen: boolean;
  activeSection: string;
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;

  // Actions
  setPlans: (plans: StrategicPlan[]) => void;
  addPlan: (plan: StrategicPlan) => void;
  updatePlan: (planId: string, updates: Partial<StrategicPlan>) => void;
  deletePlan: (planId: string) => void;
  setCurrentPlan: (planId: string | null) => void;
  getCurrentPlan: () => StrategicPlan | null;
  setLoading: (loading: boolean) => void;
  setOnline: (online: boolean) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setLastSync: (time: string) => void;
  setUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setActiveSection: (section: string) => void;
  addNotification: (notification: { message: string; type: 'success' | 'error' | 'info' }) => void;
  removeNotification: (id: string) => void;

  // SWOT
  addSwotItem: (planId: string, item: SwotItem) => void;
  updateSwotItem: (planId: string, itemId: string, updates: Partial<SwotItem>) => void;
  deleteSwotItem: (planId: string, itemId: string) => void;

  // Strategy
  addStrategy: (planId: string, strategy: StrategyMatrix) => void;
  updateStrategy: (planId: string, strategyId: string, updates: Partial<StrategyMatrix>) => void;
  deleteStrategy: (planId: string, strategyId: string) => void;

  // Scorecard
  addScorecard: (planId: string, scorecard: BalancedScorecard) => void;
  addObjective: (planId: string, scorecardId: string, objective: ScorecardObjective) => void;
  updateObjective: (planId: string, objectiveId: string, updates: Partial<ScorecardObjective>) => void;
  addKpi: (planId: string, objectiveId: string, kpi: ScorecardKpi) => void;
  updateKpi: (planId: string, kpiId: string, updates: Partial<ScorecardKpi>) => void;
  deleteKpi: (planId: string, kpiId: string) => void;

  // PAPs
  addPap: (planId: string, pap: Pap) => void;
  updatePap: (planId: string, papId: string, updates: Partial<Pap>) => void;
  deletePap: (planId: string, papId: string) => void;

  // Sync
  markPlanSynced: (planId: string) => void;
  markPlanPending: (planId: string) => void;

  // Load complete plan with nested data
  loadCompletePlan: (plan: StrategicPlan) => void;
}

const LOCAL_STORAGE_KEY = 'bird-strategic-plans';

export const useStrategicPlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      plans: [],
      currentPlanId: null,
      isLoading: false,
      isOnline: navigator.onLine,
      syncStatus: 'offline',
      lastSync: null,
      user: null,
      sidebarOpen: true,
      activeSection: 'dashboard',
      notifications: [],

      setPlans: (plans) => set({ plans }),

      addPlan: (plan) => {
        set((state) => {
          const exists = state.plans.find((p) => p.id === plan.id || p.local_id === plan.local_id);
          if (exists) {
            return {
              plans: state.plans.map((p) =>
                p.id === plan.id || p.local_id === plan.local_id ? { ...p, ...plan, sync_status: 'pending' as SyncStatus } : p
              ),
            };
          }
          return { plans: [...state.plans, { ...plan, sync_status: 'pending' as SyncStatus }] };
        });
      },

      updatePlan: (planId, updates) => {
        set((state) => ({
          plans: state.plans.map((p) =>
            (p.id === planId || p.local_id === planId)
              ? { ...p, ...updates, sync_status: 'pending' as SyncStatus, updated_at: new Date().toISOString() }
              : p
          ),
        }));
      },

      deletePlan: (planId) => {
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== planId && p.local_id !== planId),
          currentPlanId: state.currentPlanId === planId ? null : state.currentPlanId,
        }));
      },

      setCurrentPlan: (planId) => set({ currentPlanId: planId }),

      getCurrentPlan: () => {
        const state = get();
        return state.plans.find((p) => p.id === state.currentPlanId || p.local_id === state.currentPlanId) || null;
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setOnline: (online) => {
        set({ isOnline: online, syncStatus: online ? get().syncStatus : 'offline' });
      },

      setSyncStatus: (status) => set({ syncStatus: status }),

      setLastSync: (time) => set({ lastSync: time }),

      setUser: (user) => set({ user }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setActiveSection: (section) => set({ activeSection: section }),

      addNotification: (notification) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          notifications: [...state.notifications, { id, ...notification }],
        }));
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      addSwotItem: (planId, item) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              swot_items: [...(p.swot_items || []), item],
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      updateSwotItem: (planId, itemId, updates) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              swot_items: (p.swot_items || []).map((item) =>
                item.id === itemId ? { ...item, ...updates, isModified: true } : item
              ),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      deleteSwotItem: (planId, itemId) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              swot_items: (p.swot_items || []).filter((item) => item.id !== itemId),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      addStrategy: (planId, strategy) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              strategies: [...(p.strategies || []), strategy],
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      updateStrategy: (planId, strategyId, updates) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              strategies: (p.strategies || []).map((s) =>
                s.id === strategyId ? { ...s, ...updates, isModified: true } : s
              ),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      deleteStrategy: (planId, strategyId) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              strategies: (p.strategies || []).filter((s) => s.id !== strategyId),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      addScorecard: (planId, scorecard) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              scorecards: [...(p.scorecards || []), scorecard],
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      addObjective: (planId, scorecardId, objective) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              scorecards: (p.scorecards || []).map((sc) => {
                if (sc.id !== scorecardId) return sc;
                return {
                  ...sc,
                  objectives: [...(sc.objectives || []), objective],
                };
              }),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      updateObjective: (planId, objectiveId, updates) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              scorecards: (p.scorecards || []).map((sc) => ({
                ...sc,
                objectives: (sc.objectives || []).map((obj) =>
                  obj.id === objectiveId ? { ...obj, ...updates, isModified: true } : obj
                ),
              })),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      addKpi: (planId, objectiveId, kpi) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              scorecards: (p.scorecards || []).map((sc) => ({
                ...sc,
                objectives: (sc.objectives || []).map((obj) => {
                  if (obj.id !== objectiveId) return obj;
                  return {
                    ...obj,
                    kpis: [...(obj.kpis || []), kpi],
                  };
                }),
              })),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      updateKpi: (planId, kpiId, updates) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              scorecards: (p.scorecards || []).map((sc) => ({
                ...sc,
                objectives: (sc.objectives || []).map((obj) => ({
                  ...obj,
                  kpis: (obj.kpis || []).map((k) =>
                    k.id === kpiId ? { ...k, ...updates, isModified: true } : k
                  ),
                })),
              })),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      deleteKpi: (planId, kpiId) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              scorecards: (p.scorecards || []).map((sc) => ({
                ...sc,
                objectives: (sc.objectives || []).map((obj) => ({
                  ...obj,
                  kpis: (obj.kpis || []).filter((k) => k.id !== kpiId),
                })),
              })),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      addPap: (planId, pap) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              paps: [...(p.paps || []), pap],
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      updatePap: (planId, papId, updates) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              paps: (p.paps || []).map((pap) =>
                pap.id === papId ? { ...pap, ...updates, isModified: true } : pap
              ),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      deletePap: (planId, papId) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId && p.local_id !== planId) return p;
            return {
              ...p,
              paps: (p.paps || []).filter((pap) => pap.id !== papId),
              sync_status: 'pending' as SyncStatus,
            };
          }),
        }));
      },

      markPlanSynced: (planId) => {
        set((state) => ({
          plans: state.plans.map((p) =>
            (p.id === planId || p.local_id === planId)
              ? { ...p, sync_status: 'synced' as SyncStatus, last_synced_at: new Date().toISOString() }
              : p
          ),
        }));
      },

      markPlanPending: (planId) => {
        set((state) => ({
          plans: state.plans.map((p) =>
            (p.id === planId || p.local_id === planId)
              ? { ...p, sync_status: 'pending' as SyncStatus }
              : p
          ),
        }));
      },

      loadCompletePlan: (plan) => {
        set((state) => {
          const existing = state.plans.find((p) => p.id === plan.id || p.local_id === plan.local_id);
          if (existing) {
            return {
              plans: state.plans.map((p) =>
                p.id === plan.id || p.local_id === plan.local_id ? { ...p, ...plan } : p
              ),
            };
          }
          return { plans: [...state.plans, plan] };
        });
      },
    }),
    {
      name: LOCAL_STORAGE_KEY,
      partialize: (state) => ({
        plans: state.plans,
        currentPlanId: state.currentPlanId,
        syncStatus: state.syncStatus,
        lastSync: state.lastSync,
        user: state.user,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Listen for online/offline
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useStrategicPlanStore.getState().setOnline(true);
  });
  window.addEventListener('offline', () => {
    useStrategicPlanStore.getState().setOnline(false);
  });
}
