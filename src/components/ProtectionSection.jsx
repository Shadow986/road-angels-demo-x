export default function ProtectionSection() {
  return (
    <section className="bg-[#0b0f14] text-white py-28 px-8 text-center">

      <h2 className="text-4xl font-bold mb-6">
        Avoid R60,000 DSG Failures
      </h2>

      <p className="text-gray-400 max-w-3xl mx-auto mb-16">
        Prevent catastrophic gearbox damage with maintenance,
        progressive discounts, and priority support.
      </p>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div className="bg-[#111827] p-10 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Month 4</h3>
          <p>FREE DSG Maintenance & Software Update</p>
        </div>

        <div className="bg-[#111827] p-10 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Month 12</h3>
          <p>30% Discount on Services</p>
        </div>

        <div className="bg-[#111827] p-10 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Month 24</h3>
          <p>50% Overhaul + Roadside Assistance</p>
        </div>
      </div>

    </section>
  );
}
