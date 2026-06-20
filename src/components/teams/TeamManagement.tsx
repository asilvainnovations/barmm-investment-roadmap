import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, X, Mail, Shield, UserPlus, Settings, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import type { Organization, OrganizationMember } from '../../types';

export function TeamManagement() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [activeOrg, setActiveOrg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      const { data } = await supabase.from('organizations').select('*').eq('created_by', user?.id);
      if (data) setOrganizations(data);
    })();
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!activeOrg) return;
    (async () => {
      const { data } = await supabase.from('organization_members').select('*').eq('organization_id', activeOrg);
      if (data) setMembers(data);
    })();
  }, [activeOrg]);

  const handleCreateOrg = async () => {
    if (!orgName || !orgSlug) return;
    setLoading(true);
    const { data, error } = await supabase.from('organizations').insert({
      name: orgName,
      slug: orgSlug,
      created_by: user?.id,
    }).select().single();
    if (error) {
      alert(error.message);
    } else if (data) {
      setOrganizations((prev) => [...prev, data]);
      setShowCreateOrg(false);
      setOrgName('');
      setOrgSlug('');
    }
    setLoading(false);
  };

  const handleInvite = async () => {
    if (!activeOrg || !inviteEmail) return;
    setLoading(true);
    const { data: userData } = await supabase.from('users').select('id').eq('email', inviteEmail).maybeSingle();
    if (!userData) {
      alert('User not found');
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('organization_members').insert({
      organization_id: activeOrg,
      user_id: userData.id,
      role: inviteRole,
    });
    if (error) alert(error.message);
    else {
      setShowInvite(false);
      setInviteEmail('');
      setInviteRole('member');
      const { data } = await supabase.from('organization_members').select('*').eq('organization_id', activeOrg);
      if (data) setMembers(data);
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Users size={48} className="text-gold/30 mx-auto mb-4" />
        <h3 className="font-cinzel text-xl font-bold text-white mb-2">Sign In Required</h3>
        <p className="text-white/40 mb-6">Please sign in to manage teams and organizations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-gold">Team Management</h2>
          <p className="text-sm text-white/40">Organizations, members, and sharing settings</p>
        </div>
        <button onClick={() => setShowCreateOrg(true)} className="btn btn-primary text-sm">
          <Plus size={14} /> Create Organization
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organizations list */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-cinzel text-sm font-bold text-gold/70 uppercase tracking-wider">Your Organizations</h3>
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => setActiveOrg(org.id)}
              className={`w-full text-left glass rounded-lg p-4 transition-colors ${activeOrg === org.id ? 'border-gold/40 bg-gold/5' : ''}`}
            >
              <div className="font-medium text-sm text-white">{org.name}</div>
              <div className="text-xs text-white/40">{org.slug}</div>
            </button>
          ))}
          {organizations.length === 0 && (
            <div className="text-center py-8 text-white/20 text-sm">No organizations yet. Create one to start collaborating.</div>
          )}
        </div>

        {/* Members list */}
        <div className="lg:col-span-2">
          {activeOrg ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cinzel text-sm font-bold text-gold/70 uppercase tracking-wider">Members</h3>
                <button onClick={() => setShowInvite(true)} className="btn btn-primary text-sm px-3 py-1.5">
                  <UserPlus size={14} /> Invite
                </button>
              </div>
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="glass rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold">M</div>
                      <div>
                        <div className="text-sm text-white">{m.user_id}</div>
                        <span className={`badge badge-${m.role === 'admin' ? 'critical' : m.role === 'editor' ? 'high' : 'medium'} text-xs`}>{m.role}</span>
                      </div>
                    </div>
                    <div className="text-xs text-white/30">{new Date(m.joined_at).toLocaleDateString()}</div>
                  </div>
                ))}
                {members.length === 0 && (
                  <div className="text-center py-8 text-white/20 text-sm">No members yet. Invite team members to collaborate.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <Users size={32} className="text-gold/30 mx-auto mb-2" />
              <p className="text-white/40 text-sm">Select an organization to view and manage members.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create org modal */}
      {showCreateOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateOrg(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl border border-gold/20 bg-gradient-to-b from-[#022c22] to-[#011a12] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-cinzel text-lg font-bold text-gold mb-4">Create Organization</h3>
            <div className="space-y-3">
              <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Organization Name" />
              <input value={orgSlug} onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="URL slug (e.g. my-org)" />
              <button onClick={handleCreateOrg} disabled={loading} className="btn btn-primary w-full">
                {loading ? <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <><Plus size={14} /> Create</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl border border-gold/20 bg-gradient-to-b from-[#022c22] to-[#011a12] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-cinzel text-lg font-bold text-gold mb-4">Invite Member</h3>
            <div className="space-y-3">
              <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Member email" />
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                <option value="member">Member</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={handleInvite} disabled={loading} className="btn btn-primary w-full">
                {loading ? <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <><UserPlus size={14} /> Send Invite</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
