import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Crosshair, GitBranch, BarChart3, ListChecks,
  Activity, Share2, FileText, FolderOpen, Users, Bell,
  ChevronLeft, ChevronRight, LogOut, User as UserIcon,
  Cloud, CloudOff, Wifi, WifiOff, RefreshCw, Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';
import { AuthModal } from '../auth/AuthModal';
import { UserProfileModal } from '../modals/UserProfileModal';
import type { SyncStatus } from '../../types';

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
  { path: 'compare', label: 'Compare', icon: Share2 },
  { path: 'activity', label: 'Activity Log', icon: Bell },
];

function SyncStatusIndicator({ status, lastSync }: { status: SyncStatus; lastSync: string | null }) {
  const icons = {
    synced: Cloud,
    pending: RefreshCw,
    syncing: RefreshCw,
    error: CloudOff,
    offline: WifiOff,
  };
  const Icon = icons[status] || Cloud;
  const colors = {
    synced: 'text-green-400',
    pending: 'text-yellow-400',
    syncing: 'text-blue-400 animate-spin',
    error: 'text-red-400',
    offline: 'text-gray-400',
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10" title={`Sync: ${status}${lastSync ? ` - Last: ${new Date(lastSync).toLocaleTimeString()}` : ''}`}>
      <Icon size={14} className={colors[status]} />
      <span className="text-xs text-white/50 capitalize">{status}</span>
      {lastSync && <span className="text-xs text-white/30">{new Date(lastSync).toLocaleTimeString()}</span>}
    </div>
  );
}

export function AppLayout() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { isOnline, syncStatus, lastSync, sidebarOpen, toggleSidebar, activeSection, setActiveSection } = useStrategicPlanStore();
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[#022c22]/95 border-r border-gold/20 backdrop-blur-xl transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
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

        <div className="flex items-center gap-2 px-4 py-3 border-b border-gold/10">
          <div className={`status-dot ${isOnline ? 'status-synced' : 'status-offline'}`} />
          {sidebarOpen && <span className="text-xs text-white/40">{isOnline ? 'Online' : 'Offline'}</span>}
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  setActiveSection(item.path);
                  navigate(`/app/${item.path}`);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold border-r-2 border-gold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={18} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="h-16 bg-[#022c22]/80 backdrop-blur-md border-b border-gold/10 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="font-cinzel text-lg font-bold text-white capitalize">{currentPath.replace('-', ' ')}</h1>
          </div>

          <div className="flex items-center gap-4">
            <SyncStatusIndicator status={syncStatus} lastSync={lastSync} />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-cinzel font-bold text-sm">
                    {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white/80 hidden md:block">{user?.full_name || user?.email?.split('@')[0]}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#022c22] border border-gold/20 rounded-lg shadow-xl overflow-hidden z-50">
                    <button
                      onClick={() => { setShowProfile(true); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <UserIcon size={14} /> Profile
                    </button>
                    <button
                      onClick={() => { navigate('/app/settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Settings size={14} /> Settings
                    </button>
                    <div className="border-t border-white/10" />
                    <button
                      onClick={() => { signOut(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="btn btn-primary text-sm">
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}
