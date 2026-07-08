import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Search, HelpCircle, X, Loader2 } from "lucide-react";

export default function DiagnosticTerminal() {
  const [mode, setMode] = useState("code");
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", car: "", issue: "", faultCode: "" });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const msg = encodeURIComponent(
      `*Diagnostic Assistance Request*\n\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Vehicle: ${formData.car}\n` +
      `Fault Code: ${formData.faultCode || "None"}\n` +
      `Issue / Symptoms: ${formData.issue}`
    );
    window.open(`https://wa.me/27604807393?text=${msg}`, "_blank");
    setSubmitting(false);
    setShowForm(false);
    setFormData({ name: "", phone: "", car: "", issue: "", faultCode: "" });
  };

  const inputClass = "w-full bg-gray-50 border border-black/10 p-4 text-[13px] text-black focus:outline-none focus:border-[var(--color-halo-silver)] transition-all rounded-sm placeholder:text-gray-400";

  const faultDatabase = {
    "P17BF": { symptom: "Hydraulic Pump Play Protection", feeling: "Car suddenly loses drive; flashing spanner icon.", fix: "Reinforced Accumulator Housing + Calibration." },
    "P0805": { symptom: "Clutch Position Sensor Circuit", feeling: "Jerky gear changes; car gets stuck in 2nd or 4th gear.", fix: "TCM Board-Level Micro-Surgery." },
  };

  const symptoms = [
    { title: "No Drive / Flashing Icon", likely: "P17BF", desc: "Common in DQ200 units (Golf/Polo)." },
    { title: "Jerky Shifting / Limp Mode", likely: "P0805", desc: "Common in DL501/DQ500 (Audi/Tiguan)." },
    { title: "Stuck in 'P' or 'N'", likely: "P1735", desc: "Sensor array failure inside the unit." }
  ];

  return (
    <section className="py-24 bg-gray-50 px-8 md:px-20 border-t border-black/5 relative">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-black/10 p-8 rounded-sm shadow-sm">
            <div className="flex bg-gray-100 p-1 rounded-sm mb-8">
              <button 
                onClick={() => { setMode("code"); setResult(null); }}
                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${mode === "code" ? "bg-[var(--color-halo-silver)] text-white" : "text-gray-400 hover:text-black"}`}
              >
                I have a Fault Code
              </button>
              <button 
                onClick={() => { setMode("symptom"); setResult(null); }}
                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${mode === "symptom" ? "bg-[var(--color-halo-silver)] text-white" : "text-gray-400 hover:text-black"}`}
              >
                I only have Symptoms
              </button>
            </div>

            {mode === "code" ? (
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type="text" 
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setResult(faultDatabase[val] || (val.length > 3 ? "not_found" : null));
                    }}
                    placeholder="ENTER CODE (e.g. P17BF)"
                    className="w-full bg-gray-50 border border-black/10 p-5 text-black font-mono uppercase outline-none focus:border-[var(--color-halo-silver)]"
                  />
                  <Search className="absolute right-5 top-5 text-gray-400" size={18} />
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {symptoms.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setResult(faultDatabase[s.likely])}
                    className="text-left p-4 border border-black/5 bg-gray-50 hover:border-[var(--color-halo-silver)]/50 transition-all group"
                  >
                    <p className="text-[10px] font-black text-black uppercase mb-1 group-hover:text-[var(--color-halo-silver)]">{s.title}</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-tighter">{s.desc}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-black/5 min-h-[140px]">
              <AnimatePresence mode="wait">
                {result && result !== "not_found" ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center gap-2 text-[var(--color-halo-silver)]">
                      <Activity size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Engineering Report:</span>
                    </div>
                    <p className="text-black text-sm font-bold uppercase italic">{result.symptom}</p>
                    <div className="p-4 bg-[var(--color-halo-silver)]/5 border-l-2 border-[var(--color-halo-silver)] text-[10px] text-gray-500 uppercase leading-relaxed">
                      <span className="text-black font-black">THE FIX:</span> {result.fix}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-20 py-8">
                    <HelpCircle size={32} className="mb-2" />
                    <p className="text-[9px] uppercase tracking-[0.2em]">Select an option above to decode failure</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-10">
          <h2 className="text-5xl font-black italic uppercase leading-[0.85] tracking-tighter text-black">
            Identify <br /><span className="text-[var(--color-halo-silver)]">The Failure.</span>
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-[var(--color-halo-silver)] flex items-center justify-center text-[var(--color-halo-silver)] font-black text-xs shrink-0">1</div>
              <div>
                <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Check your dashboard</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Is there a flashing spanner or a "Gearbox Error" message?</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-[var(--color-halo-silver)] flex items-center justify-center text-[var(--color-halo-silver)] font-black text-xs shrink-0">2</div>
              <div>
                <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Book a Mobile Scan</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">No code? Our team can come to your location in Gauteng to perform a specialist VAG scan.</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="w-full py-6 bg-[var(--color-halo-silver)] text-white font-black uppercase text-[11px] tracking-[0.4em] hover:bg-black transition-all">
            Request Diagnostic Assistance
          </button>
        </div>
      </div>

      {/* ── Diagnostic Request Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white border border-black/10 w-full max-w-lg p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6 border-b border-black/5 pb-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-black">Request Diagnostic</h2>
                <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Our engineers will contact you directly via WhatsApp</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Full Name *</label>
                    <input required className={inputClass} placeholder="Your Name" value={formData.name} onChange={updateField("name")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Phone Number *</label>
                    <input required className={inputClass} placeholder="e.g. 082 123 4567" value={formData.phone} onChange={updateField("phone")} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Vehicle (Make, Model & Year) *</label>
                  <input required className={inputClass} placeholder="e.g. VW Golf 7 GTI 2018" value={formData.car} onChange={updateField("car")} />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Fault Code (if known)</label>
                  <input className={inputClass} placeholder="e.g. P17BF (leave blank if unsure)" value={formData.faultCode} onChange={updateField("faultCode")} />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Describe the Issue *</label>
                  <textarea
                    required
                    rows={4}
                    className={inputClass}
                    placeholder="Describe what the car is doing — e.g. jerky shifts, stuck in gear, flashing spanner..."
                    value={formData.issue}
                    onChange={updateField("issue")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 bg-[var(--color-halo-silver)] text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="animate-spin" size={14} /> : "Send via WhatsApp"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
