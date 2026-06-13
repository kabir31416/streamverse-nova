// Curated UI category tiles. `iptvId` maps to IPTV-org category id.
// `country` filters by country code instead of category when set.
export type CategoryTile = {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  iptvId?: string;
  country?: string;
};

export const categoryTiles: CategoryTile[] = [
  { id: "bd", name: "Bangladesh TV", icon: "🇧🇩", gradient: "from-emerald-500 to-teal-700", country: "BD" },
  { id: "sports", name: "Sports", icon: "⚽", gradient: "from-orange-500 to-red-600", iptvId: "sports" },
  { id: "news", name: "News", icon: "📰", gradient: "from-blue-500 to-indigo-700", iptvId: "news" },
  { id: "entertainment", name: "Entertainment", icon: "🎭", gradient: "from-pink-500 to-rose-600", iptvId: "entertainment" },
  { id: "movies", name: "Movies", icon: "🎬", gradient: "from-purple-500 to-fuchsia-700", iptvId: "movies" },
  { id: "music", name: "Music", icon: "🎵", gradient: "from-cyan-500 to-blue-700", iptvId: "music" },
  { id: "kids", name: "Kids", icon: "🧸", gradient: "from-yellow-400 to-orange-500", iptvId: "kids" },
  { id: "general", name: "General", icon: "📺", gradient: "from-slate-500 to-slate-700", iptvId: "general" },
];

// Hero banner is static content overlaying real channel data.
export const featured = {
  title: "Live Television, Reimagined",
  channel: "StreamVerse",
  category: "Featured",
  description:
    "Watch thousands of free live channels from around the world — sports, news, movies, music and more. Powered by the open IPTV-org community.",
  image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=80",
  viewers: "2.4M",
};

export type { Channel } from "@/lib/iptv/types";
