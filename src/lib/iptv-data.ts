// Curated UI category tiles. `iptvId` maps to IPTV-org category id.
// `country` filters by country code instead of category when set.
import type { LucideIcon } from "lucide-react";
import { Globe, Trophy, Newspaper, Drama, Film, Music, Baby, Tv } from "lucide-react";

export type CategoryTile = {
  id: string;
  name: string;
  icon: LucideIcon;
  gradient: string;
  iptvId?: string;
  country?: string;
};

export const categoryTiles: CategoryTile[] = [
  { id: "bd", name: "Bangladesh TV", icon: Globe, gradient: "from-neutral-700 to-neutral-900", country: "BD" },
  { id: "sports", name: "Sports", icon: Trophy, gradient: "from-neutral-600 to-neutral-900", iptvId: "sports" },
  { id: "news", name: "News", icon: Newspaper, gradient: "from-neutral-700 to-black", iptvId: "news" },
  { id: "entertainment", name: "Entertainment", icon: Drama, gradient: "from-neutral-600 to-neutral-900", iptvId: "entertainment" },
  { id: "movies", name: "Movies", icon: Film, gradient: "from-neutral-700 to-black", iptvId: "movies" },
  { id: "music", name: "Music", icon: Music, gradient: "from-neutral-600 to-neutral-900", iptvId: "music" },
  { id: "kids", name: "Kids", icon: Baby, gradient: "from-neutral-700 to-neutral-900", iptvId: "kids" },
  { id: "general", name: "General", icon: Tv, gradient: "from-neutral-700 to-black", iptvId: "general" },
];

// Hero banner is static content overlaying real channel data.
export const featured = {
  title: "Cinema, Live. Reimagined.",
  channel: "BongoTV",
  category: "Featured",
  description:
    "A premium, minimal home for live television. Thousands of free channels — sports, news, movies, music — curated in cinematic monochrome.",
  image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=80",
  viewers: "2.4M",
};

export type { Channel } from "@/lib/iptv/types";
