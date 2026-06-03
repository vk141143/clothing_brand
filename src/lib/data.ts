export type Saree = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  stock: number;
  fabric: string;
  color: string;
  colors: string[];
  images: string[];
  description: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;
};

export const CATEGORIES = [
  { slug: "silk", name: "Silk Sarees", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80" },
  { slug: "banarasi", name: "Banarasi Sarees", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80" },
  { slug: "kanjivaram", name: "Kanjivaram", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80" },
  { slug: "cotton", name: "Cotton Sarees", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80" },
  { slug: "linen", name: "Linen Sarees", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=400&q=80" },
  { slug: "designer", name: "Designer Sarees", image: "https://images.unsplash.com/photo-1610189020017-2da8f2e9c8b2?auto=format&fit=crop&w=400&q=80" },
  { slug: "bridal", name: "Bridal Sarees", image: "https://images.unsplash.com/photo-1622554894721-088e35d4b8c4?auto=format&fit=crop&w=400&q=80" },
  { slug: "party", name: "Party Wear", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b1f09?auto=format&fit=crop&w=400&q=80" },
  { slug: "handloom", name: "Handloom", image: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&w=400&q=80" },
  { slug: "printed", name: "Printed", image: "https://images.unsplash.com/photo-1619033552578-9c6f0b8d9a2e?auto=format&fit=crop&w=400&q=80" },
  { slug: "georgette", name: "Georgette", image: "https://images.unsplash.com/photo-1610189019983-1f4fd6f17f30?auto=format&fit=crop&w=400&q=80" },
  { slug: "chiffon", name: "Chiffon", image: "https://images.unsplash.com/photo-1583391733974-9b2c43d3df74?auto=format&fit=crop&w=400&q=80" },
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  silk: [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610189019929-da89c2c2e2ee?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1622554894721-088e35d4b8c4?auto=format&fit=crop&w=900&q=80",
  ],
  banarasi: [
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610189019929-da89c2c2e2ee?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1622554894721-088e35d4b8c4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
  ],
  kanjivaram: [
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1622554894721-088e35d4b8c4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610189019929-da89c2c2e2ee?auto=format&fit=crop&w=900&q=80",
  ],
  cotton: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1594387310672-d2f4b9e29c8d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1591375372226-1bdd44b5d8c2?auto=format&fit=crop&w=900&q=80",
  ],
  linen: [
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1591375372226-1bdd44b5d8c2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1594387310672-d2f4b9e29c8d?auto=format&fit=crop&w=900&q=80",
  ],
  designer: [
    "https://images.unsplash.com/photo-1610189020017-2da8f2e9c8b2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583391733974-9b2c43d3df74?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610189019983-1f4fd6f17f30?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1622554894721-088e35d4b8c4?auto=format&fit=crop&w=900&q=80",
  ],
  bridal: [
    "https://images.unsplash.com/photo-1622554894721-088e35d4b8c4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610189019929-da89c2c2e2ee?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
  ],
  party: [
    "https://images.unsplash.com/photo-1594938298603-c8148c4b1f09?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610189019983-1f4fd6f17f30?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583391733974-9b2c43d3df74?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1622554894721-088e35d4b8c4?auto=format&fit=crop&w=900&q=80",
  ],
  handloom: [
    "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583391733842-f0c7cce5e0a4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610189025210-3b2eb02bcce9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1594387310672-d2f4b9e29c8d?auto=format&fit=crop&w=900&q=80",
  ],
  printed: [
    "https://images.unsplash.com/photo-1619033552578-9c6f0b8d9a2e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610189025210-3b2eb02bcce9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583391733842-f0c7cce5e0a4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1594387310672-d2f4b9e29c8d?auto=format&fit=crop&w=900&q=80",
  ],
  georgette: [
    "https://images.unsplash.com/photo-1610189019983-1f4fd6f17f30?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1594387310672-d2f4b9e29c8d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583391733974-9b2c43d3df74?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1591375372226-1bdd44b5d8c2?auto=format&fit=crop&w=900&q=80",
  ],
  chiffon: [
    "https://images.unsplash.com/photo-1583391733974-9b2c43d3df74?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1591375372226-1bdd44b5d8c2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1610189019983-1f4fd6f17f30?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1594387310672-d2f4b9e29c8d?auto=format&fit=crop&w=900&q=80",
  ],
};

const NAMES = [
  "Royal Maharani", "Crimson Glow", "Midnight Bloom", "Golden Heritage", "Emerald Whisper",
  "Pearl Cascade", "Sapphire Dreams", "Ivory Elegance", "Ruby Tradition", "Velvet Sunset",
  "Lotus Bloom", "Saffron Silk", "Indigo Weave", "Coral Reverie", "Mehndi Magic",
  "Banaras Splendor", "Mysore Glory", "Chanderi Charm", "Paithani Pride", "Kashi Classic",
];

const FABRICS = ["Pure Silk", "Banarasi Silk", "Kanjivaram Silk", "Cotton", "Linen", "Georgette", "Chiffon", "Organza"];
const COLORS = ["Red", "Maroon", "Navy", "Gold", "Emerald", "Ivory", "Royal Blue", "Coral", "Black", "Pink"];

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const SAREES: Saree[] = Array.from({ length: 48 }, (_, i) => {
  const cat = CATEGORIES[i % CATEGORIES.length];
  const name = `${NAMES[i % NAMES.length]} ${cat.name.split(" ")[0]}`;
  const originalPrice = Math.round(3000 + rand(i + 1) * 25000);
  const discount = Math.round(10 + rand(i + 2) * 50);
  const price = Math.round(originalPrice * (1 - discount / 100));
  const stock = Math.floor(rand(i + 3) * 25);
  const categoryImages = CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES.silk;
  const imgStart = Math.floor(i / CATEGORIES.length) % categoryImages.length;
  return {
    id: `sar-${i + 1}`,
    name,
    slug: `${name.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
    category: cat.slug,
    price,
    originalPrice,
    discount,
    rating: Math.round((3.5 + rand(i + 4) * 1.5) * 10) / 10,
    reviewCount: Math.floor(20 + rand(i + 5) * 800),
    stock,
    fabric: FABRICS[i % FABRICS.length],
    color: COLORS[i % COLORS.length],
    colors: [COLORS[i % COLORS.length], COLORS[(i + 3) % COLORS.length], COLORS[(i + 5) % COLORS.length]],
    images: [
      categoryImages[imgStart],
      categoryImages[(imgStart + 1) % categoryImages.length],
      categoryImages[(imgStart + 2) % categoryImages.length],
      categoryImages[(imgStart + 3) % categoryImages.length],
    ],
    description: `Exquisite ${cat.name.toLowerCase()} hand-crafted by master weavers. Features intricate zari work, lustrous finish, and timeless motifs that celebrate India's rich textile heritage. Perfect for weddings, festivals, and grand occasions.`,
    tags: ["wedding", "festival", "party"].slice(0, 1 + (i % 3)),
    isNew: i % 5 === 0,
    isBestSeller: i % 4 === 0,
    isLimited: i % 7 === 0,
  };
});

export function getSaree(id: string) {
  return SAREES.find((s) => s.id === id || s.slug === id);
}

export function getByCategory(slug: string) {
  return SAREES.filter((s) => s.category === slug);
}

export const TESTIMONIALS = [
  { name: "Priya Sharma", city: "Mumbai", text: "The Kanjivaram I ordered for my wedding was breathtaking. Quality beyond expectations!", rating: 5, avatar: "https://i.pravatar.cc/100?img=47" },
  { name: "Anjali Verma", city: "Delhi", text: "Beautiful sarees, fast delivery, and the packaging felt truly premium. Will shop again.", rating: 5, avatar: "https://i.pravatar.cc/100?img=49" },
  { name: "Meera Iyer", city: "Bangalore", text: "Authentic handloom pieces at a fair price. CraftMySarees has become my go-to.", rating: 5, avatar: "https://i.pravatar.cc/100?img=44" },
  { name: "Kavita Reddy", city: "Hyderabad", text: "Loved the Banarasi collection — the zari work is exquisite. Highly recommended!", rating: 5, avatar: "https://i.pravatar.cc/100?img=45" },
];

export const HERO_SLIDES = [
  {
    title: "Bridal Couture 2026",
    subtitle: "Heirloom Kanjivarams woven for your forever moment",
    cta: "Shop Bridal",
    href: "/category/bridal",
    image: "https://images.unsplash.com/photo-1622554894721-088e35d4b8c4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Banarasi Heritage",
    subtitle: "Pure silk · Real zari · Hand-loomed in Varanasi",
    cta: "Explore Banarasi",
    href: "/category/banarasi",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Festive Edit",
    subtitle: "Up to 60% off on designer & party wear sarees",
    cta: "Shop the Edit",
    href: "/shop",
    image: "https://images.unsplash.com/photo-1610189019983-1f4fd6f17f30?auto=format&fit=crop&w=1600&q=80",
  },
];
