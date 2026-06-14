import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, ArrowLeft, Heart, Share2, Radio, ChevronUp, ChevronDown } from "lucide-react";
import { useChannel, useFavorites, useIptv, useRecent } from "@/hooks/useIptv";
import { ChannelCard } from "@/components/ChannelCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (channel) push(channel.id);
  }, [channel?.id]);

  const channels = data?.channels ?? [];

  const similar = useMemo(() => {
    if (!channel) return [];
    return channels
      .filter((c) => c.id !== channel.id && c.categories.some((x) => channel.categories.includes(x)))
      .slice(0, 12);
  }, [channel, channels]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-black">
        <Loader2 className="h-10 w-10 animate-spin text-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-center">
        <div>
          <p className="text-muted-foreground">Channel not found.</p>
          <Link to="/live" className="mt-4 inline-block text-foreground underline">
            Browse Live TV →
          </Link>
        </div>
      </div>
    );
  }

  const goNext = () => {
    const idx = channels.findIndex((c) => c.id === channel.id);
    const next = channels[(idx + 1) % channels.length];
    if (next) navigate({ to: "/watch/$id", params: { id: next.id } });
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Full-bleed cinematic player */}
      <div className="relative h-[100svh] w-full">
        <VideoPlayer
          src={channel.streamUrl}
          alternates={channel.alternateStreams}
          poster={channel.logo}
          onNext={goNext}
        />

        {/* Top gradient overlay with back + title */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
          <div className="pointer-events-auto flex items-start justify-between gap-4">
            <Link
              to="/live"
              className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-2 text-sm font-medium text-foreground hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 sm:flex">
              {channel.logo ? (
                <img src={channel.logo} alt="" className="h-9 w-9 shrink-0 rounded-md bg-white/5 object-contain p-1" />
              ) : null}
              <div className="min-w-0 text-center">
                <div className="truncate text-sm font-semibold">{channel.name}</div>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                  <Radio className="h-3 w-3 text-foreground animate-pulse-live" />
                  <span className="font-semibold tracking-widest text-foreground">LIVE</span>
                  <span>·</span>
                  <span>{channel.flag} {channel.category}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => toggle(channel.id)}
                aria-label="Favorite"
                className={`grid h-10 w-10 place-items-center rounded-full glass hover:bg-white/10 ${
                  has(channel.id) ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <Heart className="h-4 w-4" fill={has(channel.id) ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => navigator.share?.({ title: channel.name, url: location.href }).catch(() => {})}
                aria-label="Share"
                className="grid h-10 w-10 place-items-center rounded-full glass text-muted-foreground hover:bg-white/10 hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom toggle to reveal channels panel */}
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
          <button
            onClick={() => setShowPanel((s) => !s)}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-foreground hover:bg-white/10"
          >
            {showPanel ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            {showPanel ? "Hide channels" : "Browse channels"}
          </button>
        </div>
      </div>

      {/* Slide-up channels panel (revealed only on demand) */}
      <AnimatePresence>
        {showPanel && (
          <motion.section
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8"
          >
            <h2 className="mb-4 text-xl font-bold">Similar Channels</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {similar.map((c) => (
                <ChannelCard key={c.id} channel={c} />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
