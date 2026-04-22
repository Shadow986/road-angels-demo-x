import { motion } from "framer-motion";

export default function GearboxSection() {
  const specializedParts = [
    { title: "Mechatronic Repair", img: "/hero-car.jpg" },
    { title: "DSG Overhaul", img: "/hero-car.jpg" },
    { title: "TCM Cloning", img: "/hero-car.jpg" }
  ];

  return (
    <section className="bg-white py-32 text-black px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-4 uppercase italic">Technical Expertise</h2>
          <div className="h-1 w-20 bg-[var(--color-halo-silver)]" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {specializedParts.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group relative bg-gray-50 border border-black/5 p-4 overflow-hidden"
            >
              <div className="relative h-64 mb-6 overflow-hidden">
                <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={item.title} />
                <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors" />
              </div>
              <h3 className="text-lg font-bold tracking-widest uppercase italic">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
