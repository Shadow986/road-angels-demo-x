import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PaystackButton({ navigateTo }) {
  const [msg, setMsg] = useState(null); // { type, text }

  const pay = async () => {
    setMsg(null);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigateTo('auth'); return; }
    const user = session.user;

    if (!window.PaystackPop) {
      setMsg({ type: 'error', text: 'Payment system still loading, please try again.' });
      return;
    }

    window.PaystackPop.setup({
      key: 'pk_test_104e8ada8c71f280a5bb45f3e98528da9de96965',
      email: user.email,
      amount: 19500,
      currency: 'ZAR',
      metadata: { userId: user.id },
      callback: (transaction) => {
        supabase.functions.invoke('verify-payment', {
          body: { reference: transaction.reference, userId: user.id }
        }).then(() => {
          setMsg({ type: 'success', text: 'Payment successful! You are now an active member.' });
        }).catch(() => {
          setMsg({ type: 'error', text: 'Payment received but verification failed. Contact support with ref: ' + transaction.reference });
        });
      },
      onClose: () => {},
    }).openIframe();
  };

  return (
    <>
      {msg && (
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
      <button
        onClick={pay}
        style={{
          position: 'fixed', bottom: 24, right: 90, zIndex: 9999,
          background: '#00c853', color: '#fff', border: 'none',
          padding: '14px 28px', fontWeight: 900, fontSize: 13,
          cursor: 'pointer', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        Subscribe R195/m
      </button>
    </>
  );
}
