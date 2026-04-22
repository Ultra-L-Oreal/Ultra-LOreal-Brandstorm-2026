// src/data/brands.ts

export type BrandSlug =
  | "ysl"
  | "lancome"
  | "armani"
  | "prada"
  | "valentino"
  | "mugler"
  | "maison-margiela"
  | "viktor-rolf"
  | "azzaro"
  | "diesel"
  | "ralph-lauren"
  | "atelier-cologne";

export type BrandSignatureScent = {
  name: string;
  notes: string[];
  mood: string;
};

export type BrandProfile = {
  slug: BrandSlug;
  route: string;
  name: string;
  category: string;
  tagline: string;
  intro: string;
  heroStatement: string;
  description: string;
  image?: string;
  signatureScents: BrandSignatureScent[];
  olfactiveProfile: string[];
  ultraMatch: string[];
  refillStory: string;
  safetyStory: string;
  luxurySignals: string[];
  relatedSlugs: BrandSlug[];
};

export type BrandCategory = {
  title: string;
  subtitle: string;
  brands: BrandSlug[];
};

export const brandCategories: BrandCategory[] = [
  {
    title: "Couture Icons",
    subtitle: "The houses that define modern luxury fragrance.",
    brands: ["ysl", "lancome", "armani", "prada", "valentino"],
  },
  {
    title: "Modern Statement Houses",
    subtitle: "Expressive, bold, and instantly recognizable fragrance worlds.",
    brands: ["mugler", "viktor-rolf", "azzaro", "diesel", "ralph-lauren"],
  },
  {
    title: "Artistic & Niche",
    subtitle: "Memory-led and craft-focused houses with a more conceptual edge.",
    brands: ["maison-margiela", "atelier-cologne"],
  },
];

