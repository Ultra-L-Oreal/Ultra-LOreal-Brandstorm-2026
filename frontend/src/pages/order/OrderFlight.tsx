import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/global/header/Header';
import Footer from '../../components/global/footer/Footer';
import api from '../../services/api/httpClient';
import {
  brandBySlug,
  brandRegistry,
  type BrandProfile,
  type BrandSignatureScent,
  type BrandSlug,
} from '../../data/brands';

type SafetyStatus = 'SAFE' | 'CAUTION' | 'AVOID';
type ShippingMethod = 'SHIP' | 'PICKUP';

type Recommendation = {
  fragranceId: string;
  brand: string;
  brandSlug: BrandSlug;
  name: string;
  score: number;
  safetyStatus: SafetyStatus;
  explain: string;
  longevityEstimate: number;
  notes: string[];
  image?: string;
  family?: string;
  mood?: string;
  description?: string;
  longevity?: string;
  sillage?: string;
  bestFor?: string[];
  ultraFit?: string[];
  safetyNote?: string;
};

type OrderResponse = {
  ok?: boolean;
  orderId?: string;
  kitId?: string;
  compareId?: string;
  message?: string;
};

type DraftFlight = {
  intent: string;
  allergies: string[];
  outfitName?: string;
  selectedIds: string[];
  shippingMethod: ShippingMethod;
  preferredBrand?: string;
};

type RecommendationsResponse = {
  top3?: Recommendation[];
  alternatives?: Recommendation[];
};

function isBrandSlug(value: string | null | undefined): value is BrandSlug {
  if (!value) return false;
  return value in brandBySlug;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safetyBadge(status: SafetyStatus) {
  if (status === 'SAFE') return 'border-emerald-400/30 text-emerald-300 bg-emerald-400/10';
  if (status === 'CAUTION') return 'border-amber-400/30 text-amber-300 bg-amber-400/10';
  return 'border-rose-400/30 text-rose-300 bg-rose-400/10';
}

function safetyLabel(status: SafetyStatus) {
  if (status === 'SAFE') return 'Safe';
  if (status === 'CAUTION') return 'Caution';
  return 'Avoid';
}

function scoreLabel(score: number) {
  return `${Math.round(score)}% match`;
}

function normalizeDraft(raw: string | null): DraftFlight | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<DraftFlight>;
    if (!parsed || !Array.isArray(parsed.selectedIds)) return null;

    return {
      intent: typeof parsed.intent === 'string' ? parsed.intent : '',
      allergies: Array.isArray(parsed.allergies)
        ? parsed.allergies.filter((item): item is string => typeof item === 'string')
        : [],
      outfitName: typeof parsed.outfitName === 'string' ? parsed.outfitName : undefined,
      selectedIds: parsed.selectedIds.filter((id): id is string => typeof id === 'string'),
      shippingMethod: parsed.shippingMethod === 'PICKUP' ? 'PICKUP' : 'SHIP',
      preferredBrand: typeof parsed.preferredBrand === 'string' ? parsed.preferredBrand : undefined,
    };
  } catch {
    return null;
  }
}

function deriveSafetyStatus(scent: BrandSignatureScent): SafetyStatus {
  const text = `${scent.name} ${scent.mood} ${scent.description ?? ''} ${scent.safetyNote ?? ''}`.toLowerCase();

  if (
    text.includes('sensitive') ||
    text.includes('careful') ||
    text.includes('strong') ||
    text.includes('high trail') ||
    text.includes('projection')
  ) {
    return 'CAUTION';
  }

  return 'SAFE';
}

function deriveLongevityEstimate(scent: BrandSignatureScent): number {
  const text = `${scent.mood} ${scent.description ?? ''} ${scent.longevity ?? ''}`.toLowerCase();

  if (text.includes('very long')) return 0.86;
  if (text.includes('long lasting')) return 0.8;
  if (text.includes('strong')) return 0.77;
  if (text.includes('moderate')) return 0.7;
  return 0.74;
}

