import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Info, Tv, Sparkles } from "lucide-react";
import { categories, channels, continueWatching, featured } from "@/lib/iptv-data";
import { ChannelCard } from "@/components/ChannelCard";
import { ChannelRow } from "@/components/ChannelRow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StreamVerse TV — Watch Live TV, Sports, Movies & More" },
      { name: "description", content: "Stream thousands of live channels in HD across sports, movies, news, kids and international categories." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const sports = channels.filter((c) => c.category === "Sports");
  const trending = channels.slice(0, 10);
  const recommended = channels.slice(10, 20);

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
          <img
            src={featured.image}
            alt={featured.title}
            className="h-full w-full object-cover"
          />
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
                {featured.channel} · {featured.viewers} watching
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {featured.title}
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              {featured.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/watch/$id"
                params={{ id: channels[0].id }}
                className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 font-semibold text-background glow-cyan transition-transform hover:scale-105"
              >
                <Play className="h-4 w-4" fill="currentColor" /> Watch Now
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-semibold transition-colors hover:bg-secondary">
                <Info className="h-4 w-4" /> More Info
              </button>
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
          {categories.map((cat, i) => (
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
                  <div className="text-3xl">{cat.icon}</div>
                  <div>
                    <div className="font-bold leading-tight text-white">{cat.name}</div>
                    <div className="text-xs text-white/80">{cat.count} channels</div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <ChannelRow title="Trending Live Now" subtitle="What everyone's watching">
        {trending.map((c) => (
          <ChannelCard key={c.id} channel={c} />
        ))}
      </ChannelRow>

      <ChannelRow title="Popular Sports" subtitle="Live games & coverage">
        {sports.concat(channels.slice(0, 4)).map((c, i) => (
          <ChannelCard key={`${c.id}-${i}`} channel={c} large />
        ))}
      </ChannelRow>

      <ChannelRow title="Continue Watching" subtitle="Pick up where you left off">
        {continueWatching.map((c) => (
          <div key={c.id} className="shrink-0">
            <ChannelCard channel={c} />
            <div className="-mt-1 mx-3 h-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full gradient-primary"
                style={{ width: `${c.progress}%` }}
              />
            </div>
          </div>
        ))}
      </ChannelRow>

      <section className="space-y-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold sm:text-2xl">Recommended for You</h2>
        </div>
        <p className="text-sm text-muted-foreground">Powered by your viewing habits</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {recommended.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
