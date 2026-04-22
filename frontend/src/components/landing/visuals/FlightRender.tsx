// frontend/src/components/landing/visuals/FlightRender.tsx

/**
 * Decorative presentational component. Use an actual product render or image in production.
 */
export default function FlightRender(){
  return (
    <div className="w-full h-[360px] flex items-center justify-center">
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 w-full max-w-md">
        <img src="/assets/hero-diptych.jpg" alt="Ultra flight box" className="w-full h-56 object-cover rounded-md mb-4" />
        <div className="text-neutral-300 text-sm">Ultra Flight - 3 blind micro-samples</div>
      </div>
    </div>
  );
}
