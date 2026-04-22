// src/pages/brands/BrandDetailPage.tsx
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/global/header/Header";
import Footer from "../../components/global/footer/Footer";
import {
  brandBySlug,
  type BrandSlug,
  type BrandProfile,
  type BrandSignatureScent,
} from "../../data/brands";

function isBrandSlug(value: string | undefined): value is BrandSlug {
  if (!value) return false;
  return value in brandBySlug;
}

export default function BrandDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const slug = params.slug;

  const [hoveredScent, setHoveredScent] = useState<BrandSignatureScent | null>(null);
  const [compareSelected, setCompareSelected] = useState<string[]>([]);

  if (!isBrandSlug(slug)) {
    return (
      <div className="min-h-screen bg-[#080707] text-white">
        <Header />
        <div className="container pt-32 pb-20">
          <div className="max-w-2xl">
            <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-4">
              BRAND NOT FOUND
            </p>
            <h1 className="text-4xl font-serif mb-4">
              This house is not in the atlas yet.
            </h1>
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

  const related: BrandProfile[] = brand.relatedSlugs
    .map((relatedSlug) => brandBySlug[relatedSlug])
    .filter((item): item is BrandProfile => Boolean(item));

  const previewScent = hoveredScent ?? brand.signatureScents[0];

  const toggleCompare = (name: string) => {
    setCompareSelected((current) => {
      if (current.includes(name)) {
        return current.filter((item) => item !== name);
      }

      if (current.length >= 2) {
        return current;
      }

      return [...current, name];
    });
  };

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
                onClick={() => navigate(`/order/flight?brand=${slug}`)}
                className="px-6 py-3 rounded-md bg-ultraGold text-black font-semibold"
              >
                Build a Flight from this House
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

      {/* Fragrances */}
      <section className="pb-16">
        <div className="container">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-2">
                HOUSE FRAGRANCES
              </p>
              <h2 className="text-3xl md:text-4xl font-serif">
                The fragrances inside this world
              </h2>
              <p className="text-neutral-400 max-w-3xl leading-relaxed mt-3">
                These are the key fragrances under the house. Choose one to build a scent flight, or compare this house with others before ordering.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {brand.signatureScents.map((scent, index) => {
              const isCompared = compareSelected.includes(scent.name);
              const isTop3 = index < 3;

              return (
                <article
                  key={scent.name}
                  onMouseEnter={() => setHoveredScent(scent)}
                  onMouseLeave={() => setHoveredScent(null)}
                  className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-ultraGold/40 transition"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <div
                      className="h-full w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: scent.image
                          ? `linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1)), url(${scent.image})`
                          : "linear-gradient(135deg, rgba(201,168,107,0.18), rgba(255,255,255,0.05))",
                      }}
                    />

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {isTop3 && (
                        <span className="rounded-full bg-ultraGold px-3 py-1 text-[11px] font-semibold text-black">
                          Top 3 recommended
                        </span>
                      )}

                      {isCompared && (
                        <span className="rounded-full border border-ultraGold/40 bg-black/40 px-3 py-1 text-[11px] font-medium text-ultraGold">
                          Compare selected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-ultraGold/70 mb-1">
                      {scent.family || brand.category}
                    </p>

                    <h3 className="text-xl font-serif text-white mb-1">
                      {scent.name}
                    </h3>

                    <p className="text-sm text-neutral-400 mb-3">
                      {scent.mood}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {scent.notes.slice(0, 4).map((note: string) => (
                        <span
                          key={note}
                          className="text-xs rounded-full border border-white/10 px-3 py-1 text-neutral-300"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                      <span>{scent.longevity || "Long lasting"}</span>
                      <span>{scent.sillage || "Moderate"}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/order/flight?brand=${slug}&scent=${encodeURIComponent(scent.name)}`
                          )
                        }
                        className="flex-1 px-3 py-2 rounded-md bg-ultraGold text-black text-sm font-semibold"
                      >
                        Add
                      </button>

                      <button
                        onClick={() => toggleCompare(scent.name)}
                        className={`flex-1 px-3 py-2 rounded-md border text-sm transition ${
                          isCompared
                            ? "border-ultraGold bg-ultraGold/10 text-ultraGold"
                            : "border-white/10 text-white hover:border-ultraGold/50"
                        }`}
                      >
                        {isCompared ? "Remove compare" : "Compare"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Quick preview panel */}
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="min-h-[320px] bg-black">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: previewScent?.image
                      ? `linear-gradient(to top, rgba(8,7,7,0.85), rgba(8,7,7,0.18)), url(${previewScent.image})`
                      : "linear-gradient(135deg, rgba(201,168,107,0.18), rgba(255,255,255,0.05))",
                  }}
                />
              </div>

              <div className="p-6 md:p-8">
                <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-3">
                  QUICK PREVIEW
                </p>
                <h3 className="text-3xl font-serif text-white mb-2">
                  {previewScent?.name}
                </h3>
                <p className="text-neutral-400 mb-5">
                  Hover any scent card to preview it here.
                </p>

                {previewScent?.description && (
                  <p className="text-neutral-300 leading-relaxed mb-5">
                    {previewScent.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-5">
                  {previewScent?.notes.map((note: string) => (
                    <span
                      key={note}
                      className="text-xs rounded-full border border-white/10 px-3 py-1 text-neutral-200"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {previewScent?.ultraFit && (
                  <div className="mb-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-2">
                      Why Ultra Matches This
                    </p>
                    <ul className="space-y-2 text-sm text-neutral-300">
                      {previewScent.ultraFit.map((item: string) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {previewScent?.safetyNote && (
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                    {previewScent.safetyNote}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compare tray */}
          {compareSelected.length > 0 && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-ultraGold/70 mb-2">
                  Compare toggle
                </p>
                <p className="text-neutral-200">
                  {compareSelected.join(" vs ")}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCompareSelected([])}
                  className="px-4 py-2 rounded-md border border-white/10 text-white"
                >
                  Clear
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/brands/compare?brand=${slug}&one=${encodeURIComponent(
                        compareSelected[0] || ""
                      )}&two=${encodeURIComponent(compareSelected[1] || "")}`
                    )
                  }
                  disabled={compareSelected.length < 2}
                  className="px-4 py-2 rounded-md bg-ultraGold text-black font-semibold disabled:opacity-50"
                >
                  Compare selected
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate(`/order/flight?brand=${slug}`)}
              className="px-6 py-3 rounded-md bg-ultraGold text-black font-semibold"
            >
              Build a Flight from {brand.name}
            </button>

            <button
              onClick={() => navigate("/brands")}
              className="px-6 py-3 rounded-md border border-white/15 text-white hover:border-ultraGold/50 transition"
            >
              Compare Other Houses
            </button>
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
              {brand.ultraMatch.map((item: string) => (
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