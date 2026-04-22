export default function CheckoutModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white border border-black/10 p-10 rounded-2xl max-w-md w-full text-black shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Demo Checkout</h2>
        <button onClick={onClose} className="bg-red-600 text-white px-6 py-3 rounded-md">Close</button>
      </div>
    </div>
  );
}
