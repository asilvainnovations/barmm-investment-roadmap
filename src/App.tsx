import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Lazy load all route components for code splitting
const AppLayout = lazy(() => import('./components/layout/AppLayout').then(module => ({ default: module.AppLayout })));
const LandingPage = lazy(() => import('./components/landing/LandingPage').then(module => ({ default: module.LandingPage })));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const SwotAnalysis = lazy(() => import('./components/swot/SwotAnalysis').then(module => ({ default: module.SwotAnalysis })));
const StrategyMatrix = lazy(() => import('./components/strategy/StrategyMatrix').then(module => ({ default: module.StrategyMatrix })));
const BalancedScorecardView = lazy(() => import('./components/scorecard/BalancedScorecardView').then(module => ({ default: module.BalancedScorecardView })));
const PapsManagement = lazy(() => import('./components/paps/PapsManagement').then(module => ({ default: module.PapsManagement })));
const SystemsThinking = lazy(() => import('./components/systems/SystemsThinking').then(module => ({ default: module.SystemsThinking })));
const PlanExport = lazy(() => import('./components/export/PlanExport').then(module => ({ default: module.PlanExport })));
const PlanTemplates = lazy(() => import('./components/templates/PlanTemplates').then(module => ({ default: module.PlanTemplates })));
const TeamManagement = lazy(() => import('./components/teams/TeamManagement').then(module => ({ default: module.TeamManagement })));
const ActivityTimeline = lazy(() => import('./components/activity/ActivityTimeline').then(module => ({ default: module.ActivityTimeline })));
const PlanComparison = lazy(() => import('./components/compare/PlanComparison').then(module => ({ default: module.PlanComparison })));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel').then(module => ({ default: module.AdminPanel })));

// Professional Loading Screen Component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-dark flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated loading spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gold/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-gold/10 animate-pulse"></div>
        </div>
        
        {/* BIRD Logo placeholder */}
        <h1 className="font-cinzel text-3xl font-bold text-gold mb-2">BIRD</h1>
        <p className="font-cinzel text-gold/80 text-sm tracking-wider mb-4">Strategic Planning Platform</p>
        
        {/* Loading message */}
        <div className="flex items-center justify-center gap-2 text-gold/60 text-sm">
          <span className="w-2 h-2 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== 'admin' && user?.role !== 'super_admin') return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
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
    </Suspense>
  );
}
