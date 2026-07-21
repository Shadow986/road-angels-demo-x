import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function PaystackButton({ navigateTo }) {
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const openModal = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigateTo('auth'); return; }
    setMsg(null);
    setDetails({ name: '', phone: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.name.trim() || !details.phone.trim()) return;
    setLoading(true);
    setMsg(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigateTo('auth'); return; }
    const user = session.user;

    if (!window.PaystackPop) {
      setMsg({ type: 'error', text: 'Payment system still loading, please try again.' });
      setLoading(false);
      return;
    }

    setShowModal(false);

    window.PaystackPop.setup({
      key: 'pk_test_104e8ada8c71f280a5bb45f3e98528da9de96965',
      email: user.email,
      amount: 100, // R1 test
      currency: 'ZAR',
      metadata: { userId: user.id, name: details.name, phone: details.phone },
      callback: (transaction) => {
        supabase.functions.invoke('verify-payment', {
          body: { reference: transaction.reference, userId: user.id }
        }).then(() => {
          setMsg({ type: 'success', text: 'Payment successful! You are now an active member.' });
        }).catch(() => {
          setMsg({ type: 'error', text: 'Payment received but verification failed. Ref: ' + transaction.reference });
        });
        setLoading(false);
      },
      onClose: () => setLoading(false),
    }).openIframe();
  };

  return (
    <>
      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-black/10 w-full max-w-md p-8 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-black mb-2 border-b border-black/5 pb-4">
              Confirm Your Details
            </h2>
            <p className="text-[9px] uppercase text-gray-400 tracking-widest leading-relaxed mb-6">
              We need these details before processing your R1 test subscription.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">Full Name</label>
                <input
                  required
                  className="w-full bg-gray-50 border border-black/10 p-4 text-sm text-black focus:border-gray-400 outline-none transition-colors"
                  placeholder="e.g. Sipho Dlamini"
                  value={details.name}
                  onChange={e => setDetails({ ...details, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">Phone Number</label>
                <input
                  required
                  type="tel"
                  className="w-full bg-gray-50 border border-black/10 p-4 text-sm text-black focus:border-gray-400 outline-none transition-colors"
                  placeholder="e.g. 0712345678"
                  value={details.phone}
                  onChange={e => setDetails({ ...details, phone: e.target.value })}
                />
              </div>
              <div className="flex justify-between text-[10px] uppercase text-gray-400 pt-2 border-t border-black/5">
                <span>Amount Due</span>
                <span className="text-black font-black">R1.00 (Test)</span>
              </div>
              {msg && (
                <div className={`p-3 text-[10px] font-bold uppercase tracking-wide border ${msg.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                  {msg.text}
                </div>
              )}
              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:opacity-80 transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating success/error toast */}
      {msg && !showModal && (
        <div style={{
          position: 'fixed', bottom: 80, right: 24, zIndex: 10000,
          padding: '12px 20px', borderRadius: 4, fontSize: 12, fontWeight: 700,
          background: msg.type === 'success' ? '#e6f9ed' : '#fff0f0',
          color: msg.type === 'success' ? '#2e7d32' : '#c62828',
          border: `1px solid ${msg.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`,
          maxWidth: 320,
        }}>
          {msg.text}
          <button onClick={() => setMsg(null)} style={{ marginLeft: 12, fontWeight: 900, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
        </div>
      )}

      {/* Floating Subscribe Button */}
      <button
        onClick={openModal}
        style={{
          position: 'fixed', bottom: 24, right: 90, zIndex: 9999,
          background: '#00c853', color: '#fff', border: 'none',
          padding: '14px 28px', fontWeight: 900, fontSize: 13,
          cursor: 'pointer', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        Subscribe R1 (Test)
      </button>
    </>
  );
}
