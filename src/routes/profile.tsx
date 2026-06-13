import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Clock, Heart, Tv, Bell, Globe, Shield } from "lucide-react";
import { useFavorites, useIptv, useRecent } from "@/hooks/useIptv";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [tab, setTab] = useState<"history" | "favorites" | "settings">("history");
  const { data } = useIptv();
  const channels = data?.channels ?? [];
  const { ids: favIds } = useFavorites();
  const { ids: recentIds } = useRecent();
  const favs = channels.filter((c) => favIds.includes(c.id));
  const recent = recentIds
    .map((id) => channels.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="glass mb-6 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full gradient-primary text-3xl font-bold text-background glow-cyan">
            AR
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">Alex Rivera</h1>
            <p className="text-sm text-muted-foreground">Premium · Member since 2024</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-primary">4K HDR</span>
              <span className="rounded-full bg-accent/15 px-2.5 py-1 text-accent">5 devices</span>
              <span className="rounded-full bg-secondary px-2.5 py-1">Multi-screen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-border/60">
        {[
          { id: "history", label: "History", icon: Clock },
          { id: "favorites", label: "Favorites", icon: Heart },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "history" && (
        <div className="space-y-3">
          {continueWatching.map((c) => (
            <Link
              key={c.id}
              to="/watch/$id"
              params={{ id: c.id }}
              className="glass flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-secondary/40"
            >
              <img src={c.logo} alt="" className="h-16 w-24 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.flag} {c.category} · Watched recently</div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full gradient-primary" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === "favorites" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {favs.map((c) => (
            <Link
              key={c.id}
              to="/watch/$id"
              params={{ id: c.id }}
              className="glass overflow-hidden rounded-xl p-3 transition-transform hover:scale-105"
            >
              <img src={c.logo} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
              <div className="truncate text-sm font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.flag} {c.category}</div>
            </Link>
          ))}
        </div>
      )}

      {tab === "settings" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Tv, label: "Playback Quality", value: "Auto (up to 4K)" },
            { icon: Bell, label: "Notifications", value: "Live alerts on" },
            { icon: Globe, label: "Language", value: "English (US)" },
            { icon: Shield, label: "Parental Controls", value: "Off" },
          ].map((s) => (
            <button
              key={s.label}
              className="glass flex items-center gap-4 rounded-xl p-4 text-left transition-colors hover:bg-secondary/40"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.value}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
