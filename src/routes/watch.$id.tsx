import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, TrendingUp, Loader2 } from "lucide-react";
import { useChannel, useFavorites, useIptv, useRecent } from "@/hooks/useIptv";
import { ChannelCard } from "@/components/ChannelCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Heart, Share2 } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/watch/$id")({
  component: WatchPage,
});

function WatchPage() {
  const { id } = Route.useParams();
  const { channel, isLoading } = useChannel(id);
  const { data } = useIptv();
  const { has, toggle } = useFavorites();
  const { push } = useRecent();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (channel) push(channel.id);
  }, [channel?.id]);

  const channels = data?.channels ?? [];

  const similar = useMemo(() => {
    if (!channel) return [];
    return channels
      .filter((c) => c.id !== channel.id && c.categories.some((x) => channel.categories.includes(x)))
      .slice(0, 8);
  }, [channel, channels]);

  const sideList = useMemo(() => {
    const base = q.trim()
      ? channels.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      : channels;
    return base.slice(0, 80);
  }, [q, channels]);

  if (isLoading) {
    return (
      <div className="grid place-items-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="grid place-items-center py-32 text-center">
        <p className="text-muted-foreground">Channel not found.</p>
        <Link to="/live" className="mt-4 text-primary hover:underline">
          Browse Live TV →
        </Link>
      </div>
    );
  }

  const goNext = () => {
    const idx = channels.findIndex((c) => c.id === channel.id);
    const next = channels[(idx + 1) % channels.length];
    if (next) navigate({ to: "/watch/$id", params: { id: next.id } });
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
            <VideoPlayer
              src={channel.streamUrl}
              alternates={channel.alternateStreams}
              poster={channel.logo}
              onNext={goNext}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              {channel.logo ? (
                <img src={channel.logo} alt="" className="h-16 w-16 shrink-0 rounded-xl bg-secondary object-contain p-1" />
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-xl bg-secondary" />
              )}
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold">{channel.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {channel.flag} {channel.countryName} · {channel.category}
                  {channel.language && ` · ${channel.language}`}
                  {channel.hd && (
                    <span className="ml-2 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                      HD
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggle(channel.id)}
                className={`inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium hover:text-primary ${
                  has(channel.id) ? "text-primary" : ""
                }`}
              >
                <Heart className="h-4 w-4" fill={has(channel.id) ? "currentColor" : "none"} />
                {has(channel.id) ? "Favorited" : "Favorite"}
              </button>
              <button
                onClick={() => navigator.share?.({ title: channel.name, url: location.href }).catch(() => {})}
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium hover:text-primary"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-muted-foreground">{channel.description}</p>

          {similar.length > 0 && (
            <section className="mt-10">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Similar Channels</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {similar.map((c) => (
                  <ChannelCard key={c.id} channel={c} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start">
          <div className="glass rounded-2xl p-4">
            <div className="mb-3 flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search channels..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="scrollbar-hide max-h-[60vh] space-y-1 overflow-y-auto pr-1">
              {sideList.map((c) => (
                <Link
                  key={c.id}
                  to="/watch/$id"
                  params={{ id: c.id }}
                  className={`flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/60 ${
                    c.id === channel.id ? "bg-primary/10" : ""
                  }`}
                >
                  {c.logo ? (
                    <img src={c.logo} alt="" className="h-10 w-10 rounded-md bg-secondary object-contain p-0.5" />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.flag} {c.category}
                    </div>
                  </div>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--live)] animate-pulse-live" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
