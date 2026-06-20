import { ParetoKPIPanel } from '../components/panels/ParetoKPIPanel';
import { BSCViewPanel } from '../components/panels/BSCViewPanel';
import { ActionPlanPanel } from '../components/panels/ActionPlanPanel';
import { SystemsMELPanel } from '../components/panels/SystemsMELPanel';
import { PhaseTrackerPanel } from '../components/panels/PhaseTrackerPanel';
import { Topbar } from '../components/layout/Topbar';

export function PublicDashboard() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Topbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-4">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Live MEL · Phase 1: Foundation Building</span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-gold-gradient mb-3">The Emerging Bangsamoro</h1>
            <p className="text-sm text-white/50 max-w-2xl mx-auto">Monitoring, Evaluation & Learning — 2026 Priority Actions & 2035 Investment Targets aligned with BIRD 2026-2035 Roadmap</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="w-2 h-2 rounded-full bg-green-400" /> On Track
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="w-2 h-2 rounded-full bg-gold" /> Building
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Watch
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="w-2 h-2 rounded-full bg-yellow-400" /> At Risk
              </div>
            </div>
          </div>

          {/* Panels */}
          <ParetoKPIPanel />
          <BSCViewPanel />
          <ActionPlanPanel />
          <SystemsMELPanel />
          <PhaseTrackerPanel />
        </div>
      </main>
    </div>
  );
}
