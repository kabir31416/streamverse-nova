import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { fetchChannelsFromM3U, fetchIptvData } from "@/lib/iptv/api";
import type { Channel } from "@/lib/iptv/types";

export function useIptv() {
  return useQuery({
    queryKey: ["iptv", "all"],
    queryFn: async () => {
      try {
        return await fetchIptvData();
      } catch (e) {
        console.warn("IPTV API failed, falling back to M3U", e);
        const channels = await fetchChannelsFromM3U();
        return { channels, categories: [], countries: [] };
      }
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });
}

export function useChannel(id: string | undefined) {
  const { data, ...rest } = useIptv();
  const channel = data?.channels.find((c) => c.id === id);
  return { channel, ...rest };
}

const FAV_KEY = "sv:favorites";
const RECENT_KEY = "sv:recent";

function readLS(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => setIds(readLS(FAV_KEY)), []);
  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);
  return { ids, toggle, has };
}

export function useRecent() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => setIds(readLS(RECENT_KEY)), []);
  const push = useCallback((id: string) => {
    setIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 20);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return { ids, push };
}

export type { Channel };
