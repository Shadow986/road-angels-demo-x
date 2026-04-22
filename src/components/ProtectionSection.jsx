export default function ProtectionSection() {
  return (
    <section className="bg-gray-50 text-black py-28 px-8 text-center border-t border-black/5">
      <h2 className="text-4xl font-bold mb-6">Avoid R60,000 DSG Failures</h2>
      <p className="text-gray-500 max-w-3xl mx-auto mb-16">
        Prevent catastrophic gearbox damage with maintenance, progressive discounts, and priority support.
      </p>
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div className="bg-white border border-black/10 p-10 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Month 4</h3>
          <p className="text-gray-500">FREE DSG Maintenance & Software Update</p>
        </div>
        <div className="bg-white border border-black/10 p-10 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Month 12</h3>
          <p className="text-gray-500">30% Discount on Services</p>
        </div>
        <div className="bg-white border border-black/10 p-10 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Month 24</h3>
          <p className="text-gray-500">50% Overhaul + Roadside Assistance</p>
        </div>
      </div>
    </section>
  );
}
