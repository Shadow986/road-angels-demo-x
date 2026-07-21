import React, { useState, useEffect } from 'react';
import { 
  Car, Settings, CreditCard, LogOut, MessageSquare, 
  Award, Calendar, ChevronRight, ShieldCheck, Loader2, X, Plus, Clock, Home
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Calculate badge tier based on number of confirmed payments
function getBadgeFromMonths(months) {
  if (months >= 24) return { name: 'Gold', color: 'text-yellow-500' };
  if (months >= 12) return { name: 'Silver', color: 'text-gray-400' };
  if (months >= 4)  return { name: 'Bronze', color: 'text-orange-400' };
  return { name: 'Aspirant', color: 'text-gray-500' };
}

function getNextBadgeInfo(months) {
  if (months >= 24) return 'Gold — Max Tier Reached';
  if (months >= 12) return `Next: Gold at 24 Months`;
  if (months >= 4)  return `Next: Silver at 12 Months`;
  return `Next: Bronze at 4 Months`;
}

const StatCard = ({ label, value, icon: Icon, subtext, loading, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-gray-50 border border-black/5 p-6 rounded-sm transition-all
      ${onClick ? 'cursor-pointer hover:border-[var(--color-halo-silver)]/40 hover:shadow-md hover:bg-white' : ''}`}
  >
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
    {onClick && (
      <div className="text-[8px] text-[var(--color-halo-silver)] uppercase tracking-widest mt-2 font-black">Tap to view →</div>
    )}
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

export default function UserDashboard({ onLogout, navigateTo }) {
  const [profile, setProfile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({ make: '', model: '', plate: '', imageFile: null });
  const [profileForm, setProfileForm] = useState({ full_name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Payment detail form state (collected before Paystack opens)
  const [paymentDetails, setPaymentDetails] = useState({ name: '', phone: '' });
  const [payLoading, setPayLoading] = useState(false);
  const [payMsg, setPayMsg] = useState(null);

  useEffect(() => { fetchDashboardData(); }, []);

  async function fetchDashboardData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        const { data: vehs } = await supabase.from('vehicles').select('*').eq('user_id', user.id);
        const { data: pays } = await supabase
          .from('payments')
          .select('id, amount, reference, created_at, status')
          .eq('user_id', user.id)
          .eq('status', 'success')
          .order('created_at', { ascending: false });
        setProfile(prof);
        setProfileForm({ full_name: prof?.full_name || '' });
        if (vehs) setVehicles(vehs);
        if (pays) setPayments(pays);
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
    let image_url = null;
    if (vehicleForm.imageFile) {
      const ext = vehicleForm.imageFile.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('car-images').upload(path, vehicleForm.imageFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('car-images').getPublicUrl(path);
        image_url = data.publicUrl;
      }
    }
    const { error } = await supabase.from('vehicles').insert([{ make: vehicleForm.make, model: vehicleForm.model, plate: vehicleForm.plate, image_url, user_id: user.id }]);
    if (!error) { setVehicleForm({ make: '', model: '', plate: '', imageFile: null }); setActiveModal(null); await fetchDashboardData(); }
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
    window.open(`https://wa.me/27604807393?text=${message}`, '_blank');
  };

  // Opens Paystack after collecting user details in our modal
  const handlePayNow = async (e) => {
    e.preventDefault();
    if (!paymentDetails.name.trim() || !paymentDetails.phone.trim()) return;
    setPayLoading(true);
    setPayMsg(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigateTo('auth'); return; }
      const PaystackPop = window.PaystackPop;
      if (!PaystackPop) {
        setPayMsg({ type: 'error', text: 'Payment system not loaded. Refresh and try again.' });
        setPayLoading(false);
        return;
      }
      setActiveModal(null); // close details modal
      const handler = PaystackPop.setup({
        key: 'pk_test_104e8ada8c71f280a5bb45f3e98528da9de96965',
        email: user.email,
        amount: 19500,
        currency: 'ZAR',
        metadata: {
          userId: user.id,
          name: paymentDetails.name,
          phone: paymentDetails.phone,
        },
        callback: async (transaction) => {
          try {
            const { error } = await supabase.functions.invoke('verify-payment', {
              body: { reference: transaction.reference, userId: user.id }
            });
            if (error) throw error;
            await fetchDashboardData();
            setPayMsg({ type: 'success', text: 'Payment successful! Your membership is now active.' });
            setActiveModal('sub');
          } catch (err) {
            setPayMsg({ type: 'error', text: 'Payment received but verification failed. Ref: ' + transaction.reference });
          }
        },
        onClose: () => setPayLoading(false),
      });
      handler.openIframe();
    } catch (err) {
      setPayMsg({ type: 'error', text: 'Could not start payment: ' + err.message });
      setPayLoading(false);
    }
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
            <button onClick={() => navigateTo('home')} className="px-6 py-3 border border-black/10 text-black text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
              <Home size={14} /> Home
            </button>
            <button onClick={requestConsultation} className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-halo-silver)] transition-all flex items-center gap-2">
              <MessageSquare size={14} /> Request Consultation
            </button>
            <button onClick={onLogout} className="p-3 border border-black/10 text-gray-400 hover:text-black transition-all hover:bg-gray-50">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {(() => {
            const monthsPaid = payments.length;
            const badge = getBadgeFromMonths(monthsPaid);
            const nextBadge = getNextBadgeInfo(monthsPaid);
            return (
              <>
                <StatCard
                  label="Current Badge"
                  value={<span className={badge.color}>{badge.name}</span>}
                  icon={Award}
                  subtext={profile?.is_active_member ? "Active Member Status" : "Pending Verification"}
                  loading={loading}
                  onClick={() => setActiveModal('sub')}
                />
                <StatCard
                  label="Loyalty"
                  value={`${monthsPaid} Month${monthsPaid !== 1 ? 's' : ''}`}
                  icon={Calendar}
                  subtext={nextBadge}
                  loading={loading}
                  onClick={() => setActiveModal('history')}
                />
                <StatCard
                  label="Coverage"
                  value={vehicles.length}
                  icon={Car}
                  subtext="Active Fleet"
                  loading={loading}
                  onClick={() => setActiveModal('vehicle')}
                />
                <StatCard
                  label="Payment"
                  value={profile?.is_active_member ? "R195.00" : "R0.00"}
                  icon={CreditCard}
                  subtext={profile?.is_active_member ? "Monthly Subscription" : "No Active Plan"}
                  loading={loading}
                  onClick={() => setActiveModal('sub')}
                />
              </>
            );
          })()}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-black flex items-center gap-3">
              <Car size={16} className="text-[var(--color-halo-silver)]" /> Managed Vehicles
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {vehicles.map((car, i) => (
              <div key={car.id || i} className="bg-gray-50 border border-black/5 group hover:border-[var(--color-halo-silver)]/30 transition-all cursor-default overflow-hidden">
                  {car.image_url && <img src={car.image_url} alt={car.model} className="w-full h-32 object-cover" />}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold text-[var(--color-halo-silver)] uppercase tracking-widest">{car.make}</span>
                      <ShieldCheck size={14} className={car.is_verified ? "text-green-500" : "text-gray-300"} />
                    </div>
                    <div className="text-xl font-black italic uppercase text-black mb-1">{car.model}</div>
                    <div className="text-[12px] font-mono text-gray-400 tracking-widest">{car.plate}</div>
                  </div>
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
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">Car Image (optional)</label>
              <input type="file" accept="image/*" className="w-full bg-gray-50 border border-black/10 p-3 text-sm text-black outline-none file:mr-4 file:py-1 file:px-3 file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-black file:text-white cursor-pointer"
                onChange={e => setVehicleForm({...vehicleForm, imageFile: e.target.files[0]})} />
            </div>
            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-[var(--color-halo-silver)] text-white font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">
              {isSubmitting ? "Processing..." : "Submit Registration"}
            </button>
          </form>
        </Modal>

        <Modal isOpen={activeModal === 'history'} onClose={() => setActiveModal(null)} title="Transaction History">
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {payments.length === 0 ? (
              <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest mt-4">No payments found</p>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 border border-black/5">
                  <div className="flex items-center gap-3">
                    <Clock size={14} className="text-gray-400" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-black">Monthly Subscription</div>
                      <div className="text-[9px] text-gray-400 font-mono mt-0.5">{new Date(p.created_at).toLocaleDateString('en-ZA')}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-gray-400">R{(p.amount / 100).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </Modal>

        <Modal isOpen={activeModal === 'sub'} onClose={() => setActiveModal(null)} title="Membership Management">
          <div className="space-y-6">
            {payMsg && (
              <div className={`p-3 text-[10px] font-bold uppercase tracking-wide border ${payMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {payMsg.text}
              </div>
            )}
            <div className="p-6 bg-[var(--color-halo-silver)]/5 border border-[var(--color-halo-silver)]/20">
              <div className="text-[9px] text-[var(--color-halo-silver)] uppercase font-black mb-1">Current Badge</div>
              <div className={`text-xl font-black italic uppercase tracking-tighter ${getBadgeFromMonths(payments.length).color}`}>
                {getBadgeFromMonths(payments.length).name} Road Angel
              </div>
              <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">
                {payments.length} month{payments.length !== 1 ? 's' : ''} paid · {getNextBadgeInfo(payments.length)}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase text-gray-400">
                <span>Status</span>
                <span className={profile?.is_active_member ? 'text-green-600 font-black' : 'text-red-500 font-black'}>
                  {profile?.is_active_member ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between text-[10px] uppercase text-gray-400">
                <span>Monthly Fee</span><span className="text-black">R195.00</span>
              </div>
            </div>
            {!profile?.is_active_member && (
              <button
                onClick={() => { setActiveModal('paydetails'); setPayMsg(null); }}
                className="w-full py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-halo-silver)] transition-all"
              >
                Activate Membership — R195/m
              </button>
            )}
            <button onClick={requestConsultation} className="w-full py-3 border border-black/10 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all">Change Plan</button>
          </div>
        </Modal>

        {/* Payment Details Modal — collects name + phone before Paystack */}
        <Modal isOpen={activeModal === 'paydetails'} onClose={() => setActiveModal(null)} title="Payment Details">
          <form onSubmit={handlePayNow} className="space-y-5">
            <p className="text-[9px] uppercase text-gray-400 tracking-widest leading-relaxed">
              Please confirm your details before proceeding to payment.
            </p>
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">Full Name</label>
              <input
                required
                className="w-full bg-gray-50 border border-black/10 p-4 text-sm text-black focus:border-[var(--color-halo-silver)] outline-none transition-colors"
                placeholder="e.g. Sipho Dlamini"
                value={paymentDetails.name}
                onChange={e => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">Phone Number</label>
              <input
                required
                type="tel"
                className="w-full bg-gray-50 border border-black/10 p-4 text-sm text-black focus:border-[var(--color-halo-silver)] outline-none transition-colors"
                placeholder="e.g. 0712345678"
                value={paymentDetails.phone}
                onChange={e => setPaymentDetails({ ...paymentDetails, phone: e.target.value })}
              />
            </div>
            <div className="flex justify-between text-[10px] uppercase text-gray-400 pt-2 border-t border-black/5">
              <span>Amount Due</span><span className="text-black font-black">R195.00 / month</span>
            </div>
            {payMsg && (
              <div className={`p-3 text-[10px] font-bold uppercase tracking-wide border ${payMsg.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                {payMsg.text}
              </div>
            )}
            <button
              disabled={payLoading}
              type="submit"
              className="w-full py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-[var(--color-halo-silver)] transition-all disabled:opacity-50"
            >
              {payLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
