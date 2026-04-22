// src/pages/brands/BrandsPage.tsx
import { useMemo, useState } from "react";
import Header from "../../components/global/header/Header";
import Footer from "../../components/global/footer/Footer";
import BrandCard from "../../components/brands/BrandCard";
import { brandCategories, brandRegistry } from "../../data/brands";

export default function BrandsPage() {
  const [query, setQuery] = useState("");

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brandRegistry;
    return brandRegistry.filter((brand) =>
      [brand.name, brand.tagline, brand.description, brand.category]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#080707] text-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,168,107,0.16),_transparent_35%),linear-gradient(to_bottom,_#0d0c0c,_#080707)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <p className="text-ultraGold uppercase tracking-[0.35em] text-xs mb-4">
              LUXE FRAGRANCE PORTFOLIO
            </p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
              The world of U.L.T.R.A brands.
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-8">
              Explore the fragrance houses behind the Ultra experience - from couture icons to artistic niche collections.
              Each brand card opens into a dedicated luxury page with signature scents, house identity, and Ultra matching logic.
            </p>

            <div className="max-w-xl">
              <label className="block text-sm text-neutral-400 mb-2">
                Search a brand
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="YSL, Lancôme, Armani, Prada..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-neutral-500 outline-none focus:border-ultraGold/60 transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20">
        <div className="container space-y-16">
          {query.trim() ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-serif text-white">
                  Search results
                </h2>
                <p className="text-neutral-400">
                  Showing matches for “{query}”
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBrands.map((brand) => (
                  <BrandCard key={brand.slug} brand={brand} />
                ))}
              </div>
            </div>
          ) : (
            brandCategories.map((category) => {
              const categoryBrands = brandRegistry.filter((brand) =>
                category.brands.includes(brand.slug)
              );

              return (
                <div key={category.title} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl md:text-3xl font-serif text-white">
                      {category.title}
                    </h2>
                    <p className="text-neutral-400 max-w-2xl">
                      {category.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categoryBrands.map((brand) => (
                      <BrandCard key={brand.slug} brand={brand} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="border-t border-white/10 py-14">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-4">
              WHY THIS MATTERS
            </p>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              One luxury system. Many fragrance worlds.
            </h2>
            <p className="text-neutral-300 text-lg leading-relaxed">
              Ultra connects these houses through one personalized, safety-aware fragrance journey - helping users discover what fits,
              validate it with micro-samples, and convert confidence into purchase.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}