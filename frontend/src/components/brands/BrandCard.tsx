// src/components/brands/BrandCard.tsx
import { Link } from "react-router-dom";
import type { BrandProfile } from "../../data/brands";

type Props = {
  brand: BrandProfile;
};

export default function BrandCard({ brand }: Props) {
  return (
    <Link
      to={brand.route}
      className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:border-ultraGold/60 hover:bg-white/10 transition-all duration-300"
    >
      <div className="mb-5 overflow-hidden rounded-xl border border-white/10">
        <div
          className="h-44 w-full bg-cover bg-center group-hover:scale-[1.02] transition-transform duration-500"
          style={{
            backgroundImage: brand.image
              ? `linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.18)), url(${brand.image})`
              : "linear-gradient(135deg, rgba(201,168,107,0.18), rgba(255,255,255,0.04))",
          }}
        />
      </div>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ultraGold/70 mb-2">
            {brand.category}
          </p>
          <h3 className="text-2xl font-serif text-white group-hover:text-ultraGold transition-colors">
            {brand.name}
          </h3>
          <p className="text-neutral-400 mt-1">{brand.tagline}</p>
        </div>

        <div className="h-10 w-10 rounded-full border border-ultraGold/30 flex items-center justify-center text-ultraGold">
          →
        </div>
      </div>

      <p className="text-neutral-300 leading-relaxed mb-4">
        {brand.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {brand.olfactiveProfile.slice(0, 3).map((item) => (
          <span
            key={item}
            className="text-xs rounded-full border border-white/10 px-3 py-1 text-neutral-300"
          >
            {item}
          </span>
        ))}
      </div>
    </Link>
  );
}