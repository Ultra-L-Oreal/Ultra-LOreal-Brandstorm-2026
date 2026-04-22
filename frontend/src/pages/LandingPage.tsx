// frontend/src/pages/LandingPage.tsx
import Header from '../components/global/header/Header';
import Hero from '../components/landing/hero/Hero';
import FeatureGrid from '../components/landing/features/FeatureGrid';
///import TrustSignals from '../components/landing/trust/TrustSignals';
//import FlightRender from '../components/landing/visuals/FlightRender';
import Footer from '../components/global/footer/Footer';

export default function LandingPage() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <section className="container py-12">
          <FeatureGrid />
        </section>
        
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* LEFT: Text card (never overlaps image) */}
              <div className="relative z-10">
                <div className="max-w-xl bg-[rgba(0,0,0,0.55)] backdrop-blur-md border border-neutral-800 p-8 rounded-xl shadow-xl">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                    Clinician-reviewed safety & blind validation
                  </h2>

                  <p className="text-lg text-neutral-200 mb-6">
                    Ultra combines a safety-first engine with blind A/B sampling and traceable
                    micro-samples to ensure every luxury scent suits the person - not just the label.
                  </p>

                  <div className="flex gap-4">
                    <a
                      className="inline-block px-6 py-3 bg-ultraGold text-black rounded font-medium shadow"
                      href="#how"
                    >
                      Learn More
                    </a>
                    <a
                      className="inline-block px-6 py-3 border border-neutral-700 text-neutral-200 rounded"
                      href="#flight"
                    >
                      Order Scent Flight
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT: Image panel with logos and safe crop */}
              <div className="w-full">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  {/* Logos row absolutely positioned at the top center so they're always visible */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full">
                    {/* Use small transparent PNG/SVG logos here (ensure you have right to use them) */}
                    <img src="/assets/logos/dior.png" alt="Dior" className="h-6 object-contain opacity-90" />
                    <img src="/assets/logos/tomford.png" alt="Tom Ford" className="h-6 object-contain opacity-90" />
                    <img src="/assets/logos/ysl.png" alt="YSL" className="h-6 object-contain opacity-90" />
                    <img src="/assets/logos/estee.png" alt="Estée Lauder" className="h-6 object-contain opacity-90" />
                  </div>

                  {/* The image itself. control the visible area with objectPosition */}
                  <img
                    src="/assets/hero-diptych.jpg"
                    alt="Ultra sample boxes and micro-vials"
                    className="w-full h-[420px] object-cover"
                    // adjust objectPosition to show the top area where logos are and the right area where the QR sits
                    // try 'top center', 'top right' or 'right center' depending on your art
                    style={{ objectPosition: 'top center' }}
                  />

                  {/* Optional: small caption or CTA overlay in the lower-left of the image */}
                  <div className="absolute bottom-4 left-4 z-20 text-sm text-neutral-200 bg-black/30 p-2 rounded">
                    3 blind micro-samples - clinically reviewed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* <section className="container py-12">
          <TrustSignals />
        </section> */}
      </main>
      <Footer />
    </div>
  );
}
