import { supabase } from "../lib/supabaseClient";

export default function PaystackButton({ navigateTo }) {
  const pay = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigateTo('auth'); return; }
    const user = session.user;

    if (!window.PaystackPop) {
      alert('Payment system still loading, please try again.');
      return;
    }

    if (!window.PaystackPop.isInitialized) {
      window.PaystackPop.initialize();
    }

    const onSuccess = async (transaction) => {
      await supabase.functions.invoke('verify-payment', {
        body: { reference: transaction.reference, userId: user.id }
      });
      alert('Payment successful! You are now an active member.');
    };

    const onClose = () => {};

    window.PaystackPop.setup({
      key: 'pk_test_8c87b22a1c5730e895731bc18a3decaddd56b148',
      email: user.email,
      amount: 19500,
      currency: 'ZAR',
      metadata: { userId: user.id },
      callback: onSuccess,
      onClose: onClose,
    }).openIframe();
  };

  return (
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
  );
}