function buildRecommendations(
  selectedBrandSlug: BrandSlug | null,
  selectedScentName: string | null,
  intent: string,
  allergies: string[]
): Recommendation[] {
  const focusBrand = selectedBrandSlug ? brandBySlug[selectedBrandSlug] : null;
  const exactScent = selectedScentName?.trim().toLowerCase() ?? null;
  const intentText = intent.trim().toLowerCase();
  const allergyText = allergies.join(' ').toLowerCase();

  const all = brandRegistry.flatMap((brand: BrandProfile, brandIndex) =>
    brand.signatureScents.map((scent, scentIndex) => {
      const fragranceId = `${brand.slug}-${slugify(scent.name)}`;
      const scentSlug = slugify(scent.name).toLowerCase();
      const brandScoreBoost = focusBrand?.slug === brand.slug ? 14 : 0;
      const exactBoost = exactScent && (exactScent === scentSlug || exactScent === fragranceId.toLowerCase()) ? 12 : 0;

      const scentText = [
        brand.name,
        brand.category,
        brand.tagline,
        scent.name,
        scent.mood,
        scent.description ?? '',
        ...(scent.notes ?? []),
        ...(scent.ultraFit ?? []),
        ...(scent.bestFor ?? []),
      ]
        .join(' ')
        .toLowerCase();

      const intentHits = intentText
        ? intentText
            .split(/\s+/)
            .filter((word) => word.length > 2)
            .reduce((count, word) => (scentText.includes(word) ? count + 1 : count), 0)
        : 0;

      const allergyPenalty = allergies.length > 0 && scentText.includes(allergyText) ? 10 : 0;

      const scoreBase =
        95 -
        brandIndex * 1.2 -
        scentIndex * 1.6 +
        brandScoreBoost +
        exactBoost +
        intentHits * 2 -
        allergyPenalty;

      const score = Math.max(65, Math.min(99, Math.round(scoreBase)));

      return {
        fragranceId,
        brand: brand.name,
        brandSlug: brand.slug,
        name: scent.name,
        score,
        safetyStatus: deriveSafetyStatus(scent),
        explain:
          scent.description ??
          `A signature expression from ${brand.name}, curated for this Scent Flight.`,
        longevityEstimate: deriveLongevityEstimate(scent),
        notes: scent.notes,
        image: scent.image ?? brand.image,
        family: scent.family,
        mood: scent.mood,
        description: scent.description,
        longevity: scent.longevity,
        sillage: scent.sillage,
        bestFor: scent.bestFor,
        ultraFit: scent.ultraFit,
        safetyNote: scent.safetyNote,
      };
    })
  );

  const sorted = all.sort((a, b) => {
    if (focusBrand) {
      const aFocus = a.brandSlug === focusBrand.slug ? 1 : 0;
      const bFocus = b.brandSlug === focusBrand.slug ? 1 : 0;
      if (aFocus !== bFocus) return bFocus - aFocus;
    }

    if (exactScent) {
      const aExact =
        slugify(a.name).toLowerCase() === exactScent ||
        a.fragranceId.toLowerCase() === exactScent ||
        slugify(`${a.brandSlug}-${a.name}`).toLowerCase() === exactScent
          ? 1
          : 0;
      const bExact =
        slugify(b.name).toLowerCase() === exactScent ||
        b.fragranceId.toLowerCase() === exactScent ||
        slugify(`${b.brandSlug}-${b.name}`).toLowerCase() === exactScent
          ? 1
          : 0;

      if (aExact !== bExact) return bExact - aExact;
    }

    return b.score - a.score;
  });

  return sorted;
}

