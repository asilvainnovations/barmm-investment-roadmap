import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Crosshair, GitBranch, BarChart3, ListChecks,
  Activity, FileText, FolderOpen, Users, Bell, ChevronLeft, ChevronRight,
  Globe, Map, Settings
} from 'lucide-react';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';

const navItems = [
  { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: 'swot', label: 'SWOT Analysis', icon: Crosshair },
  { path: 'strategy', label: 'Strategy Matrix', icon: GitBranch },
  { path: 'scorecard', label: 'Balanced Scorecard', icon: BarChart3 },
  { path: 'paps', label: 'PAPs Management', icon: ListChecks },
  { path: 'systems', label: 'Systems Thinking', icon: Activity },
  { path: 'export', label: 'Plan Export', icon: FileText },
  { path: 'templates', label: 'Templates', icon: FolderOpen },
  { path: 'teams', label: 'Teams', icon: Users },
  { path: 'compare', label: 'Compare', icon: Map },
  { path: 'activity', label: 'Activity Log', icon: Bell },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useStrategicPlanStore();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 bg-[#022c22]/95 border-r border-gold/20 backdrop-blur-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gold/10">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-[#022c22] font-cinzel font-bold text-sm">B</div>
            <span className="font-cinzel font-bold text-gold text-sm tracking-wide">BIRD</span>
          </div>
        )}
        <button onClick={toggleSidebar} className="text-white/40 hover:text-white transition-colors">
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(`/app/${item.path}`)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive ? 'bg-gold/10 text-gold border-r-2 border-gold' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon size={18} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
