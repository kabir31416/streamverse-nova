import type {
  Channel,
  IptvCategory,
  IptvCountry,
  RawChannel,
  RawLogo,
  RawStream,
} from "./types";

const BASE = "https://iptv-org.github.io/api";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}

function codeToFlag(code: string): string {
  // Monochrome design: render the ISO country code instead of an emoji flag.
  if (!code) return "—";
  return code.toUpperCase();
}

let memoryCache: Channel[] | null = null;
let categoriesCache: IptvCategory[] | null = null;
let countriesCache: IptvCountry[] | null = null;

export async function fetchIptvData(): Promise<{
  channels: Channel[];
  categories: IptvCategory[];
  countries: IptvCountry[];
}> {
  if (memoryCache && categoriesCache && countriesCache) {
    return { channels: memoryCache, categories: categoriesCache, countries: countriesCache };
  }

  const [rawChannels, rawStreams, rawLogos, rawCategories, rawCountries] = await Promise.all([
    getJSON<RawChannel[]>(`${BASE}/channels.json`),
    getJSON<RawStream[]>(`${BASE}/streams.json`),
    getJSON<RawLogo[]>(`${BASE}/logos.json`),
    getJSON<IptvCategory[]>(`${BASE}/categories.json`),
    getJSON<IptvCountry[]>(`${BASE}/countries.json`),
  ]);

  // Build stream map: prefer feed === null (main feed), keep alternates
  const streamMap = new Map<string, RawStream[]>();
  for (const s of rawStreams) {
    if (!s.channel || !s.url) continue;
    if (!/^https?:\/\//i.test(s.url)) continue;
    const arr = streamMap.get(s.channel) ?? [];
    arr.push(s);
    streamMap.set(s.channel, arr);
  }

  // Logo map
  const logoMap = new Map<string, string>();
  for (const l of rawLogos) {
    if (!logoMap.has(l.channel)) logoMap.set(l.channel, l.url);
  }

  const countryMap = new Map(rawCountries.map((c) => [c.code, c]));

  const channels: Channel[] = [];
  for (const ch of rawChannels) {
    if (ch.closed || ch.replaced_by || ch.is_nsfw) continue;
    const streams = streamMap.get(ch.id);
    if (!streams || streams.length === 0) continue;

    // Prefer feed null, then any
    streams.sort((a, b) => {
      const af = a.feed ? 1 : 0;
      const bf = b.feed ? 1 : 0;
      return af - bf;
    });

    const primary = streams[0];
    const country = countryMap.get(ch.country);
    const cats = ch.categories?.length ? ch.categories : ["general"];

    channels.push({
      id: ch.id,
      name: ch.name,
      logo: ch.logo || logoMap.get(ch.id) || "",
      country: ch.country,
      countryName: country?.name ?? ch.country,
      flag: country?.flag ?? codeToFlag(ch.country),
      categories: cats,
      category: cats[0],
      languages: country?.languages ?? [],
      language: country?.languages?.[0] ?? "",
      streamUrl: primary.url,
      alternateStreams: streams.slice(1).map((s) => s.url),
      hd: /hd|1080|720/i.test(primary.quality ?? "") || /HD/.test(ch.name),
      isLive: true,
      description: `${ch.name} — live ${cats[0]} channel from ${country?.name ?? ch.country}.`,
      viewers: `${(Math.random() * 40 + 2).toFixed(1)}K`,
    });
  }

  memoryCache = channels;
  categoriesCache = rawCategories;
  countriesCache = rawCountries;

  return { channels, categories: rawCategories, countries: rawCountries };
}

export async function fetchChannelsFromM3U(): Promise<Channel[]> {
  // Fallback parser for IPTV-org index.m3u
  const res = await fetch("https://iptv-org.github.io/iptv/index.m3u");
  if (!res.ok) throw new Error("Failed to fetch index.m3u");
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  const out: Channel[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("#EXTINF")) continue;
    const url = lines[i + 1]?.trim();
    if (!url || !/^https?:\/\//i.test(url)) continue;
    const nameMatch = line.match(/,(.+)$/);
    const idMatch = line.match(/tvg-id="([^"]*)"/);
    const logoMatch = line.match(/tvg-logo="([^"]*)"/);
    const countryMatch = line.match(/tvg-country="([^"]*)"/);
    const groupMatch = line.match(/group-title="([^"]*)"/);
    const id = idMatch?.[1] || `m3u-${i}`;
    const name = nameMatch?.[1]?.trim() || id;
    const country = (countryMatch?.[1] || "INT").split(";")[0];
    out.push({
      id,
      name,
      logo: logoMatch?.[1] || "",
      country,
      countryName: country,
      flag: codeToFlag(country),
      categories: [groupMatch?.[1] || "general"],
      category: groupMatch?.[1] || "general",
      languages: [],
      language: "",
      streamUrl: url,
      alternateStreams: [],
      hd: /HD/i.test(name),
      isLive: true,
      description: `${name} live channel.`,
      viewers: `${(Math.random() * 20 + 1).toFixed(1)}K`,
    });
  }
  return out;
}
