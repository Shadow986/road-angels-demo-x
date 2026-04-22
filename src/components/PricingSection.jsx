export default function PricingSection({ openModal }) {
  return (
    <section className="bg-black py-28 text-white text-center px-8">

      <h2 className="text-4xl font-bold mb-6">
        Join The Protection Plan
      </h2>

      <div className="max-w-xl mx-auto bg-[#111827] p-10 rounded-2xl">
        <p className="text-5xl font-bold text-red-600 mb-6">
          R169 <span className="text-lg text-gray-400">/ month</span>
        </p>

        <button
          onClick={openModal}
          className="bg-red-600 px-8 py-4 rounded-md text-lg"
        >
          Protect My Vehicle
        </button>
      </div>

    </section>
  );
}
