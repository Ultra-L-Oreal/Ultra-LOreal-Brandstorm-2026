// src/pages/brands/BrandDetailPage.tsx
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/global/header/Header";
import Footer from "../../components/global/footer/Footer";
import { brandBySlug, type BrandSlug } from "../../data/brands";

function isBrandSlug(value: string | undefined): value is BrandSlug {
  if (!value) return false;
  return value in brandBySlug;
}

export default function BrandDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const slug = params.slug;

  if (!isBrandSlug(slug)) {
    return (
      <div className="min-h-screen bg-[#080707] text-white">
        <Header />
        <div className="container pt-32 pb-20">
          <div className="max-w-2xl">
            <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-4">
              BRAND NOT FOUND
            </p>
            <h1 className="text-4xl font-serif mb-4">This house is not in the atlas yet.</h1>
            <p className="text-neutral-300 mb-8">
              The brand page you requested does not exist.
            </p>
            <Link
              to="/brands"
              className="inline-flex px-6 py-3 rounded-md bg-ultraGold text-black font-semibold"
            >
              Back to brands
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const brand = brandBySlug[slug];
  const related = brand.relatedSlugs
    .map((relatedSlug) => brandBySlug[relatedSlug])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#080707] text-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: brand.image
                ? `linear-gradient(to bottom, rgba(8,7,7,0.2), rgba(8,7,7,0.95)), url(${brand.image})`
                : "linear-gradient(135deg, rgba(201,168,107,0.16), rgba(255,255,255,0.03))",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,168,107,0.12),_transparent_38%)]" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl">
            <p className="text-ultraGold uppercase tracking-[0.35em] text-xs mb-4">
              {brand.category}
            </p>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
              {brand.name}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl leading-relaxed mb-6">
              {brand.tagline}
            </p>
            <p className="text-neutral-300 text-lg max-w-3xl leading-relaxed mb-8">
              {brand.intro}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/order/flight")}
                className="px-6 py-3 rounded-md bg-ultraGold text-black font-semibold"
              >
                Order Scent Flight
              </button>
              <button
                onClick={() => navigate("/brands")}
                className="px-6 py-3 rounded-md border border-white/15 text-white hover:border-ultraGold/50 transition"
              >
                Back to brands
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview blocks */}
      <section className="pb-16">
        <div className="container grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <p className="text-ultraGold uppercase tracking-[0.25em] text-xs mb-3">
              HOUSE STATEMENT
            </p>
            <h2 className="text-2xl md:text-3xl font-serif mb-4">
              {brand.heroStatement}
            </h2>
            <p className="text-neutral-300 leading-relaxed">
              {brand.description}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-ultraGold uppercase tracking-[0.25em] text-xs mb-3">
              OLFACTIVE CODES
            </p>
            <div className="flex flex-wrap gap-2">
              {brand.olfactiveProfile.map((item) => (
                <span
                  key={item}
                  className="text-xs rounded-full border border-white/10 px-3 py-1 text-neutral-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-ultraGold uppercase tracking-[0.25em] text-xs mb-3">
              ULTRA FIT
            </p>
            <div className="space-y-3">
              {brand.ultraMatch.slice(0, 2).map((item) => (
                <p key={item} className="text-neutral-300 leading-relaxed text-sm">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Signature scents */}
      <section className="pb-16">
        <div className="container">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-2">
                SIGNATURE SCENTS
              </p>
              <h2 className="text-3xl md:text-4xl font-serif">
                The scents that define the house
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brand.signatureScents.map((scent) => (
              <article
                key={scent.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-ultraGold/40 transition"
              >
                <h3 className="text-2xl font-serif text-white mb-2">
                  {scent.name}
                </h3>
                <p className="text-sm uppercase tracking-[0.2em] text-ultraGold/80 mb-4">
                  {scent.mood}
                </p>
                <div className="flex flex-wrap gap-2">
                  {scent.notes.map((note) => (
                    <span
                      key={note}
                      className="text-xs rounded-full border border-white/10 px-3 py-1 text-neutral-200"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Brand intelligence */}
      <section className="pb-16">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-3">
              REFILL & LONGEVITY
            </p>
            <p className="text-neutral-300 leading-relaxed">
              {brand.refillStory}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-3">
              SAFETY & MATCHING
            </p>
            <p className="text-neutral-300 leading-relaxed">
              {brand.safetyStory}
            </p>
          </div>
        </div>
      </section>

      {/* Ultra match logic */}
      <section className="pb-16">
        <div className="container">
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(201,168,107,0.08))] p-8 md:p-10">
            <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-3">
              WHY ULTRA RECOMMENDS THIS HOUSE
            </p>
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Matching logic for this fragrance world
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {brand.ultraMatch.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <p className="text-neutral-200 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related houses */}
      <section className="pb-20">
        <div className="container">
          <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-3">
            RELATED HOUSES
          </p>
          <h2 className="text-3xl md:text-4xl font-serif mb-8">
            Explore adjacent fragrance worlds
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <Link
                key={item.slug}
                to={item.route}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-ultraGold/50 transition group"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-ultraGold/70 mb-2">
                  {item.category}
                </p>
                <h3 className="text-2xl font-serif group-hover:text-ultraGold transition-colors">
                  {item.name}
                </h3>
                <p className="text-neutral-400 mt-2">{item.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}