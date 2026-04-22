export default function TrustSignals() {
  return (
    <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-8">
      
      {/* Top trust statement */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="bg-ultraGold w-12 h-12 rounded flex items-center justify-center text-black font-bold">
          ✓
        </div>

        <div className="text-center md:text-left">
          <div className="text-sm text-neutral-300">
            Clinician-approved
          </div>
          <div className="text-white font-medium">
            Safety-first sampling
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-700 mb-6"></div>

      {/* Logos centered */}
      <div className="flex items-center justify-center gap-8 flex-wrap">
        <img src="/assets/logos/dior.png" alt="Dior" className="h-8 opacity-80 hover:opacity-100 transition" />
        <img src="/assets/logos/tomford.png" alt="Tom Ford" className="h-8 opacity-80 hover:opacity-100 transition" />
        <img src="/assets/logos/ysl.png" alt="YSL" className="h-8 opacity-80 hover:opacity-100 transition" />
      </div>
    </div>
  );
}
