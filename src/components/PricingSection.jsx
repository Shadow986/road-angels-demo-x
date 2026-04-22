export default function PricingSection({ openModal }) {
  return (
    <section className="bg-white py-28 text-black text-center px-8 border-t border-black/5">
      <h2 className="text-4xl font-bold mb-6">Join The Protection Plan</h2>
      <div className="max-w-xl mx-auto bg-gray-50 border border-black/10 p-10 rounded-2xl">
        <p className="text-5xl font-bold text-[var(--color-vag-blue)] mb-6">
          R169 <span className="text-lg text-gray-400">/ month</span>
        </p>
        <button onClick={openModal} className="bg-[var(--color-vag-blue)] text-white px-8 py-4 rounded-md text-lg hover:brightness-125 transition-all">
          Protect My Vehicle
        </button>
      </div>
    </section>
  );
}
