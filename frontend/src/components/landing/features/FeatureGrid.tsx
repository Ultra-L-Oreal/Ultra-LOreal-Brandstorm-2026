// frontend/src/components/landing/features/FeatureGrid.tsx

const features = [
  {
    title: 'Clinician-reviewed safety engine',
    desc: 'IFRA-aligned ingredient gating to avoid allergens & respiratory triggers.'
  },
  {
    title: 'Blind A/B sampling & live voting',
    desc: 'Real-world validation with blind testers and live leaderboards.'
  },
  {
    title: 'Refillable & sustainable',
    desc: 'Premium micro-refills, subscription and in-store refill options.'
  }
];

export default function FeatureGrid(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((f) => (
        <div key={f.title} className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-800">
          <h3 className="font-semibold text-xl text-white mb-2">{f.title}</h3>
          <p className="text-neutral-300">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
