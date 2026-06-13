export type Channel = {
  id: string;
  name: string;
  logo: string;
  country: string;
  countryName: string;
  flag: string;
  categories: string[];
  category: string;
  languages: string[];
  language: string;
  streamUrl: string;
  alternateStreams: string[];
  hd: boolean;
  isLive: boolean;
  description: string;
  viewers: string;
};

export type IptvCategory = { id: string; name: string };
export type IptvCountry = { code: string; name: string; flag: string; languages: string[] };

export type RawChannel = {
  id: string;
  name: string;
  alt_names?: string[];
  network?: string | null;
  owners?: string[];
  country: string;
  subdivision?: string | null;
  city?: string | null;
  categories: string[];
  is_nsfw?: boolean;
  launched?: string | null;
  closed?: string | null;
  replaced_by?: string | null;
  website?: string | null;
  logo?: string;
};

export type RawStream = {
  channel: string | null;
  feed?: string | null;
  title?: string;
  url: string;
  referrer?: string | null;
  user_agent?: string | null;
  quality?: string | null;
};

export type RawLogo = {
  channel: string;
  feed?: string | null;
  tags?: string[];
  width?: number;
  height?: number;
  format?: string;
  url: string;
};
