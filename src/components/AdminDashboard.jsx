import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Car, CreditCard, Settings, ScrollText, LayoutDashboard,
  LogOut, Search, CheckCircle, AlertCircle, Loader2, X, Edit3,
  Trash2, ShieldCheck, TrendingUp, DollarSign, Calendar, Filter,
  Phone, Mail, MapPin, Save, Star, Eye, ChevronLeft, Image as ImageIcon,
  UserPlus, Shield, Lock
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// ─── Helpers ─────────────────────────────────────────────────
const logAction = async (action, table, id, details) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action,
      target_table: table,
      target_id: id,
      details: details ? JSON.stringify(details) : null,
    });
  } catch (e) { /* non-blocking */ }
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtDateTime = (d) => d ? new Date(d).toLocaleString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const fmtMoney = (n) => `R${Number(n || 0).toFixed(2)}`;

// ─── Shared Modal ────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, children, wide }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <div className={`bg-white border border-black/10 w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
          <X size={20} />
        </button>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-black mb-6 border-b border-black/5 pb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// ─── Stat Card ───────────────────────────────────────────────
const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
  <div className="bg-white border border-black/10 p-6 rounded-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 border border-black/10 text-black">
        <Icon size={18} />
      </div>
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-2xl font-black italic uppercase text-black">{value}</div>
    <div className="text-[9px] text-gray-400 uppercase tracking-tighter mt-1">{subtext}</div>
  </div>
);

// ─── Sidebar ─────────────────────────────────────────────────
const navItems = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { id: 'members',   label: 'Members',   icon: Users },
  { id: 'vehicles',  label: 'Vehicles',  icon: Car },
  { id: 'payments',  label: 'Payments',  icon: CreditCard },
  { id: 'settings',  label: 'Settings',   icon: Settings },
  { id: 'admins',    label: 'Admins',     icon: UserPlus },
  { id: 'logs',      label: 'Audit Logs', icon: ScrollText },
];

const Sidebar = ({ active, setActive, onLogout }) => (
  <aside className="w-full lg:w-64 bg-black text-white flex flex-col min-h-screen sticky top-0">
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center gap-3">
        <img src="/Logo.png" alt="" className="w-8 h-8 object-contain" />
        <div>
          <div className="text-[12px] font-black italic uppercase tracking-tighter leading-none">Road <span className="text-[var(--color-halo-silver)]">Angels</span></div>
          <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Admin Console</div>
        </div>
      </div>
    </div>
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${
              active === item.id
                ? 'bg-[var(--color-halo-silver)] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={16} />
            {item.label}
          </button>
        );
      })}
    </nav>
    <div className="p-4 border-t border-white/10">
      <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-sm">
        <LogOut size={16} />
        Logout
      </button>
    </div>
  </aside>
);

