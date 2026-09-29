import sunshine from "@/assets/twispp-sunshine.jpg.asset.json";
import colourPop from "@/assets/twispp-colour-pop.jpg.asset.json";
import wildflower from "@/assets/twispp-hero.jpg.asset.json";
import flowerPot from "@/assets/twispp-flower-pot.jpg.asset.json";

export type Mood =
  | "for-your-crush"
  | "for-your-bestie"
  | "birthday"
  | "just-because"
  | "i-miss-you"
  | "thank-you"
  | "surprise-them"
  | "for-yourself";

export type Category = "bouquets" | "flower-pots" | "baskets" | "charms" | "gifts";

export interface Product {
  slug: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  details: string[];
  category: Category;
  moods: Mood[];
  bestSeller: boolean;
  images: [string, ...string[]];
  aspect: "tall" | "square" | "wide";
}

export const moods: { id: Mood; label: string; note: string }[] = [
  { id: "for-your-crush", label: "For your crush", note: "Say it without saying it" },
  { id: "for-your-bestie", label: "For your bestie", note: "Your person deserves this" },
  { id: "birthday", label: "Birthday", note: "Better than a cake photo" },
  { id: "just-because", label: "Just because", note: "A good enough reason" },
  { id: "i-miss-you", label: "I miss you", note: "For the far-away ones" },
  { id: "thank-you", label: "Thank you", note: "Two words, handmade" },
  { id: "surprise-them", label: "Surprise them", note: "Left on their desk" },
  { id: "for-yourself", label: "For yourself", note: "Yes, really" },
];

export const categories: { id: "all" | Category | "best-sellers"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "bouquets", label: "Bouquets" },
  { id: "flower-pots", label: "Flower Pots" },
  { id: "baskets", label: "Baskets" },
  { id: "charms", label: "Charms" },
  { id: "gifts", label: "Gifts" },
  { id: "best-sellers", label: "Best Sellers" },
];

// Product data lives here so it is easy to edit or later move into the database.
// Prices are placeholders until confirmed.
export const products: Product[] = [
  {
    slug: "sunshine-bouquet",
    name: "Sunshine Bouquet",
    price: 899,
    tagline: "Sunflowers that never droop.",
    description:
      "Handmade sunflowers and tiny daisies, wrapped in kraft paper and tied with a jute bow. Made to sit on a desk and quietly cheer someone up.",
    details: [
      "Handmade, one piece at a time",
      "Wrapped and ready to gift",
      "Every piece is slightly unique",
    ],
    category: "bouquets",
    moods: ["birthday", "thank-you", "just-because", "surprise-them"],
    bestSeller: true,
    images: [sunshine.url],
    aspect: "tall",
  },
  {
    slug: "colour-pop-bouquet",
    name: "Colour Pop Bouquet",
    price: 999,
    tagline: "Tiny flowers. Big feelings.",
    description:
      "Tulips, daisies and little blossoms in blue, coral, purple and yellow, finished with a blush wrap and satin ribbon.",
    details: [
      "Handmade, one piece at a time",
      "Blush wrap with satin ribbon",
      "Every piece is slightly unique",
    ],
    category: "bouquets",
    moods: ["for-your-crush", "for-your-bestie", "birthday", "surprise-them"],
    bestSeller: true,
    images: [colourPop.url],
    aspect: "tall",
  },
  {
    slug: "wildflower-mix-bouquet",
    name: "Wildflower Mix Bouquet",
    price: 1099,
    tagline: "A whole meadow, handmade.",
    description:
      "Our fullest mix — sunflowers, lavender sprigs, daisies and little wild blooms, gathered in soft tissue with a raffia tie.",
    details: [
      "Our largest handmade mix",
      "Soft tissue wrap, raffia tie",
      "Every piece is slightly unique",
    ],
    category: "bouquets",
    moods: ["i-miss-you", "thank-you", "surprise-them", "for-your-crush"],
    bestSeller: false,
    images: [wildflower.url],
    aspect: "wide",
  },
  {
    slug: "happy-flower-pot",
    name: "Happy Little Flower Pot",
    price: 549,
    tagline: "A small pot with a smiley face.",
    description:
      "Three handmade blooms in a scalloped ceramic pot with a tiny smile on it. Small enough for a study table, cheerful enough to notice every day.",
    details: [
      "Handmade blooms in a ceramic pot",
      "Fits on a desk or shelf",
      "Every piece is slightly unique",
    ],
    category: "flower-pots",
    moods: ["for-your-bestie", "for-yourself", "just-because", "birthday"],
    bestSeller: true,
    images: [flowerPot.url],
    aspect: "square",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatINR(value: number) {
  return "₹" + value.toLocaleString("en-IN");
}
