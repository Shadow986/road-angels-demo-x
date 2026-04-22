import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MoreVertical, CheckCircle, 
  AlertCircle, LogOut, Settings, ShieldAlert, Loader2, Download, X, Edit3
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// --- Edit Modal Component ---
const UserEditModal = ({ isOpen, onClose, user, onSave, isSaving }) => {
  const [rank, setRank] = useState(user?.membership_rank || 'Aspirant');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-black/10 w-full max-w-md p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
          <X size={20} />
        </button>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-black mb-2">Modify Security Clearance</h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-8">Member: {user?.full_name}</p>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">Assigned Bond Tier</label>
            <select 
              className="w-full bg-gray-50 border border-black/10 p-4 text-[10px] font-bold text-black uppercase tracking-widest outline-none focus:border-[var(--color-halo-silver)] appearance-none cursor-pointer"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            >
              <option value="Aspirant" className="bg-white">Aspirant (Base)</option>
              <option value="Sentinel" className="bg-white">Sentinel (Tier 2)</option>
              <option value="Vanguard" className="bg-white">Vanguard (Tier 3)</option>
              <option value="Elite" className="bg-white">Elite (Tier 4)</option>
            </select>
          </div>

          <button 
            disabled={isSaving}
            onClick={() => onSave(user.id, rank)}
            className="w-full py-4 bg-[var(--color-halo-silver)] text-white font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSaving ? "Updating Clearance..." : "Confirm Tier Upgrade"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard({ onLogout }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0 });
  
  // Edit State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    setLoading(true);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*, vehicles(id)')
      .order('created_at', { ascending: false });

    if (profiles) {
      setMembers(profiles);
      setStats({
        total: profiles.length,
        pending: profiles.filter(p => !p.is_active_member).length,
        revenue: profiles.filter(p => p.is_active_member).length * 195
      });
    }
    setLoading(false);
  }

  const handleUpdateRank = async (userId, newRank) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ membership_rank: newRank })
      .eq('id', userId);
    
    if (!error) {
      setSelectedUser(null);
      await fetchAdminData();
    }
    setIsSaving(false);
  };

  const toggleVerification = async (userId, currentStatus) => {
    await supabase.from('profiles').update({ is_active_member: !currentStatus }).eq('id', userId);
    fetchAdminData();
  };

  const filteredMembers = members.filter(m => 
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="text-[var(--color-halo-silver)] animate-spin" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-8 md:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-black">
            Admin <span className="text-[var(--color-halo-silver)]">Console</span>
          </h1>
          <button onClick={onLogout} className="group flex items-center gap-3 px-5 py-3 border border-black/10 text-gray-400 hover:text-black transition-all">
            <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
            <LogOut size={16} />
          </button>
        </div>

        {/* User Table */}
        <div className="bg-gray-50 border border-black/10 rounded-sm">
          <div className="p-6 border-b border-black/10 flex gap-4 bg-gray-100/50">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH ASSETS OR MEMBERS..." 
              className="flex-1 bg-white border border-black/10 py-3 px-4 text-[11px] text-black focus:outline-none focus:border-[var(--color-halo-silver)] uppercase font-bold tracking-widest"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/10 text-[10px] uppercase font-black tracking-widest text-gray-400">
                  <th className="p-6">Member</th>
                  <th className="p-6">Bond Tier</th>
                  <th className="p-6">Assets</th>
                  <th className="p-6">Verification</th>
                  <th className="p-6 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredMembers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-6">
                      <div className="text-[12px] font-black text-black uppercase italic">{u.full_name}</div>
                      <div className="text-[9px] text-gray-400 uppercase">{u.email}</div>
                    </td>
                    <td className="p-6">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 border border-black/10 text-black">
                        {u.membership_rank || 'Aspirant'}
                      </span>
                    </td>
                    <td className="p-6 text-[12px] font-mono text-gray-500">{u.vehicles?.length || 0}</td>
                    <td className="p-6">
                      <button onClick={() => toggleVerification(u.id, u.is_active_member)} className="flex items-center gap-2">
                        {u.is_active_member ? <CheckCircle size={12} className="text-green-500"/> : <AlertCircle size={12} className="text-orange-500"/>}
                        <span className="text-[10px] font-bold text-black uppercase">{u.is_active_member ? 'Active' : 'Pending'}</span>
                      </button>
                    </td>
                    <td className="p-6 text-right">
                      <button onClick={() => setSelectedUser(u)} className="p-2 text-gray-400 hover:text-black transition-all">
                        <Edit3 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Dynamic Modals --- */}
        <UserEditModal 
          isOpen={!!selectedUser} 
          user={selectedUser} 
          isSaving={isSaving}
          onClose={() => setSelectedUser(null)}
          onSave={handleUpdateRank}
        />

      </div>
    </div>
  );
}
