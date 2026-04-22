import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-hero.jpg"
          alt="Luxury scent collection"
          className="w-full h-full object-cover object-center brightness-110 contrast-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-6">
            Fragrance intelligence for modern identity.
          </h1>

          <p className="text-lg text-neutral-200 mb-10 max-w-xl">
            Upload your look. Define your intent. Receive curated scent flights
            validated through blind micro-sample testing.
          </p>

          <div className="flex gap-6">
            <button
              onClick={() => navigate("/order/flight")}
              className="bg-ultraGold text-black px-10 py-4 rounded-sm font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Order Scent Flight
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("how");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white border-b border-white/40 hover:border-white transition-all"
            >
              How it works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
