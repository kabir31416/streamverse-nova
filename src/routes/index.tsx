import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Info, Tv, Sparkles, Loader2 } from "lucide-react";
import { categoryTiles, featured } from "@/lib/iptv-data";
import { ChannelCard } from "@/components/ChannelCard";
import { ChannelRow } from "@/components/ChannelRow";
import { useIptv, useRecent } from "@/hooks/useIptv";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BongoTV — Watch Live TV, Sports, Movies & More" },
      { name: "description", content: "Stream thousands of live channels in HD across sports, movies, news, kids and international categories." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data, isLoading } = useIptv();
  const { ids: recentIds } = useRecent();
  const channels = data?.channels ?? [];

  const sports = channels.filter((c) => c.categories.includes("sports")).slice(0, 12);
  const news = channels.filter((c) => c.categories.includes("news")).slice(0, 12);
  const trending = channels.slice(0, 12);
  const recommended = channels.slice(12, 22);
  const recent = recentIds
    .map((id) => channels.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const heroChannel = sports[0] ?? channels[0];

  return (
    <div className="space-y-12 pb-12">
      {/* HERO */}
      <section className="relative mx-4 overflow-hidden rounded-3xl sm:mx-6 lg:mx-8">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="relative h-[60vh] min-h-[420px] w-full"
        >
          <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14"
        >
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--live)] px-3 py-1 text-xs font-bold uppercase text-white animate-pulse-live">
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live Now
              </span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {heroChannel?.name ?? featured.channel} · {featured.viewers} watching
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {featured.title}
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">{featured.description}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              {heroChannel && (
                <Link
                  to="/watch/$id"
                  params={{ id: heroChannel.id }}
                  className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 font-semibold text-background glow-cyan transition-transform hover:scale-105"
                >
                  <Play className="h-4 w-4" fill="currentColor" /> Watch Now
                </Link>
              )}
              <Link
                to="/live"
                className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-semibold transition-colors hover:bg-secondary"
              >
                <Info className="h-4 w-4" /> Browse All
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="space-y-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Tv className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold sm:text-2xl">Browse Live Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
          {categoryTiles.map((cat, i) => {
            const count = channels.filter((c) =>
              cat.country ? c.country === cat.country : c.categories.includes(cat.iptvId!),
            ).length;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.03 }}
              >
                <Link
                  to="/category/$slug"
                  params={{ slug: cat.id }}
                  className={`group relative block aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} p-4`}
                >
                  <div className="absolute inset-0 bg-background/10 transition-opacity group-hover:bg-background/0" />
                  <div className="relative flex h-full flex-col justify-between">
                    <cat.icon className="h-7 w-7 text-white" strokeWidth={1.75} />
                    <div>
                      <div className="font-bold leading-tight text-white">{cat.name}</div>
                      <div className="text-xs text-white/80">{count} channels</div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {isLoading && (
        <div className="grid place-items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading live channels from IPTV-org…</p>
        </div>
      )}

      {trending.length > 0 && (
        <ChannelRow title="Trending Live Now" subtitle="What everyone's watching">
          {trending.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </ChannelRow>
      )}

      {sports.length > 0 && (
        <ChannelRow title="Popular Sports" subtitle="Live games & coverage">
          {sports.map((c) => (
            <ChannelCard key={c.id} channel={c} large />
          ))}
        </ChannelRow>
      )}

      {news.length > 0 && (
        <ChannelRow title="World News" subtitle="Around-the-clock coverage">
          {news.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </ChannelRow>
      )}

      {recent.length > 0 && (
        <ChannelRow title="Continue Watching" subtitle="Pick up where you left off">
          {recent.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </ChannelRow>
      )}

      {recommended.length > 0 && (
        <section className="space-y-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold sm:text-2xl">Recommended for You</h2>
          </div>
          <p className="text-sm text-muted-foreground">Hand-picked from across the world</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recommended.map((c) => (
              <ChannelCard key={c.id} channel={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
