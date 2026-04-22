// frontend/src/components/global/footer/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-[#0b0a0a] text-neutral-300 border-t border-neutral-800">
      
      {/* Top section */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="text-ultraGold font-serif text-2xl tracking-wide mb-4">
              ULTRA
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Blind-sampled luxury fragrance. Clinician-reviewed safety.
              Traceable micro-samples engineered for confidence.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white text-sm tracking-widest uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#how" className="hover:text-ultraGold transition">How It Works</a></li>
              <li><a href="#flight" className="hover:text-ultraGold transition">Scent Flight</a></li>
              <li><a href="#safety" className="hover:text-ultraGold transition">Safety Protocol</a></li>
              <li><a href="#about" className="hover:text-ultraGold transition">About Ultra</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-sm tracking-widest uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/faq" className="hover:text-ultraGold transition">FAQ</a></li>
              <li><a href="/contact" className="hover:text-ultraGold transition">Contact</a></li>
              <li><a href="/returns" className="hover:text-ultraGold transition">Returns</a></li>
              <li><a href="/shipping" className="hover:text-ultraGold transition">Shipping</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm tracking-widest uppercase mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/terms" className="hover:text-ultraGold transition">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-ultraGold transition">Privacy Policy</a></li>
              <li><a href="/safety" className="hover:text-ultraGold transition">Safety & Compliance</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-800"></div>

      {/* Bottom strip */}
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
        
        <div>
          © {new Date().getFullYear()} Ultra. All rights reserved.
        </div>

        <div className="flex gap-6">
          <a href="#" className="hover:text-ultraGold transition">Instagram</a>
          <a href="#" className="hover:text-ultraGold transition">LinkedIn</a>
          <a href="#" className="hover:text-ultraGold transition">Press</a>
        </div>

      </div>
    </footer>
  );
}
