import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { SwotAnalysis } from './components/swot/SwotAnalysis';
import { StrategyMatrix } from './components/strategy/StrategyMatrix';
import { BalancedScorecardView } from './components/scorecard/BalancedScorecardView';
import { PapsManagement } from './components/paps/PapsManagement';
import { SystemsThinking } from './components/systems/SystemsThinking';
import { PlanExport } from './components/export/PlanExport';
import { PlanTemplates } from './components/templates/PlanTemplates';
import { TeamManagement } from './components/teams/TeamManagement';
import { ActivityTimeline } from './components/activity/ActivityTimeline';
import { PlanComparison } from './components/compare/PlanComparison';
import { AdminPanel } from './components/admin/AdminPanel';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen text-gold">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen text-gold">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== 'admin' && user?.role !== 'super_admin') return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="swot" element={<SwotAnalysis />} />
        <Route path="strategy" element={<StrategyMatrix />} />
        <Route path="scorecard" element={<BalancedScorecardView />} />
        <Route path="paps" element={<PapsManagement />} />
        <Route path="systems" element={<SystemsThinking />} />
        <Route path="export" element={<PlanExport />} />
        <Route path="templates" element={<PlanTemplates />} />
        <Route path="teams" element={<TeamManagement />} />
        <Route path="activity" element={<ActivityTimeline />} />
        <Route path="compare" element={<PlanComparison />} />
      </Route>
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
    </Routes>
  );
}
