import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Maximize, PictureInPicture2,
  Settings, Heart, Share2, Search,
} from "lucide-react";
import { channels } from "@/lib/iptv-data";
import { ChannelCard } from "@/components/ChannelCard";

export const Route = createFileRoute("/watch/$id")({
  component: WatchPage,
});

function WatchPage() {
  const { id } = Route.useParams();
  const channel = channels.find((c) => c.id === id);
  if (!channel) throw notFound();

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [quality, setQuality] = useState("Auto");
  const [q, setQ] = useState("");

  const similar = channels.filter((c) => c.category === channel.category && c.id !== channel.id).slice(0, 8);
  const sideList = channels.filter((c) =>
    c.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {/* PLAYER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl"
          >
            <img src={channel.logo} alt={channel.name} className="h-full w-full object-cover opacity-50 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Loading shimmer when toggling */}
            {!playing && (
              <div className="absolute inset-0 grid place-items-center">
                <button
                  onClick={() => setPlaying(true)}
                  className="grid h-20 w-20 place-items-center rounded-full gradient-primary glow-cyan transition-transform hover:scale-110"
                >
                  <Play className="h-8 w-8 text-background" fill="currentColor" />
                </button>
              </div>
            )}

            {/* Live badge */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--live)] px-2.5 py-1 text-[11px] font-bold uppercase text-white animate-pulse-live">
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
              </span>
              <span className="rounded-full glass px-2.5 py-1 text-[11px] font-medium">
                {channel.viewers} watching
              </span>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5">
                <IconBtn onClick={() => setPlaying(!playing)}>
                  {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
                </IconBtn>
                <IconBtn onClick={() => setMuted(!muted)}>
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </IconBtn>
                <div className="h-1 flex-1 rounded-full bg-white/20">
                  <div className="h-full w-1/3 rounded-full gradient-primary" />
                </div>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="rounded-md bg-transparent text-xs outline-none"
                >
                  {["Auto", "1080p", "720p", "480p"].map((q) => (
                    <option key={q} value={q} className="bg-surface text-foreground">
                      {q}
                    </option>
                  ))}
                </select>
                <IconBtn><PictureInPicture2 className="h-4 w-4" /></IconBtn>
                <IconBtn><Settings className="h-4 w-4" /></IconBtn>
                <IconBtn><Maximize className="h-4 w-4" /></IconBtn>
              </div>
            </div>
          </motion.div>

          {/* Channel info */}
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <img src={channel.logo} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold">{channel.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {channel.flag} {channel.country} · {channel.category} · {channel.language}
                  {channel.hd && <span className="ml-2 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">HD</span>}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium hover:text-primary">
                <Heart className="h-4 w-4" /> Favorite
              </button>
              <button className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium hover:text-primary">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-muted-foreground">{channel.description}</p>

          {/* Similar */}
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold">Similar Channels</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {similar.map((c) => (
                <ChannelCard key={c.id} channel={c} />
              ))}
            </div>
          </section>
        </div>

        {/* Side list */}
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
                  <img src={c.logo} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.flag} {c.category}</div>
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

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full text-foreground/80 hover:bg-white/10 hover:text-primary"
    >
      {children}
    </button>
  );
}
