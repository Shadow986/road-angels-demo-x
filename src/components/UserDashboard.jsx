import React, { useState, useEffect } from 'react';
import { 
  Car, Settings, CreditCard, LogOut, MessageSquare, 
  Award, Calendar, ChevronRight, ShieldCheck, Loader2, X, Plus, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const StatCard = ({ label, value, icon: Icon, subtext, loading }) => (
  <div className="bg-gray-50 border border-black/5 p-6 rounded-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-[var(--color-halo-silver)]/10 text-[var(--color-halo-silver)]">
        <Icon size={18} />
      </div>
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
    {loading ? (
      <div className="h-8 w-24 bg-black/5 animate-pulse rounded-sm" />
    ) : (
      <div className="text-2xl font-black italic uppercase text-black">{value}</div>
    )}
    <div className="text-[9px] text-gray-400 uppercase tracking-tighter mt-1">{subtext}</div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-black/10 w-full max-w-lg p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
          <X size={20} />
        </button>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-black mb-6 border-b border-black/5 pb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default function UserDashboard({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({ make: '', model: '', plate: '' });
  const [profileForm, setProfileForm] = useState({ full_name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  async function fetchDashboardData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        const { data: vehs } = await supabase.from('vehicles').select('*').eq('user_id', user.id);
        setProfile(prof);
        setProfileForm({ full_name: prof?.full_name || '' });
        if (vehs) setVehicles(vehs);
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('vehicles').insert([{ ...vehicleForm, user_id: user.id }]);
    if (!error) { setVehicleForm({ make: '', model: '', plate: '' }); setActiveModal(null); await fetchDashboardData(); }
    setIsSubmitting(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('profiles').update({ full_name: profileForm.full_name }).eq('id', user.id);
    if (!error) { setActiveModal(null); await fetchDashboardData(); }
    setIsSubmitting(false);
  };

  const requestConsultation = () => {
    const message = encodeURIComponent(`Hello Road Angels Team, I am ${profile?.full_name}. I would like to request a consultation regarding my membership.`);
    window.open(`https://wa.me/27123456789?text=${message}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-[var(--color-halo-silver)] animate-spin" size={40} />
      <span className="text-[10px] text-gray-400 uppercase tracking-widest animate-pulse">Initializing Portal...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-8 md:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-black">
              Member <span className="text-[var(--color-halo-silver)]">Portal</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">
                {profile?.full_name || "Authorized User"} // Security Cleared
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={requestConsultation} className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-halo-silver)] transition-all flex items-center gap-2">
              <MessageSquare size={14} /> Request Consultation
            </button>
            <button onClick={onLogout} className="p-3 border border-black/10 text-gray-400 hover:text-black transition-all hover:bg-gray-50">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          <StatCard label="Current Badge" value={profile?.membership_rank || 'Aspirant'} icon={Award} subtext={profile?.is_active_member ? "Active Member Status" : "Pending Verification"} />
          <StatCard label="Loyalty" value="1 Month" icon={Calendar} subtext="Next Badge: 6 Months" />
          <StatCard label="Coverage" value={vehicles.length} icon={Car} subtext="Active Fleet" />
          <StatCard label="Payment" value={profile?.is_active_member ? "R195.00" : "R0.00"} icon={CreditCard} subtext="Monthly Subscription" />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-black flex items-center gap-3">
              <Car size={16} className="text-[var(--color-halo-silver)]" /> Managed Vehicles
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {vehicles.map((car, i) => (
                <div key={car.id || i} className="bg-gray-50 border border-black/5 p-6 group hover:border-[var(--color-halo-silver)]/30 transition-all cursor-default">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-[var(--color-halo-silver)] uppercase tracking-widest">{car.make}</span>
                    <ShieldCheck size={14} className={car.is_verified ? "text-green-500" : "text-gray-300"} />
                  </div>
                  <div className="text-xl font-black italic uppercase text-black mb-1">{car.model}</div>
                  <div className="text-[12px] font-mono text-gray-400 tracking-widest">{car.plate}</div>
                </div>
              ))}
              <button onClick={() => setActiveModal('vehicle')} className="border-2 border-dashed border-black/10 p-6 flex flex-col items-center justify-center text-gray-300 hover:text-black hover:border-black/20 transition-all min-h-[140px] group">
                <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Add Vehicle</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-black flex items-center gap-3">
              <Settings size={16} className="text-[var(--color-halo-silver)]" /> Account Settings
            </h3>
            <div className="bg-gray-50 border border-black/5 p-8 space-y-6">
              {[{ id: 'profile', label: 'Update Profile' }, { id: 'sub', label: 'Manage Subscription' }, { id: 'history', label: 'Payment History' }].map(action => (
                <button key={action.id} onClick={() => setActiveModal(action.id)} className="w-full text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex justify-between items-center group transition-colors">
                  {action.label} <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
                </button>
              ))}
              <button className="w-full text-left text-[10px] font-bold uppercase tracking-widest text-red-400 flex justify-between items-center pt-6 border-t border-black/5 hover:text-red-600 transition-colors">
                Cancel Membership
              </button>
            </div>
          </div>
        </div>

        <Modal isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} title="Profile Settings">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">Display Name</label>
              <input required className="w-full bg-gray-50 border border-black/10 p-4 text-sm text-black focus:border-[var(--color-halo-silver)] outline-none transition-colors" value={profileForm.full_name} onChange={e => setProfileForm({full_name: e.target.value})} />
            </div>
            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-[var(--color-halo-silver)] transition-all">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </Modal>

        <Modal isOpen={activeModal === 'vehicle'} onClose={() => setActiveModal(null)} title="Register New Vehicle">
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <input required className="w-full bg-gray-50 border border-black/10 p-4 text-sm text-black focus:border-[var(--color-halo-silver)] outline-none" placeholder="Make (e.g. BMW)" value={vehicleForm.make} onChange={e => setVehicleForm({...vehicleForm, make: e.target.value})} />
            <input required className="w-full bg-gray-50 border border-black/10 p-4 text-sm text-black focus:border-[var(--color-halo-silver)] outline-none" placeholder="Model (e.g. M3 Competition)" value={vehicleForm.model} onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})} />
            <input required className="w-full bg-gray-50 border border-black/10 p-4 text-sm text-black focus:border-[var(--color-halo-silver)] outline-none" placeholder="Registration Number" value={vehicleForm.plate} onChange={e => setVehicleForm({...vehicleForm, plate: e.target.value})} />
            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-[var(--color-halo-silver)] text-white font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">
              {isSubmitting ? "Processing..." : "Submit Registration"}
            </button>
          </form>
        </Modal>

        <Modal isOpen={activeModal === 'history'} onClose={() => setActiveModal(null)} title="Transaction History">
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-black/5">
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-gray-400" />
                <div className="text-[10px] uppercase font-bold text-black">Monthly Subscription</div>
              </div>
              <div className="text-[10px] font-mono text-gray-400">R195.00</div>
            </div>
            <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest mt-4">No older transactions found</p>
          </div>
        </Modal>

        <Modal isOpen={activeModal === 'sub'} onClose={() => setActiveModal(null)} title="Membership Management">
          <div className="space-y-6">
            <div className="p-6 bg-[var(--color-halo-silver)]/5 border border-[var(--color-halo-silver)]/20">
              <div className="text-[9px] text-[var(--color-halo-silver)] uppercase font-black mb-1">Active Plan</div>
              <div className="text-xl font-black text-black italic uppercase tracking-tighter">Standard Road Angel</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase text-gray-400"><span>Renewal Date</span><span className="text-black">01 April 2026</span></div>
              <div className="flex justify-between text-[10px] uppercase text-gray-400"><span>Payment Method</span><span className="text-black">Debit Order (Netcash)</span></div>
            </div>
            <button onClick={requestConsultation} className="w-full py-3 border border-black/10 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all">Change Plan</button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