export const brandRegistry: BrandProfile[] = [
  {
    slug: "ysl",
    route: "/brands/ysl",
    name: "Yves Saint Laurent",
    category: "Couture Icon",
    tagline: "Bold. Magnetic. Night-ready.",
    intro:
      "YSL beauty sits at the intersection of fashion, attitude, and modern seduction.",
    heroStatement:
      "A house for people who want fragrance to feel like presence — sharp, glamorous, and unforgettable.",
    description:
      "Known for powerful signatures like Libre and Black Opium, YSL moves with confident contrast: luminous florals, addictive sweetness, and deep sensuality.",
    image: "/assets/brands/ysl-hero.png",
    signatureScents: [
      {
        name: "Libre",
        notes: ["lavender", "orange blossom", "musk"],
        mood: "Confident, radiant, feminine power.",
      },
      {
        name: "Black Opium",
        notes: ["coffee", "vanilla", "white flowers"],
        mood: "Evening glamour with a dark sweet trail.",
      },
      {
        name: "MYSLF",
        notes: ["bergamot", "orange blossom", "woods"],
        mood: "Modern, clean, and self-defined masculinity.",
      },
    ],
    olfactiveProfile: ["floral-amber", "gourmand", "fresh sensual", "statement trail"],
    ultraMatch: [
      "Best for bold evenings, events, and memorable first impressions.",
      "Matches users who want a visible fragrance signature.",
      "Strong fit for dressy outfits, black-tie, and confident styling.",
    ],
    refillStory:
      "YSL supports a refill-minded luxury ritual, helping iconic bottles remain beautiful and long-lasting.",
    safetyStory:
      "Ultra can flag brighter florals and sweet accords against personal sensitivity profiles before recommendation.",
    luxurySignals: ["fashion-house heritage", "global bestseller", "strong identity", "high recall"],
    relatedSlugs: ["lancome", "armani", "prada"],
  },
  {
    slug: "lancome",
    route: "/brands/lancome",
    name: "Lancôme",
    category: "Couture Icon",
    tagline: "Elegant. Radiant. Timeless.",
    intro:
      "Lancôme is the language of luminous femininity, refined sweetness, and polished French luxury.",
    heroStatement:
      "A house built for graceful signatures, romantic warmth, and classic elegance that still feels current.",
    description:
      "La Vie Est Belle and Trésor define a warm, optimistic, and feminine fragrance identity with luxurious comfort and depth.",
    image: "/assets/brands/lancome-hero.png",
    signatureScents: [
      {
        name: "La Vie Est Belle",
        notes: ["iris", "praline", "patchouli"],
        mood: "Joyful, warm, and elegantly sweet.",
      },
      {
        name: "Trésor",
        notes: ["rose", "peach", "musk"],
        mood: "Romantic, soft, and timeless.",
      },
      {
        name: "Idôle",
        notes: ["rose", "jasmine", "clean musk"],
        mood: "Modern, uplifting, and bright.",
      },
    ],
    olfactiveProfile: ["floral-gourmand", "soft musk", "radiant feminine", "signature warmth"],
    ultraMatch: [
      "Best for polished daywear, romantic occasions, and soft luxury dressing.",
      "Matches users who want beauty, softness, and warmth without shouting.",
      "Strong fit for elegant, clean, and universally appealing profiles.",
    ],
    refillStory:
      "Lancôme is ideal for a refill-forward luxury journey: iconic bottles, long-term use, and less waste.",
    safetyStory:
      "Ultra can guide sensitive users toward cleaner, softer options when floral sweetness might be too intense.",
    luxurySignals: ["French elegance", "optimistic femininity", "global recognition", "refill friendly"],
    relatedSlugs: ["ysl", "armani", "valentino"],
  },
  {
    slug: "armani",
    route: "/brands/armani",
    name: "Giorgio Armani",
    category: "Couture Icon",
    tagline: "Refined. Minimal. Effortlessly sensual.",
    intro:
      "Armani fragrance codes feel polished, sophisticated, and quietly confident.",
    heroStatement:
      "A house for clean luxury and graceful restraint — never loud, always present.",
    description:
      "Si and Acqua di Giò show the Armani balance: elegant warmth, airy freshness, and timeless wearability.",
    image: "/assets/brands/armani-hero.png",
    signatureScents: [
      {
        name: "Si",
        notes: ["blackcurrant", "rose", "vanilla"],
        mood: "Feminine, smooth, and refined.",
      },
      {
        name: "Acqua di Giò",
        notes: ["marine", "bergamot", "woods"],
        mood: "Fresh, clean, and effortlessly classic.",
      },
      {
        name: "Stronger With You",
        notes: ["chestnut", "spice", "amber"],
        mood: "Warm, modern, and magnetic.",
      },
    ],
    olfactiveProfile: ["fresh woody", "elegant amber", "clean luxury", "day-to-night"],
    ultraMatch: [
      "Best for understated luxury, workwear, and everyday elegance.",
      "Matches users who prefer clean sophistication over heavy projection.",
      "Strong fit for polished tailoring, crisp silhouettes, and quiet confidence.",
    ],
    refillStory:
      "Armani fragrances are perfect for a refill ritual: enduring design, repeated use, less packaging waste.",
    safetyStory:
      "Ultra can reduce over-selection of strong marine or spicy profiles for users with sensitivity flags.",
    luxurySignals: ["quiet luxury", "minimalist aesthetic", "timeless wear", "high versatility"],
    relatedSlugs: ["ysl", "lancome", "prada"],
  },
  {
    slug: "prada",
    route: "/brands/prada",
    name: "Prada",
    category: "Couture Icon",
    tagline: "Architectural. Intelligent. Modern.",
    intro:
      "Prada fragrance feels conceptual, polished, and fashion-forward.",
    heroStatement:
      "A house for people who love structure, intelligence, and a modern point of view.",
    description:
      "Paradoxe and Luna Rossa balance innovation, clarity, and a cool contemporary signature.",
    image: "/assets/brands/prada-hero.png",
    signatureScents: [
      {
        name: "Paradoxe",
        notes: ["neroli", "amber", "white musk"],
        mood: "Softly radiant and modern.",
      },
      {
        name: "Luna Rossa",
        notes: ["lavender", "mint", "ambrette"],
        mood: "Clean, dynamic, and urban.",
      },
    ],
    olfactiveProfile: ["fresh amber", "soft musk", "modern floral", "architectural polish"],
    ultraMatch: [
      "Best for modern, intentional users who want structure and style.",
      "Matches crisp dressing, contemporary silhouettes, and a cool finish.",
    ],
    refillStory:
      "Prada’s elegant bottle language works beautifully in refill-led luxury rituals.",
    safetyStory:
      "Ultra can steer sensitive users away from sharper clean-musky combinations if needed.",
    luxurySignals: ["modern couture", "architectural identity", "clean luxury", "intelligent design"],
    relatedSlugs: ["ysl", "armani", "valentino"],
  },
  {
    slug: "valentino",
    route: "/brands/valentino",
    name: "Valentino",
    category: "Couture Icon",
    tagline: "Romantic. Bold. Couture-led.",
    intro:
      "Valentino fragrance blends romance and fashion energy with a distinct couture mood.",
    heroStatement:
      "A house for expressive elegance — textured, glamorous, and emotionally rich.",
    description:
      "Born in Roma and Donna/Uomo present a stylish balance of floral warmth, amber texture, and fashion attitude.",
    image: "/assets/brands/valentino-hero.png",
    signatureScents: [
      {
        name: "Born in Roma Donna",
        notes: ["jasmine", "vanilla", "woods"],
        mood: "Modern femininity with impact.",
      },
      {
        name: "Born in Roma Uomo",
        notes: ["violet leaf", "sage", "smoked vetiver"],
        mood: "Fresh, textured, and stylishly masculine.",
      },
    ],
    olfactiveProfile: ["floral amber", "textured woods", "romantic couture", "fashion-led"],
    ultraMatch: [
      "Best for dressed-up evenings and elevated social moments.",
      "Matches users who want romance with structure and confidence.",
    ],
    refillStory:
      "Valentino’s sculptural bottle language is ideal for beauty rituals that last.",
    safetyStory:
      "Ultra can manage stronger amber and floral impressions through the Safety Passport.",
    luxurySignals: ["couture romance", "statement bottle design", "emotional luxury", "red-carpet energy"],
    relatedSlugs: ["ysl", "lancome", "prada"],
  },
  {
    slug: "mugler",
    route: "/brands/mugler",
    name: "Mugler",
    category: "Statement House",
    tagline: "Futuristic. Powerful. Distinctive.",
    intro:
      "Mugler fragrance is designed to stand out, not blend in.",
    heroStatement:
      "A house for unforgettable trail and high-impact scent identity.",
    description:
      "Angel and Alien are sculptural, intense, and instantly recognizable.",
    image: "/assets/brands/mugler-hero.png",
    signatureScents: [
      {
        name: "Angel",
        notes: ["patchouli", "praline", "red fruits"],
        mood: "Iconic, loud, and addictive.",
      },
      {
        name: "Alien",
        notes: ["jasmine", "amberwood", "white amber"],
        mood: "Mystical, luminous, and potent.",
      },
    ],
    olfactiveProfile: ["intense gourmand", "amber power", "high trail", "signature boldness"],
    ultraMatch: [
      "Best for users who want a strong personal signature.",
      "Matches dramatic styling and nighttime statements.",
    ],
    refillStory:
      "Mugler has a strong refill culture, making signature fragrance more sustainable over time.",
    safetyStory:
      "Ultra should be careful with higher-intensity formulations for sensitive users and offer lighter alternatives.",
    luxurySignals: ["futuristic identity", "high projection", "iconic bottles", "distinctive trail"],
    relatedSlugs: ["ysl", "valentino", "azzaro"],
  },
  {
    slug: "maison-margiela",
    route: "/brands/maison-margiela",
    name: "Maison Margiela",
    category: "Artistic & Niche",
    tagline: "Memory-led. Conceptual. Quietly powerful.",
    intro:
      "Replica fragrances are built around moments, places, and emotion.",
    heroStatement:
      "A house for people who love storytelling through scent.",
    description:
      "Replica creates atmospheric experiences that feel intimate and cinematic.",
    image: "/assets/brands/margiela-hero.png",
    signatureScents: [
      {
        name: "Replica Jazz Club",
        notes: ["rum", "tobacco", "vanilla"],
        mood: "Warm, smoky, and atmospheric.",
      },
      {
        name: "Replica Lazy Sunday Morning",
        notes: ["white musk", "iris", "pear"],
        mood: "Soft, clean, and comforting.",
      },
    ],
    olfactiveProfile: ["memory scent", "soft atmospheric", "conceptual", "skin-close"],
    ultraMatch: [
      "Best for users who want personality without loudness.",
      "Matches editorial, creative, and minimal style identities.",
    ],
    refillStory:
      "The storytelling-led nature of the line supports mindful ownership and curated use.",
    safetyStory:
      "Ultra can help users select lighter, skin-close profiles where projection sensitivity matters.",
    luxurySignals: ["narrative fragrance", "editorial luxury", "skin-close", "emotional memory"],
    relatedSlugs: ["lancome", "prada", "atelier-cologne"],
  },
  {
    slug: "viktor-rolf",
    route: "/brands/viktor-rolf",
    name: "Viktor&Rolf",
    category: "Statement House",
    tagline: "Playful. Floral. Dramatic.",
    intro:
      "A house that balances fantasy with sharp, memorable identity.",
    heroStatement:
      "A fragrance world with strong floral presence and high visual impact.",
    description:
      "Flowerbomb remains a modern icon for rich floral drama and instant recognition.",
    image: "/assets/brands/viktor-rolf-hero.png",
    signatureScents: [
      {
        name: "Flowerbomb",
        notes: ["jasmine", "orange blossom", "patchouli"],
        mood: "Opulent, floral, and memorable.",
      },
    ],
    olfactiveProfile: ["floral explosion", "dramatic", "women's signature", "high recall"],
    ultraMatch: [
      "Best for users who love floral presence with strong personality.",
      "Matches dressy, romantic, and evening styling.",
    ],
    refillStory:
      "A long-term signature scent like Flowerbomb supports refill and repeat-use behavior.",
    safetyStory:
      "Ultra can present softer floral alternatives if the profile is too intense for sensitivity.",
    luxurySignals: ["modern classic", "floral drama", "high recognizability", "gift friendly"],
    relatedSlugs: ["ysl", "lancome", "valentino"],
  },
  {
    slug: "azzaro",
    route: "/brands/azzaro",
    name: "Azzaro",
    category: "Statement House",
    tagline: "Confident. Charismatic. Energetic.",
    intro:
      "Azzaro fragrances bring strong social energy and approachable luxury.",
    heroStatement:
      "A house for momentum, charm, and bold everyday wear.",
    description:
      "Wanted and Azzaro Pour Homme offer versatile profiles with contemporary character.",
    image: "/assets/brands/azzaro-hero.png",
    signatureScents: [
      {
        name: "Wanted",
        notes: ["cardamom", "tonka", "amberwood"],
        mood: "Bold, warm, and crowd-pleasing.",
      },
      {
        name: "Azzaro Pour Homme",
        notes: ["lavender", "anise", "woods"],
        mood: "Classic masculine freshness.",
      },
    ],
    olfactiveProfile: ["masculine amber", "spicy freshness", "versatile", "easy confidence"],
    ultraMatch: [
      "Best for everyday wear, social settings, and energetic profiles.",
      "Matches users who want character without overcomplication.",
    ],
    refillStory:
      "Repeated-use signature scents are perfect candidates for refill adoption.",
    safetyStory:
      "Ultra can reduce overlap with stronger aromatic blends if user sensitivity is high.",
    luxurySignals: ["broad appeal", "charismatic identity", "masculine classics", "high versatility"],
    relatedSlugs: ["armani", "mugler", "ralph-lauren"],
  },
  {
    slug: "diesel",
    route: "/brands/diesel",
    name: "Diesel",
    category: "Statement House",
    tagline: "Urban. Youthful. Unapologetic.",
    intro:
      "Diesel fragrance speaks to contemporary street-luxury energy.",
    heroStatement:
      "A house for modern, casual, and expressive scent wearers.",
    description:
      "Built for a younger, more urban luxury audience with clear personality.",
    image: "/assets/brands/diesel-hero.png",
    signatureScents: [
      {
        name: "Signature line",
        notes: ["fresh woods", "amber", "spice"],
        mood: "Urban and modern.",
      },
    ],
    olfactiveProfile: ["youthful", "urban woods", "modern casual", "easy wear"],
    ultraMatch: [
      "Best for users who want everyday energy and modern edge.",
    ],
    refillStory:
      "A straightforward daily signature can support refill and repeat purchase behavior.",
    safetyStory:
      "Ultra can suggest softer options when strong synthetic accords need to be avoided.",
    luxurySignals: ["street luxury", "modern youth", "easy everyday", "contemporary"],
    relatedSlugs: ["azzaro", "ralph-lauren", "armani"],
  },
  {
    slug: "ralph-lauren",
    route: "/brands/ralph-lauren",
    name: "Ralph Lauren",
    category: "Statement House",
    tagline: "Classic. Polished. Lifestyle-led.",
    intro:
      "Ralph Lauren fragrance carries a classic American luxury mood.",
    heroStatement:
      "A house for clean, confident, lifestyle-driven fragrance.",
    description:
      "Polo and related lines sit in the space of classic sporting elegance and refined masculinity.",
    image: "/assets/brands/ralph-lauren-hero.png",
    signatureScents: [
      {
        name: "Polo collection",
        notes: ["woods", "aromatics", "fresh spice"],
        mood: "Classic, sporty, and polished.",
      },
    ],
    olfactiveProfile: ["sporty classic", "clean masculine", "lifestyle luxury", "easy confidence"],
    ultraMatch: [
      "Best for users who want familiar, polished, and easy-to-wear luxury.",
    ],
    refillStory:
      "Classic signatures benefit from repeat-use and refill efficiency.",
    safetyStory:
      "Ultra can surface cleaner, lighter options when dense aromatic blends are not ideal.",
    luxurySignals: ["American luxury", "classic identity", "lifestyle fragrance", "broad appeal"],
    relatedSlugs: ["armani", "azzaro", "prada"],
  },
  {
    slug: "atelier-cologne",
    route: "/brands/atelier-cologne",
    name: "Atelier Cologne",
    category: "Artistic & Niche",
    tagline: "Bright. Crafted. Refined.",
    intro:
      "Atelier Cologne is about high-end freshness with a craft-led edge.",
    heroStatement:
      "A house for elegant brightness and refined cologne expression.",
    description:
      "Cologne Absolues offer a clean, polished, and niche-feeling fragrance experience.",
    image: "/assets/brands/atelier-cologne-hero.png",
    signatureScents: [
      {
        name: "Cologne Absolues",
        notes: ["citrus", "woods", "aromatics"],
        mood: "Fresh, crafted, and elevated.",
      },
    ],
    olfactiveProfile: ["bright fresh", "crafted cologne", "niche polish", "clean modern"],
    ultraMatch: [
      "Best for users who love a bright but premium scent identity.",
    ],
    refillStory:
      "High-use fresh fragrances are natural candidates for refill strategy.",
    safetyStory:
      "Ultra can guide users with citrus sensitivity to alternatives that still feel fresh.",
    luxurySignals: ["niche freshness", "craft-led", "bright luxury", "elevated cologne"],
    relatedSlugs: ["maison-margiela", "prada", "armani"],
  },
];

export const brandBySlug = Object.fromEntries(
  brandRegistry.map((brand) => [brand.slug, brand])
) as Record<BrandSlug, BrandProfile>;