export default function YouTubeSection() {
  return (
    <section className="py-20 bg-black px-8 md:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4">
            Our Channel
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-tight">
            Watch Us <span className="text-[var(--color-halo-silver)]">In Action.</span>
          </h2>
        </div>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/fI7mumHoKEI?si=nO_qs2TVfOhn-Ivo"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="text-center mt-8">
          <a
            href="https://youtube.com/@roadangelsrsa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
