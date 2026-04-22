export default function CheckoutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#111827] p-10 rounded-2xl max-w-md w-full text-white">
        <h2 className="text-2xl font-bold mb-6">
          Demo Checkout
        </h2>
        <button
          onClick={onClose}
          className="bg-red-600 px-6 py-3 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
}