export default function OrderFlight() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const brandParam = searchParams.get('brand');
  const scentParam = searchParams.get('scent');
  const focusBrand = isBrandSlug(brandParam) ? brandBySlug[brandParam] : null;

  const draft = useMemo(() => normalizeDraft(sessionStorage.getItem('ultra_draft_flight')), []);

  const [intent, setIntent] = useState(draft?.intent || 'Bold evening');
  const [allergiesInput, setAllergiesInput] = useState((draft?.allergies || []).join(', '));
  const [outfitName, setOutfitName] = useState(draft?.outfitName || '');
  const [outfitPreview, setOutfitPreview] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(draft?.shippingMethod || 'SHIP');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(draft?.selectedIds || []);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [alternatives, setAlternatives] = useState<Recommendation[]>([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  //const [mode, setMode] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [preferredBrand, setPreferredBrand] = useState<string>(draft?.preferredBrand || focusBrand?.slug || '');

  const allergies = useMemo(
    () => allergiesInput.split(',').map((item) => item.trim()).filter(Boolean),
    [allergiesInput]
  );

  const selectedRecommendations = useMemo(
    () => recommendations.filter((item) => selectedIds.includes(item.fragranceId)),
    [recommendations, selectedIds]
  );

  const selectedCount = selectedIds.length;
  const remaining = Math.max(0, 3 - selectedCount);
  const activeFocusLabel = focusBrand?.name ?? null;
  const activeScentLabel = scentParam ?? null;

  // useEffect(() => {
  //   if (draft && draft.selectedIds?.length) {
  //     setMode('ready');
  //   }
  // }, [draft]);
  const [mode, setMode] = useState(() => {
  if (draft && draft.selectedIds?.length) return 'ready';
  return 'input';
});

  useEffect(() => {
    const payload: DraftFlight = {
      intent,
      allergies,
      outfitName: outfitName || undefined,
      selectedIds,
      shippingMethod,
      preferredBrand: preferredBrand || undefined,
    };

    sessionStorage.setItem('ultra_draft_flight', JSON.stringify(payload));
  }, [intent, allergies, outfitName, selectedIds, shippingMethod, preferredBrand]);

  // useEffect(() => {
  //   if (focusBrand && preferredBrand !== focusBrand.slug) {
  //     setPreferredBrand(focusBrand.slug);
  //   }
  // }, [focusBrand, preferredBrand]);
  
  const handleFileUpload = (file: File | null) => {
    if (!file) {
      setOutfitPreview(null);
      setOutfitName('');
      return;
    }

    setOutfitName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setOutfitPreview(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setMode('generating');

    const chosenBrand = isBrandSlug(preferredBrand) ? preferredBrand : focusBrand?.slug ?? null;

    try {
      const res = await api.post<RecommendationsResponse>('/v1/recommendations', {
        intent,
        allergies,
        preferredBrand: chosenBrand || undefined,
        outfitImage: outfitPreview,
        outfitName: outfitName || undefined,
        scent: scentParam || undefined,
      });

      const apiTop3 = res?.top3 ?? [];
      const apiAlternatives = res?.alternatives ?? [];

      if (apiTop3.length > 0) {
        setRecommendations(apiTop3.slice(0, 3));
        setAlternatives(apiAlternatives);
        setSelectedIds(apiTop3.slice(0, 3).map((item) => item.fragranceId));
        setMode('ready');
        return;
      }

      throw new Error('Empty recommendation result');
    } catch (err) {
      console.warn('Recommendation API unavailable, using local ranking.', err);

      const ranked = buildRecommendations(chosenBrand, scentParam, intent, allergies);
      const exact = scentParam
        ? ranked.find(
            (item) =>
              item.name.toLowerCase() === scentParam.toLowerCase() ||
              item.fragranceId.toLowerCase() === scentParam.toLowerCase()
          )
        : undefined;

      const top3 = [exact, ...ranked]
        .filter((item): item is Recommendation => Boolean(item))
        .filter((item, index, arr) => arr.findIndex((x) => x.fragranceId === item.fragranceId) === index)
        .slice(0, 3);

      const extra = ranked.filter((item) => !top3.some((pick) => pick.fragranceId === item.fragranceId)).slice(0, 6);

      setRecommendations(top3);
      setAlternatives(extra);
      setSelectedIds(top3.map((item) => item.fragranceId));
      setMode('ready');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    setError('');
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      if (prev.length >= 3) {
        setError('Your Scent Flight can include up to 3 micro-vials.');
        return prev;
      }

      return [...prev, id];
    });
  };

  const handleAutoPickTop3 = () => {
    if (recommendations.length === 0) {
      handleGenerate();
      return;
    }

    setSelectedIds(recommendations.slice(0, 3).map((item) => item.fragranceId));
  };

  const handleSubmit = async () => {
    setError('');

    if (!consentAccepted) {
      setError('Please accept the safety and sampling consent before continuing.');
      return;
    }

    if (selectedIds.length !== 3) {
      setError('Please select exactly 3 fragrances for your Scent Flight.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        selectedFragranceIds: selectedIds,
        intent,
        allergies,
        shippingMethod,
        outfitName: outfitName || undefined,
        brand: focusBrand?.slug || undefined,
        scent: scentParam || undefined,
        preferredBrand: isBrandSlug(preferredBrand) ? preferredBrand : undefined,
      };

      const response = await api.post<OrderResponse>('/v1/samples/order', payload);

      sessionStorage.removeItem('ultra_draft_flight');
      sessionStorage.setItem(
        'ultra_last_order',
        JSON.stringify({
          selectedIds,
          intent,
          shippingMethod,
          orderId: response?.orderId,
          kitId: response?.kitId,
          compareId: response?.compareId,
        })
      );

      navigate('/order/success', {
        state: {
          orderId: response?.orderId,
          kitId: response?.kitId,
          compareId: response?.compareId,
          selectedIds,
          intent,
          shippingMethod,
        },
      });
    } catch (err) {
      console.error(err);
      sessionStorage.setItem(
        'ultra_draft_flight',
        JSON.stringify({
          intent,
          allergies,
          outfitName: outfitName || undefined,
          selectedIds,
          shippingMethod,
          preferredBrand: preferredBrand || undefined,
        })
      );
      navigate('/auth/login', {
        state: { from: { pathname: '/order/flight' } },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080707] text-white">
      <Header />

      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,168,107,0.14),_transparent_34%),linear-gradient(to_bottom,_#0d0c0c,_#080707)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <p className="text-ultraGold uppercase tracking-[0.35em] text-xs mb-4">
              Build your Scent Flight
            </p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-5">
              Let the system generate your top 3 fragrances.
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-8">
              Enter your mood, allergies, photo, and optional brand preference. Ultra will rank the best matches across the full system, then let you refine the top 3 before checkout.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/brands"
                className="px-5 py-3 rounded-md border border-white/10 bg-white/5 text-neutral-100 hover:border-ultraGold/50 transition"
              >
                Find My Brand
              </Link>
              <button
                onClick={handleGenerate}
                className="px-5 py-3 rounded-md bg-ultraGold text-black font-semibold"
              >
                Generate My Flight
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('ultra_draft_flight');
                  setIntent('Bold evening');
                  setAllergiesInput('');
                  setOutfitName('');
                  setOutfitPreview(null);
                  setShippingMethod('SHIP');
                  setPreferredBrand(focusBrand?.slug || '');
                  setSelectedIds([]);
                  setRecommendations([]);
                  setAlternatives([]);
                  setShowAlternatives(false);
                  setMode('idle');
                  setError('');
                }}
                className="px-5 py-3 rounded-md border border-white/10 bg-white/5 text-neutral-100 hover:border-ultraGold/50 transition"
              >
                Reset
              </button>
            </div>

            {(activeFocusLabel || activeScentLabel) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {activeFocusLabel && (
                  <span className="rounded-full border border-ultraGold/30 bg-ultraGold/10 px-4 py-2 text-sm text-ultraGold">
                    Focus: {activeFocusLabel}
                  </span>
                )}
                {activeScentLabel && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200">
                    Starting from: {activeScentLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.9fr)] gap-8 items-start">
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-7">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-2">
                    STEP 1
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif">
                    Tell us the mood
                  </h2>
                </div>
                <div className="text-right text-sm text-neutral-400">
                  {selectedCount}/3 selected
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {['Bold evening', 'Soft romance', 'Clean luxury', 'Statement trail', 'Daytime polish', 'Mystery'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setIntent(chip)}
                    className={`px-4 py-2 rounded-full border transition ${
                      intent === chip
                        ? 'bg-ultraGold text-black border-ultraGold'
                        : 'border-white/10 bg-black/20 text-neutral-200 hover:border-ultraGold/40'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <label className="block text-sm text-neutral-400 mb-2">
                Or type your own intent
              </label>
              <input
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Bold evening, soft romance, clean luxury..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white placeholder:text-neutral-500 outline-none focus:border-ultraGold/60 transition"
              />

              <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Upload your look</p>
                    <p className="text-neutral-200">
                      Optional. Use it to refine style cues for your scent flight.
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center justify-center px-5 py-3 rounded-md border border-ultraGold/40 text-ultraGold hover:bg-ultraGold hover:text-black transition">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                    />
                    Upload outfit
                  </label>
                </div>

                {outfitName && (
                  <div className="text-sm text-neutral-300">
                    <span className="text-ultraGold">Selected:</span> {outfitName}
                  </div>
                )}

                {outfitPreview && (
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={outfitPreview}
                      alt="Outfit preview"
                      className="h-64 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
                <label className="block text-sm text-neutral-400 mb-2">
                  Allergies and sensitivity notes
                </label>
                <input
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                  placeholder="e.g. floral, strong projection, headache trigger"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white placeholder:text-neutral-500 outline-none focus:border-ultraGold/60 transition"
                />
                <p className="mt-3 text-xs text-neutral-500">
                  Use commas between concerns. The AI will avoid unsafe matches where possible.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
                <label className="block text-sm text-neutral-400 mb-2">
                  Preferred brand (optional)
                </label>
                <select
                  value={preferredBrand}
                  onChange={(e) => setPreferredBrand(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-ultraGold/60 transition"
                >
                  <option value="">All brands</option>
                  {brandRegistry.map((brand) => (
                    <option key={brand.slug} value={brand.slug} className="text-black">
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-7">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-2">
                    STEP 2
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif">
                    {mode === 'generating' ? 'Curating your flight...' : 'Your top 3'}
                  </h2>
                </div>
                <p className="text-neutral-400 text-sm max-w-md">
                  Ultra will rank the best matches across the system, then keep the flight focused on the three strongest choices.
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-72 rounded-2xl border border-white/10 bg-black/20 animate-pulse"
                    />
                  ))}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-neutral-400">
                  Generate your flight to see the top 3 fragrances.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {recommendations.map((item, index) => {
                    const selected = selectedIds.includes(item.fragranceId);
                    const disabled = !selected && selectedCount >= 3;

                    return (
                      <article
                        key={item.fragranceId}
                        className={`group rounded-2xl border p-5 transition-all duration-300 ${
                          selected
                            ? 'border-ultraGold/70 bg-[rgba(201,168,107,0.08)]'
                            : 'border-white/10 bg-white/5 hover:border-ultraGold/40 hover:bg-white/7'
                        } ${disabled ? 'opacity-60' : ''}`}
                      >
                        <div className="overflow-hidden rounded-xl border border-white/10 mb-4">
                          <div
                            className="h-36 w-full bg-cover bg-center"
                            style={{
                              backgroundImage: item.image
                                ? `linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15)), url(${item.image})`
                                : 'linear-gradient(135deg, rgba(201,168,107,0.18), rgba(255,255,255,0.05))',
                            }}
                          />
                        </div>

                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-ultraGold/70 mb-1">
                              #{index + 1} • {item.brand}
                            </p>
                            <h3 className="text-xl font-serif text-white">{item.name}</h3>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${safetyBadge(
                              item.safetyStatus
                            )}`}
                          >
                            {safetyLabel(item.safetyStatus)}
                          </span>
                        </div>

                        <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                          {item.explain}
                        </p>

                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="text-sm text-neutral-200 font-medium">
                            {scoreLabel(item.score)}
                          </span>
                          <span className="text-sm text-neutral-400">
                            Longevity {Math.round(item.longevityEstimate * 100)}%
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-5">
                          {item.notes.map((note) => (
                            <span
                              key={note}
                              className="text-xs rounded-full border border-white/10 px-3 py-1 text-neutral-300"
                            >
                              {note}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => toggleSelection(item.fragranceId)}
                          className={`w-full rounded-xl px-4 py-3 font-semibold transition ${
                            selected
                              ? 'bg-ultraGold text-black'
                              : 'bg-black/25 text-white border border-white/10 hover:border-ultraGold/50'
                          } ${disabled ? 'cursor-not-allowed' : ''}`}
                        >
                          {selected ? 'Remove from flight' : 'Add to flight'}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}

              {selectedIds.length === 0 && recommendations.length > 0 && (
                <div className="mt-5 text-sm text-neutral-400">
                  The AI has already selected the top 3. You can adjust them above if needed.
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={handleAutoPickTop3}
                  className="px-5 py-3 rounded-md border border-white/10 bg-white/5 text-neutral-100 hover:border-ultraGold/50 transition"
                >
                  Auto-select top 3
                </button>

                <button
                  onClick={() => setShowAlternatives((prev) => !prev)}
                  className="px-5 py-3 rounded-md border border-white/10 bg-white/5 text-neutral-100 hover:border-ultraGold/50 transition"
                >
                  {showAlternatives ? 'Hide alternatives' : 'Explore alternatives'}
                </button>
              </div>

              {showAlternatives && alternatives.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {alternatives.map((item) => {
                    const selected = selectedIds.includes(item.fragranceId);
                    return (
                      <article
                        key={item.fragranceId}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500 mb-1">
                              {item.brand}
                            </p>
                            <h4 className="text-lg font-serif text-white">{item.name}</h4>
                          </div>
                          <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${safetyBadge(item.safetyStatus)}`}>
                            {safetyLabel(item.safetyStatus)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-300 mb-3">{item.explain}</p>
                        <button
                          type="button"
                          onClick={() => toggleSelection(item.fragranceId)}
                          className={`w-full rounded-xl px-4 py-3 font-semibold transition ${
                            selected
                              ? 'bg-ultraGold text-black'
                              : 'bg-black/25 text-white border border-white/10 hover:border-ultraGold/50'
                          }`}
                        >
                          {selected ? 'Remove from flight' : 'Swap into flight'}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Link
                to="/brands"
                className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-ultraGold/40 transition"
              >
                <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-2">
                  FIND MY BRAND
                </p>
                <h3 className="text-2xl font-serif mb-3">Not sure where to start?</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Use the brand atlas to find the fragrance house that fits your identity best.
                </p>
              </Link>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-2">
                  HOW IT WORKS
                </p>
                <h3 className="text-2xl font-serif mb-3">Three choices. One flight.</h3>
                <p className="text-neutral-300 leading-relaxed">
                  You select 3 micro-vials, confirm delivery, and then test them blind at home.
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] backdrop-blur-md p-6">
              <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-3">
                YOUR FLIGHT
              </p>
              <h2 className="text-2xl font-serif mb-5">Selected micro-vials</h2>

              <div className="space-y-3 mb-5">
                {selectedRecommendations.length === 0 ? (
                  <p className="text-neutral-400 text-sm">
                    Your flight is empty. Choose up to 3 scents.
                  </p>
                ) : (
                  selectedRecommendations.map((item) => (
                    <div
                      key={item.fragranceId}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <p className="font-medium text-white">{item.name}</p>
                        <button
                          type="button"
                          onClick={() => toggleSelection(item.fragranceId)}
                          className="text-xs text-ultraGold hover:underline"
                        >
                          remove
                        </button>
                      </div>
                      <p className="text-sm text-neutral-400">{item.brand}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Selected</span>
                  <span className="text-white">{selectedCount}/3</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-ultraGold transition-all"
                    style={{ width: `${(selectedCount / 3) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                  {remaining > 0
                    ? `${remaining} more selection${remaining === 1 ? '' : 's'} needed`
                    : 'Flight ready'}
                </p>
              </div>

              <div className="space-y-3 mb-5">
                <label className="block text-sm text-neutral-400">
                  Delivery mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('SHIP')}
                    className={`rounded-xl px-4 py-3 text-sm border transition ${
                      shippingMethod === 'SHIP'
                        ? 'border-ultraGold bg-ultraGold text-black'
                        : 'border-white/10 bg-black/20 text-neutral-200'
                    }`}
                  >
                    Ship to me
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingMethod('PICKUP')}
                    className={`rounded-xl px-4 py-3 text-sm border transition ${
                      shippingMethod === 'PICKUP'
                        ? 'border-ultraGold bg-ultraGold text-black'
                        : 'border-white/10 bg-black/20 text-neutral-200'
                    }`}
                  >
                    In-store pickup
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-neutral-300 mb-5">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-1 accent-[#c9a86b]"
                />
                <span>
                  I understand this is a blind micro-sample flight and I consent to
                  safety screening, fragrance guidance, and contact if needed.
                </span>
              </label>

              {error && (
                <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-xl bg-ultraGold px-5 py-4 font-semibold text-black hover:scale-[1.01] transition disabled:opacity-60"
              >
                {submitting ? 'Creating your flight…' : 'Continue to checkout'}
              </button>

              <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
                After checkout, your sample credit can be applied toward a full-size bottle or refill path.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-3">
                WHAT YOU GET
              </p>
              <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                <p>3 blind micro-vials selected from your highest-fit recommendations.</p>
                <p>Safety-aware fragrance matching before dispatch.</p>
                <p>Longevity and sillage feedback after you test the flight.</p>
                <p>Sample-to-purchase credit applied later if you buy the full bottle.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
