// frontend/src/pages/order/OrderFlight.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/global/header/Header';
import Footer from '../../components/global/footer/Footer';
import api from '../../services/api/httpClient';

type SafetyStatus = 'SAFE' | 'CAUTION' | 'AVOID';
type ShippingMethod = 'SHIP' | 'PICKUP';

type Recommendation = {
  fragranceId: string;
  brand: string;
  name: string;
  score: number;
  safetyStatus: SafetyStatus;
  explain: string;
  longevityEstimate: number;
  notes: string[];
  image?: string;
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
  outfitName?: string;
  selectedIds: string[];
  shippingMethod: ShippingMethod;
};

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    fragranceId: 'ysl-libre',
    brand: 'Yves Saint Laurent',
    name: 'Libre',
    score: 96,
    safetyStatus: 'SAFE',
    explain: 'Strong fit for a bold, polished evening profile with warm floral confidence.',
    longevityEstimate: 0.84,
    notes: ['lavender', 'orange blossom', 'musk'],
    image: '/assets/brands/ysl-hero.jpg',
  },
  {
    fragranceId: 'lancome-la-vie-est-belle',
    brand: 'Lancôme',
    name: 'La Vie Est Belle',
    score: 92,
    safetyStatus: 'SAFE',
    explain: 'Elegant sweetness with refined warmth for soft luxury and high appeal.',
    longevityEstimate: 0.78,
    notes: ['iris', 'praline', 'patchouli'],
    image: '/assets/brands/lancome-hero.jpg',
  },
  {
    fragranceId: 'armani-si',
    brand: 'Giorgio Armani',
    name: 'Si',
    score: 89,
    safetyStatus: 'CAUTION',
    explain: 'Quietly sensual and polished, with a slightly richer trail that may suit evening wear.',
    longevityEstimate: 0.73,
    notes: ['blackcurrant', 'rose', 'vanilla'],
    image: '/assets/brands/armani-hero.jpg',
  },
  {
    fragranceId: 'prada-paradoxe',
    brand: 'Prada',
    name: 'Paradoxe',
    score: 87,
    safetyStatus: 'SAFE',
    explain: 'Modern, intelligent, and softly radiant — a clean couture profile.',
    longevityEstimate: 0.76,
    notes: ['neroli', 'amber', 'white musk'],
    image: '/assets/brands/prada-hero.jpg',
  },
  {
    fragranceId: 'valentino-born-in-roma',
    brand: 'Valentino',
    name: 'Born in Roma Donna',
    score: 85,
    safetyStatus: 'CAUTION',
    explain: 'Couture floral texture with noticeable presence and a fuller signature trail.',
    longevityEstimate: 0.72,
    notes: ['jasmine', 'vanilla', 'woods'],
    image: '/assets/brands/valentino-hero.jpg',
  },
  {
    fragranceId: 'maison-margiela-replica',
    brand: 'Maison Margiela',
    name: 'Replica Jazz Club',
    score: 81,
    safetyStatus: 'SAFE',
    explain: 'Atmospheric and skin-close for users who want a more intimate and conceptual scent.',
    longevityEstimate: 0.67,
    notes: ['rum', 'tobacco', 'vanilla'],
    image: '/assets/brands/margiela-hero.jpg',
  },
];

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
      outfitName: typeof parsed.outfitName === 'string' ? parsed.outfitName : undefined,
      selectedIds: parsed.selectedIds.filter((id): id is string => typeof id === 'string'),
      shippingMethod: parsed.shippingMethod === 'PICKUP' ? 'PICKUP' : 'SHIP',
    };
  } catch {
    return null;
  }
}