// ─── Overview Tab ────────────────────────────────────────────
function OverviewTab({ stats, recentMembers, recentPayments }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-black mb-1">Dashboard <span className="text-[var(--color-halo-silver)]">Overview</span></h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Real-time platform metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Members" value={stats.total} subtext={`${stats.active} active · ${stats.pending} pending`} icon={Users} />
        <StatCard label="Revenue (Month)" value={fmtMoney(stats.revenue)} subtext={`${stats.active} × R195`} icon={DollarSign} />
        <StatCard label="Vehicles" value={stats.vehicles} subtext="Registered fleet" icon={Car} />
        <StatCard label="Transactions" value={stats.transactions} subtext={`${stats.successPayments} successful`} icon={CreditCard} />
      </div>

      {/* Two-column: recent members + recent payments */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
          <div className="p-4 border-b border-black/10 bg-gray-50 flex items-center gap-2">
            <TrendingUp size={14} className="text-[var(--color-halo-silver)]" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Recent Members</h3>
          </div>
          <div className="divide-y divide-black/5">
            {recentMembers.length === 0 ? (
              <p className="p-6 text-[10px] text-gray-400 uppercase tracking-widest text-center">No members yet</p>
            ) : recentMembers.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="text-[11px] font-bold text-black uppercase">{m.full_name || 'Unknown'}</div>
                  <div className="text-[9px] text-gray-400">{m.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  {m.is_active_member
                    ? <CheckCircle size={12} className="text-green-500" />
                    : <AlertCircle size={12} className="text-orange-500" />}
                  <span className="text-[9px] font-bold uppercase text-gray-500">{fmtDate(m.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
          <div className="p-4 border-b border-black/10 bg-gray-50 flex items-center gap-2">
            <CreditCard size={14} className="text-[var(--color-halo-silver)]" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Recent Payments</h3>
          </div>
          <div className="divide-y divide-black/5">
            {recentPayments.length === 0 ? (
              <p className="p-6 text-[10px] text-gray-400 uppercase tracking-widest text-center">No payments yet</p>
            ) : recentPayments.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="text-[11px] font-bold text-black">{p.email}</div>
                  <div className="text-[9px] text-gray-400 font-mono">{p.reference}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-black text-black">{fmtMoney(p.amount)}</div>
                  <div className={`text-[9px] font-bold uppercase ${p.status === 'success' ? 'text-green-500' : 'text-orange-500'}`}>{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Members Tab ─────────────────────────────────────────────
function MembersTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | pending
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*, vehicles(id, make, model, plate, image_url, is_verified)')
      .order('created_at', { ascending: false });
    if (data) setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleSave = async (userId, updates) => {
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (!error) {
      await logAction('update_member', 'profiles', userId, updates);
      setSelectedUser(null);
      await fetchMembers();
    }
    setIsSaving(false);
  };

  const toggleActive = async (userId, current) => {
    const { error } = await supabase.from('profiles').update({ is_active_member: !current }).eq('id', userId);
    if (!error) {
      await logAction('toggle_member_active', 'profiles', userId, { from: current, to: !current });
      await fetchMembers();
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) {
      await logAction('change_role', 'profiles', userId, { from: currentRole, to: newRole });
      await fetchMembers();
    }
  };

  const handleDelete = async (userId) => {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (!error) {
      await logAction('delete_member', 'profiles', userId);
      setConfirmDelete(null);
      await fetchMembers();
    }
  };

  const filtered = members.filter(m => {
    const matchesSearch = !search ||
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && m.is_active_member) ||
      (filter === 'pending' && !m.is_active_member);
    return matchesSearch && matchesFilter;
  });

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-black mb-1">Member <span className="text-[var(--color-halo-silver)]">Management</span></h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{members.length} registered members</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-white border border-black/10 pl-10 pr-4 py-3 text-[11px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${
                filter === f
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-400 border-black/10 hover:border-black/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-black/10 rounded-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/10 text-[9px] uppercase font-black tracking-widest text-gray-400 bg-gray-50">
              <th className="p-4">Member</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Tier</th>
              <th className="p-4">Vehicles</th>
              <th className="p-4">Status</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="text-[11px] font-black text-black uppercase">{u.full_name || 'Unknown'}</div>
                  <div className="text-[9px] text-gray-400">{fmtDate(u.created_at)}</div>
                </td>
                <td className="p-4">
                  <div className="text-[10px] text-gray-600">{u.email}</div>
                  <div className="text-[9px] text-gray-400">{u.phone || '—'}</div>
                </td>
                <td className="p-4">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 border border-black/10 text-black">
                    {u.membership_rank || 'Bronze'}
                  </span>
                </td>
                <td className="p-4 text-[11px] font-mono text-gray-500">{u.vehicles?.length || 0}</td>
                <td className="p-4">
                  <button onClick={() => toggleActive(u.id, u.is_active_member)} className="flex items-center gap-1.5">
                    {u.is_active_member
                      ? <CheckCircle size={12} className="text-green-500" />
                      : <AlertCircle size={12} className="text-orange-500" />}
                    <span className="text-[9px] font-bold text-black uppercase">{u.is_active_member ? 'Active' : 'Pending'}</span>
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => toggleRole(u.id, u.role)} className="flex items-center gap-1.5">
                    {u.role === 'admin'
                      ? <ShieldCheck size={12} className="text-[var(--color-halo-silver)]" />
                      : <Users size={12} className="text-gray-400" />}
                    <span className="text-[9px] font-bold uppercase text-gray-500">{u.role || 'user'}</span>
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setViewUser(u)} className="p-1.5 text-gray-400 hover:text-black transition-all" title="View">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => setSelectedUser(u)} className="p-1.5 text-gray-400 hover:text-black transition-all" title="Edit">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => setConfirmDelete(u)} className="p-1.5 text-gray-400 hover:text-red-500 transition-all" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-[10px] text-gray-400 uppercase tracking-widest text-center">No members found</p>
        )}
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <EditMemberModal
          user={selectedUser}
          isSaving={isSaving}
          onClose={() => setSelectedUser(null)}
          onSave={handleSave}
        />
      )}

      {/* View Modal */}
      {viewUser && <ViewMemberModal user={viewUser} onClose={() => setViewUser(null)} />}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <Modal isOpen={true} onClose={() => setConfirmDelete(null)} title="Confirm Deletion">
          <div className="space-y-6">
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-black text-black uppercase">{confirmDelete.full_name || confirmDelete.email}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 border border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="flex-1 py-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const EditMemberModal = ({ user, isSaving, onClose, onSave }) => {
  const [form, setForm] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    phone: user.phone || '',
    surname: user.surname || '',
    id_passport: user.id_passport || '',
    car_make: user.car_make || '',
    address: user.address || '',
    membership_rank: user.membership_rank || 'Bronze',
    is_active_member: user.is_active_member || false,
    role: user.role || 'user',
  });

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Member" wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" value={form.full_name} onChange={v => setForm({ ...form, full_name: v })} />
          <Field label="Surname" value={form.surname} onChange={v => setForm({ ...form, surname: v })} />
          <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          <Field label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
          <Field label="ID / Passport" value={form.id_passport} onChange={v => setForm({ ...form, id_passport: v })} />
          <Field label="Car Make" value={form.car_make} onChange={v => setForm({ ...form, car_make: v })} />
        </div>
        <Field label="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} />

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-black/5">
          <SelectField label="Membership Tier" value={form.membership_rank} onChange={v => setForm({ ...form, membership_rank: v })}
            options={[{ v: 'Bronze', l: 'Bronze' }, { v: 'Sentinel', l: 'Sentinel' }, { v: 'Vanguard', l: 'Vanguard' }, { v: 'Elite', l: 'Elite' }, { v: 'Gold', l: 'Gold' }, { v: 'Silver', l: 'Silver' }]} />
          <SelectField label="Role" value={form.role} onChange={v => setForm({ ...form, role: v })}
            options={[{ v: 'user', l: 'User' }, { v: 'admin', l: 'Admin' }]} />
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Active Member</label>
            <button
              onClick={() => setForm({ ...form, is_active_member: !form.is_active_member })}
              className={`w-full py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                form.is_active_member
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-gray-50 text-gray-400 border-black/10'
              }`}
            >
              {form.is_active_member ? '✓ Active' : '✗ Inactive'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="flex-1 py-3 border border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button
            disabled={isSaving}
            onClick={() => onSave(user.id, form)}
            className="flex-1 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-halo-silver)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save</>}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const ViewMemberModal = ({ user, onClose }) => (
  <Modal isOpen={true} onClose={onClose} title="Member Details" wide>
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-6">
        <DetailRow icon={Users} label="Full Name" value={user.full_name} />
        <DetailRow icon={Users} label="Surname" value={user.surname} />
        <DetailRow icon={Mail} label="Email" value={user.email} />
        <DetailRow icon={Phone} label="Phone" value={user.phone} />
        <DetailRow icon={CreditCard} label="ID / Passport" value={user.id_passport} />
        <DetailRow icon={Car} label="Car Make" value={user.car_make} />
      </div>
      <DetailRow icon={MapPin} label="Address" value={user.address} />

      {/* Status */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-black/5">
        <div className="p-4 bg-gray-50 border border-black/5">
          <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2">Tier</div>
          <div className="text-[12px] font-black text-black uppercase">{user.membership_rank || 'Bronze'}</div>
        </div>
        <div className="p-4 bg-gray-50 border border-black/5">
          <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2">Role</div>
          <div className="text-[12px] font-black text-black uppercase">{user.role || 'user'}</div>
        </div>
        <div className="p-4 bg-gray-50 border border-black/5">
          <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2">Status</div>
          <div className={`text-[12px] font-black uppercase ${user.is_active_member ? 'text-green-600' : 'text-orange-500'}`}>
            {user.is_active_member ? 'Active' : 'Pending'}
          </div>
        </div>
      </div>

      {/* Vehicles */}
      {user.vehicles && user.vehicles.length > 0 && (
        <div className="pt-4 border-t border-black/5">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-4">Registered Vehicles ({user.vehicles.length})</h4>
          <div className="grid grid-cols-2 gap-3">
            {user.vehicles.map(v => (
              <div key={v.id} className="p-3 bg-gray-50 border border-black/5 flex gap-3">
                {v.image_url ? (
                  <img src={v.image_url} alt={v.model} className="w-16 h-16 object-cover border border-black/10" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 border border-black/10 flex items-center justify-center">
                    <Car size={20} className="text-gray-300" />
                  </div>
                )}
                <div>
                  <div className="text-[10px] font-black text-black uppercase">{v.make} {v.model}</div>
                  <div className="text-[9px] text-gray-400 font-mono">{v.plate}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {v.is_verified
                      ? <CheckCircle size={10} className="text-green-500" />
                      : <AlertCircle size={10} className="text-orange-500" />}
                    <span className="text-[8px] font-bold uppercase text-gray-400">{v.is_verified ? 'Verified' : 'Unverified'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[9px] text-gray-400 uppercase tracking-widest pt-4 border-t border-black/5">
        Joined: {fmtDateTime(user.created_at)}
      </div>
    </div>
  </Modal>
);

// ─── Vehicles Tab ────────────────────────────────────────────
function VehiclesTab() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('vehicles')
      .select('*, profiles!inner(full_name, email)')
      .order('created_at', { ascending: false });
    if (data) setVehicles(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const toggleVerify = async (id, current) => {
    const { error } = await supabase.from('vehicles').update({ is_verified: !current }).eq('id', id);
    if (!error) {
      await logAction('toggle_vehicle_verify', 'vehicles', id, { from: current, to: !current });
      await fetchVehicles();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (!error) {
      await logAction('delete_vehicle', 'vehicles', id);
      setConfirmDelete(null);
      await fetchVehicles();
    }
  };

  const filtered = vehicles.filter(v =>
    !search ||
    v.make?.toLowerCase().includes(search.toLowerCase()) ||
    v.model?.toLowerCase().includes(search.toLowerCase()) ||
    v.plate?.toLowerCase().includes(search.toLowerCase()) ||
    v.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-black mb-1">Vehicle <span className="text-[var(--color-halo-silver)]">Registry</span></h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{vehicles.length} registered vehicles</p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by make, model, plate, or owner..."
          className="w-full bg-white border border-black/10 pl-10 pr-4 py-3 text-[11px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
        />
      </div>

      {/* Vehicle Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <div key={v.id} className="bg-white border border-black/10 overflow-hidden group hover:border-[var(--color-halo-silver)]/30 transition-all">
            {v.image_url ? (
              <img src={v.image_url} alt={`${v.make} ${v.model}`} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gray-50 flex items-center justify-center">
                <Car size={40} className="text-gray-200" />
              </div>
            )}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] font-black text-black uppercase">{v.make} {v.model}</div>
                  <div className="text-[9px] text-gray-400 font-mono tracking-widest">{v.plate}</div>
                </div>
                <button
                  onClick={() => toggleVerify(v.id, v.is_verified)}
                  className={`flex items-center gap-1 px-2 py-1 border transition-all ${
                    v.is_verified
                      ? 'bg-green-50 border-green-200 text-green-600'
                      : 'bg-orange-50 border-orange-200 text-orange-500'
                  }`}
                >
                  {v.is_verified ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                  <span className="text-[8px] font-black uppercase">{v.is_verified ? 'Verified' : 'Pending'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-black/5">
                <Users size={10} className="text-gray-400" />
                <span className="text-[9px] text-gray-500 uppercase font-bold">{v.profiles?.full_name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-black/5">
                <span className="text-[8px] text-gray-400 uppercase">{fmtDate(v.created_at)}</span>
                <button onClick={() => setConfirmDelete(v)} className="p-1 text-gray-300 hover:text-red-500 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="p-8 text-[10px] text-gray-400 uppercase tracking-widest text-center bg-white border border-black/10 rounded-sm">No vehicles found</p>
      )}

      {confirmDelete && (
        <Modal isOpen={true} onClose={() => setConfirmDelete(null)} title="Delete Vehicle">
          <div className="space-y-6">
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Delete <span className="font-black text-black uppercase">{confirmDelete.make} {confirmDelete.model}</span> ({confirmDelete.plate})? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 border border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="flex-1 py-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Payments Tab ────────────────────────────────────────────
function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | success | pending | failed
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('payments')
      .select('*, profiles!left(full_name, email)')
      .order('created_at', { ascending: false });
    if (data) setPayments(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleDelete = async (id) => {
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (!error) {
      await logAction('delete_payment', 'payments', id);
      setConfirmDelete(null);
      await fetchPayments();
    }
  };

  const totalRevenue = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + Number(p.amount), 0);
  const successCount = payments.filter(p => p.status === 'success').length;

  const filtered = payments.filter(p => {
    const matchesSearch = !search ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.reference?.toLowerCase().includes(search.toLowerCase()) ||
      p.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-black mb-1">Payment <span className="text-[var(--color-halo-silver)]">Records</span></h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{payments.length} transactions · {fmtMoney(totalRevenue)} total revenue</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-black/10 px-4 py-3">
            <div className="text-[8px] text-gray-400 uppercase tracking-widest font-black">Revenue</div>
            <div className="text-[14px] font-black text-black">{fmtMoney(totalRevenue)}</div>
          </div>
          <div className="bg-white border border-black/10 px-4 py-3">
            <div className="text-[8px] text-gray-400 uppercase tracking-widest font-black">Success</div>
            <div className="text-[14px] font-black text-green-600">{successCount}</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, reference, or member..."
            className="w-full bg-white border border-black/10 pl-10 pr-4 py-3 text-[11px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'success', 'pending', 'failed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${
                filter === f
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-400 border-black/10 hover:border-black/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-black/10 rounded-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/10 text-[9px] uppercase font-black tracking-widest text-gray-400 bg-gray-50">
              <th className="p-4">Reference</th>
              <th className="p-4">Member</th>
              <th className="p-4">Email</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-[10px] font-mono text-gray-500">{p.reference}</td>
                <td className="p-4 text-[11px] font-black text-black uppercase">{p.profiles?.full_name || '—'}</td>
                <td className="p-4 text-[10px] text-gray-600">{p.email}</td>
                <td className="p-4 text-[11px] font-black text-black">{fmtMoney(p.amount)}</td>
                <td className="p-4">
                  <span className={`text-[9px] font-black uppercase px-2 py-1 border ${
                    p.status === 'success' ? 'bg-green-50 border-green-200 text-green-600'
                    : p.status === 'pending' ? 'bg-orange-50 border-orange-200 text-orange-500'
                    : 'bg-red-50 border-red-200 text-red-500'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-[9px] text-gray-400">{fmtDateTime(p.created_at)}</td>
                <td className="p-4 text-right">
                  <button onClick={() => setConfirmDelete(p)} className="p-1.5 text-gray-400 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-[10px] text-gray-400 uppercase tracking-widest text-center">No payments found</p>
        )}
      </div>

      {confirmDelete && (
        <Modal isOpen={true} onClose={() => setConfirmDelete(null)} title="Delete Payment Record">
          <div className="space-y-6">
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Delete payment <span className="font-mono font-bold text-black">{confirmDelete.reference}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 border border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="flex-1 py-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────
function SettingsTab() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*').order('key');
    if (data) setSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMsg(null);
    let errors = 0;
    for (const s of settings) {
      const { error } = await supabase.from('site_settings').update({ value: s.value }).eq('id', s.id);
      if (error) errors++;
    }
    if (errors === 0) {
      await logAction('update_settings', 'site_settings', null, { count: settings.length });
      setSaveMsg({ type: 'success', text: 'Settings saved successfully.' });
    } else {
      setSaveMsg({ type: 'error', text: `${errors} setting(s) failed to save.` });
    }
    setIsSaving(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-black mb-1">Site <span className="text-[var(--color-halo-silver)]">Settings</span></h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Configure platform-wide values</p>
      </div>

      {saveMsg && (
        <div className={`p-3 text-[10px] font-bold uppercase tracking-wide border ${
          saveMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {saveMsg.text}
        </div>
      )}

      <div className="bg-white border border-black/10 rounded-sm divide-y divide-black/5">
        {settings.map((s) => (
          <div key={s.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-64">
              <div className="text-[11px] font-black text-black uppercase">{s.label || s.key}</div>
              {s.description && <div className="text-[9px] text-gray-400 mt-1">{s.description}</div>}
            </div>
            <input
              type="text"
              value={s.value || ''}
              onChange={(e) => setSettings(settings.map(item => item.id === s.id ? { ...item, value: e.target.value } : item))}
              className="flex-1 bg-gray-50 border border-black/10 p-3 text-[11px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
              placeholder={`Enter ${s.label || s.key}`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-halo-silver)] transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save All Settings</>}
      </button>
    </div>
  );
}

// ─── Admins Tab ──────────────────────────────────────────────
function AdminsTab() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [confirmDemote, setConfirmDemote] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Add admin form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });
    if (data) setAdmins(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      // 1. Create the auth user via Supabase signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
          },
        },
      });

      if ( signUpError) throw signUpError;

      const newUserId = signUpData.user?.id;

      if (!newUserId) {
        throw new Error('User created but no ID returned. Check if email confirmation is required.');
      }

      // 2. Set their role to 'admin' in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: newUserId,
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          role: 'admin',
          is_active_member: true,
        });

      if (profileError) {
        // User was created in auth but profile insert failed
        setFeedback({
          type: 'warning',
          text: `Auth user created but profile update failed: ${profileError.message}. Run the SQL from docs/credentials.md to set the role manually.`,
        });
      } else {
        await logAction('add_admin', 'profiles', newUserId, { email: formData.email });
        setFeedback({ type: 'success', text: `Admin account created for ${formData.email}. They may need to confirm their email before logging in.` });
        setShowAddForm(false);
        setFormData({ email: '', password: '', fullName: '', phone: '' });
        await fetchAdmins();
      }
    } catch (err) {
      const msg = err.message || 'Failed to create admin.';
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')) {
        setFeedback({ type: 'error', text: 'A user with this email already exists.' });
      } else {
        setFeedback({ type: 'error', text: msg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemote = async (userId) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'user' })
      .eq('id', userId);
    if (!error) {
      await logAction('demote_admin', 'profiles', userId, { from: 'admin', to: 'user' });
      setConfirmDemote(null);
      await fetchAdmins();
    } else {
      setFeedback({ type: 'error', text: `Failed to demote: ${error.message}` });
    }
  };

  const isSelf = (userId) => userId === currentUserId;

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-black mb-1">Admin <span className="text-[var(--color-halo-silver)]">Management</span></h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{admins.length} admin accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-halo-silver)] transition-all"
        >
          <UserPlus size={14} />
          Add Admin
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`p-4 text-[10px] font-bold uppercase tracking-wide border ${
          feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-700'
          : feedback.type === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-700'
          : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {feedback.text}
          <button onClick={() => setFeedback(null)} className="float-right"><X size={12} /></button>
        </div>
      )}

      {/* Add Admin Form Modal */}
      {showAddForm && (
        <Modal isOpen={true} onClose={() => setShowAddForm(false)} title="Add New Admin">
          <form onSubmit={handleAddAdmin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 border border-black/10 p-4 text-[12px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
                placeholder="newadmin@roadangelsrsa.co.za"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                <Lock size={12} /> Temporary Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-50 border border-black/10 p-4 text-[12px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
                placeholder="Minimum 8 characters"
              />
              <p className="text-[9px] text-gray-400">The new admin can change this after first login.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-gray-50 border border-black/10 p-4 text-[12px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Phone (Optional)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-black/10 p-4 text-[12px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
                  placeholder="+27 00 000 0000"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-black/5">
              <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 border border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-halo-silver)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><Shield size={14} /> Create Admin</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Admins Table */}
      <div className="bg-white border border-black/10 rounded-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/10 text-[9px] uppercase font-black tracking-widest text-gray-400 bg-gray-50">
              <th className="p-4">Admin</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Added</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {admins.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 border border-black/10 bg-gray-50">
                      <ShieldCheck size={14} className="text-[var(--color-halo-silver)]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-black uppercase">{a.full_name || 'Unknown'}</div>
                      {isSelf(a.id) && <span className="text-[8px] font-black uppercase text-[var(--color-halo-silver)] tracking-widest">You</span>}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-[10px] text-gray-600">{a.phone || '—'}</div>
                  <div className="text-[9px] text-gray-400">See auth.users for email</div>
                </td>
                <td className="p-4 text-[9px] text-gray-400">{fmtDate(a.created_at)}</td>
                <td className="p-4">
                  {a.is_active_member
                    ? <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-green-600"><CheckCircle size={10} /> Active</span>
                    : <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-orange-500"><AlertCircle size={10} /> Inactive</span>}
                </td>
                <td className="p-4 text-right">
                  {isSelf(a.id) ? (
                    <span className="text-[9px] font-bold uppercase text-gray-300">Current Session</span>
                  ) : (
                    <button
                      onClick={() => setConfirmDemote(a)}
                      className="px-3 py-2 text-[9px] font-black uppercase tracking-widest border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                    >
                      Demote to User
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {admins.length === 0 && (
          <p className="p-8 text-[10px] text-gray-400 uppercase tracking-widest text-center">No admins found</p>
        )}
      </div>

      {/* Demote Confirmation */}
      {confirmDemote && (
        <Modal isOpen={true} onClose={() => setConfirmDemote(null)} title="Demote Admin">
          <div className="space-y-6">
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Remove admin privileges from <span className="font-black text-black uppercase">{confirmDemote.full_name || confirmDemote.email}</span>? They will be downgraded to a regular user and lose access to this console.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDemote(null)} className="flex-1 py-3 border border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDemote(confirmDemote.id)} className="flex-1 py-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                Demote
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Audit Logs Tab ──────────────────────────────────────────
function LogsTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('admin_logs')
      .select('*, profiles!left(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(200);
    if (data) setLogs(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter(l =>
    !search ||
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.target_table?.toLowerCase().includes(search.toLowerCase()) ||
    l.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-black mb-1">Audit <span className="text-[var(--color-halo-silver)]">Logs</span></h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{logs.length} recent admin actions</p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by action, table, or admin..."
          className="w-full bg-white border border-black/10 pl-10 pr-4 py-3 text-[11px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/10 text-[9px] uppercase font-black tracking-widest text-gray-400 bg-gray-50">
              <th className="p-4">Action</th>
              <th className="p-4">Admin</th>
              <th className="p-4">Target</th>
              <th className="p-4">Table</th>
              <th className="p-4">Details</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="text-[10px] font-black text-black uppercase">{l.action?.replace(/_/g, ' ')}</span>
                </td>
                <td className="p-4 text-[10px] text-gray-600">{l.profiles?.full_name || 'System'}</td>
                <td className="p-4 text-[9px] font-mono text-gray-400">{l.target_id ? l.target_id.slice(0, 8) + '…' : '—'}</td>
                <td className="p-4 text-[10px] text-gray-500 uppercase">{l.target_table || '—'}</td>
                <td className="p-4 text-[9px] text-gray-400 font-mono max-w-xs truncate">{l.details || '—'}</td>
                <td className="p-4 text-[9px] text-gray-400">{fmtDateTime(l.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-[10px] text-gray-400 uppercase tracking-widest text-center">No logs found</p>
        )}
      </div>
    </div>
  );
}

// ─── Small Reusable Components ───────────────────────────────
const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="text-[var(--color-halo-silver)] animate-spin" size={32} />
  </div>
);

const Field = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-black/10 p-3 text-[11px] text-black focus:outline-none focus:border-[var(--color-halo-silver)]"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{label}</label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-black/10 p-3 text-[11px] text-black focus:outline-none focus:border-[var(--color-halo-silver)] appearance-none cursor-pointer"
    >
      {options.map(o => <option key={o.v} value={o.v} className="bg-white">{o.l}</option>)}
    </select>
  </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <Icon size={12} className="text-gray-400" />
      <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{label}</span>
    </div>
    <div className="text-[11px] text-black font-bold pl-5">{value || '—'}</div>
  </div>
);

// ─── Main AdminDashboard ─────────────────────────────────────
export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, revenue: 0, vehicles: 0, transactions: 0, successPayments: 0 });
  const [recentMembers, setRecentMembers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  async function fetchOverviewData() {
    setLoading(true);
    try {
      const [{ data: profiles }, { data: vehicles }, { data: payments }] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('vehicles').select('id'),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
      ]);

      const activeCount = profiles?.filter(p => p.is_active_member).length || 0;
      const successPays = payments?.filter(p => p.status === 'success') || [];

      setStats({
        total: profiles?.length || 0,
        active: activeCount,
        pending: (profiles?.length || 0) - activeCount,
        revenue: successPays.reduce((sum, p) => sum + Number(p.amount), 0),
        vehicles: vehicles?.length || 0,
        transactions: payments?.length || 0,
        successPayments: successPays.length,
      });
      setRecentMembers((profiles || []).slice(0, 5));
      setRecentPayments((payments || []).slice(0, 5));
    } catch (e) {
      console.error('Overview load error:', e);
    }
    setLoading(false);
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab stats={stats} recentMembers={recentMembers} recentPayments={recentPayments} />;
      case 'members':  return <MembersTab />;
      case 'vehicles': return <VehiclesTab />;
      case 'payments': return <PaymentsTab />;
      case 'settings': return <SettingsTab />;
      case 'admins':   return <AdminsTab />;
      case 'logs':     return <LogsTab />;
      default:          return <OverviewTab stats={stats} recentMembers={recentMembers} recentPayments={recentPayments} />;
    }
  };

  if (loading && activeTab === 'overview') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="text-[var(--color-halo-silver)] animate-spin" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - hidden on mobile, replaced by horizontal nav */}
      <div className="hidden lg:block">
        <Sidebar active={activeTab} setActive={setActiveTab} onLogout={onLogout} />
      </div>

      {/* Mobile top nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="" className="w-6 h-6 object-contain" />
          <span className="text-[10px] font-black italic uppercase tracking-tighter text-white">Admin</span>
        </div>
        <button onClick={onLogout} className="text-red-400"><LogOut size={18} /></button>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile tab bar */}
        <div className="lg:hidden flex gap-1 overflow-x-auto bg-black px-2 pt-14 pb-2 sticky top-0 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[9px] font-black uppercase tracking-widest whitespace-nowrap rounded-sm transition-all ${
                  activeTab === item.id ? 'bg-[var(--color-halo-silver)] text-white' : 'text-gray-400'
                }`}
              >
                <Icon size={12} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
