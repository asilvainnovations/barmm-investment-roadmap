import { useState } from 'react';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useStrategicPlanStore } from '../../stores/strategicPlanStore';

export function Topbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { isOnline, syncStatus } = useStrategicPlanStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-16 bg-[#022c22]/95 backdrop-blur-xl border-b border-gold/20 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-[#022c22] font-cinzel font-bold text-sm">B</div>
        <span className="font-cinzel font-bold text-gold text-sm tracking-wide hidden sm:block">BIRD 2026-2035</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Online/Sync Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-500'}`} />
          <span className="text-xs text-white/50 hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          <div className={`w-1.5 h-1.5 rounded-full ${
            syncStatus === 'synced' ? 'bg-green-400' :
            syncStatus === 'pending' ? 'bg-yellow-400' :
            syncStatus === 'syncing' ? 'bg-blue-400 animate-pulse' :
            'bg-gray-500'
          }`} />
          <span className="text-xs text-white/40 capitalize">{syncStatus}</span>
        </div>

        {isAuthenticated ? (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={14} className="text-white/40" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#022c22] border border-gold/20 rounded-lg shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-white font-medium">{user?.full_name || user?.email}</p>
                  <p className="text-xs text-white/40">{user?.email}</p>
                </div>
                <button onClick={() => { signOut(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10 transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
