import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, FileEdit as Edit, Ban } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import type { User } from '../../types';

export function AdminPanel() {
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'super_admin') {
      navigate('/app');
      return;
    }
    loadUsers();
  }, [isAuthenticated, currentUser?.role]);

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
    if (!error) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as User['role'] } : u)));
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    const { error } = await supabase.from('users').update({ is_active: !isActive }).eq('id', userId);
    if (!error) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: !isActive } : u)));
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || (u.full_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!isAuthenticated || (currentUser?.role !== 'admin' && currentUser?.role !== 'super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-xl p-12 text-center">
          <Shield size={48} className="text-red-400/30 mx-auto mb-4" />
          <h3 className="font-cinzel text-xl font-bold text-white mb-2">Access Denied</h3>
          <p className="text-white/40">You need admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-gold">Admin Panel</h2>
            <p className="text-sm text-white/40">User management and system administration</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-lg px-3 py-2 flex items-center gap-2">
              <Search size={14} className="text-white/30" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="text-sm bg-transparent border-none p-0 w-48" />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="text-sm w-32">
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>

        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10">
                  <th className="text-left p-4 text-xs text-gold/70 uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-xs text-gold/70 uppercase tracking-wider">Email</th>
                  <th className="text-left p-4 text-xs text-gold/70 uppercase tracking-wider">Role</th>
                  <th className="text-left p-4 text-xs text-gold/70 uppercase tracking-wider">Organization</th>
                  <th className="text-left p-4 text-xs text-gold/70 uppercase tracking-wider">Regions</th>
                  <th className="text-left p-4 text-xs text-gold/70 uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-xs text-gold/70 uppercase tracking-wider">Joined</th>
                  <th className="text-left p-4 text-xs text-gold/70 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs">{(u.full_name || u.email).charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="text-sm font-medium text-white">{u.full_name || 'Unnamed'}</div>
                          <div className="text-xs text-white/30">{u.job_title || 'No title'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/60 text-xs">{u.email}</td>
                    <td className="p-4">
                      <span className={`badge badge-${u.role === 'super_admin' ? 'critical' : u.role === 'admin' ? 'high' : 'medium'}`}>{u.role}</span>
                    </td>
                    <td className="p-4 text-white/60 text-xs">{u.organization || '-'}</td>
                    <td className="p-4 text-white/60 text-xs">{u.assigned_regions?.join(', ') || '-'}</td>
                    <td className="p-4">
                      <span className={`badge badge-${u.is_active ? 'high' : 'critical'}`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="p-4 text-white/40 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => setEditingUser(u)} className="p-1.5 rounded hover:bg-white/10 text-white/30 hover:text-gold transition-colors"><Edit size={14} /></button>
                        <button onClick={() => handleToggleActive(u.id, u.is_active)} className="p-1.5 rounded hover:bg-white/10 text-white/30 hover:text-yellow-400 transition-colors"><Ban size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-white/20 text-sm">No users found matching your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit user modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditingUser(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl border border-gold/20 bg-gradient-to-b from-[#022c22] to-[#011a12] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-cinzel text-lg font-bold text-gold mb-4">Edit User</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gold/70 mb-1">Role</label>
                <select value={editingUser.role} onChange={(e) => handleUpdateRole(editingUser.id, e.target.value)} className="text-sm">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gold/70 mb-1">Organization</label>
                <input defaultValue={editingUser.organization || ''} placeholder="Organization" />
              </div>
              <div>
                <label className="block text-xs text-gold/70 mb-1">Assigned Regions</label>
                <input defaultValue={editingUser.assigned_regions?.join(', ') || ''} placeholder="Comma-separated regions" />
              </div>
              <button onClick={() => setEditingUser(null)} className="btn btn-primary w-full">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
