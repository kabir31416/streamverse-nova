export type Channel = {
  id: string;
  name: string;
  category: string;
  country: string;
  flag: string;
  language: string;
  hd: boolean;
  logo: string;
  description: string;
  viewers: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  count: number;
};

export const categories: Category[] = [
  { id: "bd", name: "Bangladesh TV", icon: "🇧🇩", gradient: "from-emerald-500 to-teal-700", count: 42 },
  { id: "sports", name: "Sports", icon: "⚽", gradient: "from-orange-500 to-red-600", count: 86 },
  { id: "news", name: "News", icon: "📰", gradient: "from-blue-500 to-indigo-700", count: 124 },
  { id: "ent", name: "Entertainment", icon: "🎭", gradient: "from-pink-500 to-rose-600", count: 210 },
  { id: "movies", name: "Movies", icon: "🎬", gradient: "from-purple-500 to-fuchsia-700", count: 156 },
  { id: "music", name: "Music", icon: "🎵", gradient: "from-cyan-500 to-blue-700", count: 64 },
  { id: "kids", name: "Kids", icon: "🧸", gradient: "from-yellow-400 to-orange-500", count: 38 },
  { id: "intl", name: "International", icon: "🌍", gradient: "from-green-500 to-emerald-700", count: 312 },
];

const make = (i: number, name: string, category: string, country: string, flag: string, lang = "English"): Channel => ({
  id: `ch-${i}`,
  name,
  category,
  country,
  flag,
  language: lang,
  hd: i % 3 !== 0,
  logo: `https://picsum.photos/seed/${name.replace(/\s/g, "")}/200/200`,
  description: `${name} broadcasts premium ${category.toLowerCase()} content 24/7 with the best quality streaming.`,
  viewers: `${(Math.random() * 50 + 5).toFixed(1)}K`,
});

export const channels: Channel[] = [
  make(1, "ESPN HD", "Sports", "USA", "🇺🇸"),
  make(2, "Sky Sports F1", "Sports", "UK", "🇬🇧"),
  make(3, "BeIN Sports", "Sports", "Qatar", "🇶🇦", "Arabic"),
  make(4, "BBC News", "News", "UK", "🇬🇧"),
  make(5, "CNN International", "News", "USA", "🇺🇸"),
  make(6, "Al Jazeera", "News", "Qatar", "🇶🇦", "English"),
  make(7, "HBO Max", "Movies", "USA", "🇺🇸"),
  make(8, "Star Movies", "Movies", "India", "🇮🇳", "Hindi"),
  make(9, "Cartoon Network", "Kids", "USA", "🇺🇸"),
  make(10, "Nickelodeon", "Kids", "USA", "🇺🇸"),
  make(11, "MTV Live", "Music", "USA", "🇺🇸"),
  make(12, "VH1 Classic", "Music", "USA", "🇺🇸"),
  make(13, "Channel i", "Entertainment", "Bangladesh", "🇧🇩", "Bengali"),
  make(14, "NTV Bangla", "Entertainment", "Bangladesh", "🇧🇩", "Bengali"),
  make(15, "Maasranga TV", "Entertainment", "Bangladesh", "🇧🇩", "Bengali"),
  make(16, "Gazi TV", "Sports", "Bangladesh", "🇧🇩", "Bengali"),
  make(17, "Discovery HD", "Entertainment", "USA", "🇺🇸"),
  make(18, "National Geographic", "Entertainment", "USA", "🇺🇸"),
  make(19, "Fox Sports", "Sports", "USA", "🇺🇸"),
  make(20, "TNT Movies", "Movies", "USA", "🇺🇸"),
  make(21, "Disney Channel", "Kids", "USA", "🇺🇸"),
  make(22, "France 24", "News", "France", "🇫🇷", "French"),
  make(23, "DW Deutsch", "News", "Germany", "🇩🇪", "German"),
  make(24, "NHK World", "News", "Japan", "🇯🇵", "Japanese"),
];

export const featured = {
  id: "feat-1",
  title: "FIFA World Cup 2026: Live Final",
  channel: "ESPN HD",
  category: "Sports",
  description:
    "Don't miss the most anticipated football final of the decade. Live from MetLife Stadium with multi-angle coverage and instant replays.",
  image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=80",
  viewers: "2.4M",
};

export const continueWatching = channels.slice(0, 6).map((c, i) => ({
  ...c,
  progress: [78, 32, 56, 12, 90, 45][i],
}));