export default function OrderFlight() {
  const navigate = useNavigate();

  const [intent, setIntent] = useState('Bold evening');
  const [outfitName, setOutfitName] = useState('');
  const [outfitPreview, setOutfitPreview] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('SHIP');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadedFromDraft, setLoadedFromDraft] = useState(false);

  const selectedRecommendations = useMemo(
    () => recommendations.filter((item) => selectedIds.includes(item.fragranceId)),
    [recommendations, selectedIds]
  );

  const selectedCount = selectedIds.length;
  const remaining = Math.max(0, 3 - selectedCount);

  useEffect(() => {
    const draft = normalizeDraft(sessionStorage.getItem('ultra_draft_flight'));
    if (draft && !loadedFromDraft) {
      setIntent(draft.intent || 'Bold evening');
      setSelectedIds(draft.selectedIds || []);
      setShippingMethod(draft.shippingMethod || 'SHIP');
      setLoadedFromDraft(true);
    }
  }, [loadedFromDraft]);

  useEffect(() => {
    const draft: DraftFlight = {
      intent,
      outfitName: outfitName || undefined,
      selectedIds,
      shippingMethod,
    };
    sessionStorage.setItem('ultra_draft_flight', JSON.stringify(draft));
  }, [intent, outfitName, selectedIds, shippingMethod]);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        params.set('intent', intent);
        const res = await api.get<{ results?: Recommendation[] }>(`/v1/recommendations?${params.toString()}`);

        const results = res?.results && res.results.length > 0 ? res.results : MOCK_RECOMMENDATIONS;
        setRecommendations(results.slice(0, 6));

        const top3 = results.slice(0, 3);
        if (selectedIds.length === 0) {
          setSelectedIds(top3.map((item) => item.fragranceId));
        }
      } catch {
        setRecommendations(MOCK_RECOMMENDATIONS);
        if (selectedIds.length === 0) {
          setSelectedIds(MOCK_RECOMMENDATIONS.slice(0, 3).map((item) => item.fragranceId));
        }
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent]);

  const intentChips = [
    'Bold evening',
    'Soft romance',
    'Clean luxury',
    'Statement trail',
    'Daytime polish',
    'Mystery',
  ];

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

  const toggleSelection = (fragranceId: string) => {
    setError('');
    setSelectedIds((current) => {
      if (current.includes(fragranceId)) {
        return current.filter((id) => id !== fragranceId);
      }

      if (current.length >= 3) {
        setError('Your Scent Flight can include up to 3 micro-vials.');
        return current;
      }

      return [...current, fragranceId];
    });
  };

  const handleAutoPickTop3 = () => {
    const top3 = recommendations.slice(0, 3).map((item) => item.fragranceId);
    setSelectedIds(top3);
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
        shippingMethod,
        outfitName: outfitName || undefined,
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
          outfitName: outfitName || undefined,
          selectedIds,
          shippingMethod,
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
              BUILD YOUR Scent Flight
            </p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-5">
              Choose 3 micro-vials that fit the moment.
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-8">
              Upload your look, define your intent, and select from curated luxury recommendations.
              Your flight is validated through blind micro-sample testing and safety-aware matching.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/brands"
                className="px-5 py-3 rounded-md border border-white/10 bg-white/5 text-neutral-100 hover:border-ultraGold/50 transition"
              >
                Find My Brand
              </Link>
              <Link
                to="/brands"
                className="px-5 py-3 rounded-md border border-white/10 bg-white/5 text-neutral-100 hover:border-ultraGold/50 transition"
              >
                Compare Brands
              </Link>
              <button
                onClick={handleAutoPickTop3}
                className="px-5 py-3 rounded-md bg-ultraGold text-black font-semibold"
              >
                Auto-select top 3
              </button>
            </div>
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
                {intentChips.map((chip) => (
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

              <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6">
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
                  <div className="mt-4 text-sm text-neutral-300">
                    <span className="text-ultraGold">Selected:</span> {outfitName}
                  </div>
                )}

                {outfitPreview && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={outfitPreview}
                      alt="Outfit preview"
                      className="h-64 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-7">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-ultraGold uppercase tracking-[0.3em] text-xs mb-2">
                    STEP 2
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif">
                    Select 3 fragrances
                  </h2>
                </div>
                <p className="text-neutral-400 text-sm max-w-md">
                  Top recommendations are pre-ranked by match, longevity, and safety.
                  Each selection becomes one blind micro-vial in your Scent Flight.
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-72 rounded-2xl border border-white/10 bg-black/20 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {recommendations.map((item) => {
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
                              {item.brand}
                            </p>
                            <h3 className="text-xl font-serif text-white">
                              {item.name}
                            </h3>
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
                  COMPARE BRANDS
                </p>
                <h3 className="text-2xl font-serif mb-3">See the houses side by side</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Compare the personality, notes, and signature scents of luxury brands before you choose.
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