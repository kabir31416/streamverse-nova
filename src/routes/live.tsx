import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { categories, channels } from "@/lib/iptv-data";
import { ChannelCard } from "@/components/ChannelCard";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live TV — StreamVerse" },
      { name: "description", content: "Browse all live TV channels by category, country and language." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const [cat, setCat] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [hdOnly, setHdOnly] = useState(false);
  const [favOnly, setFavOnly] = useState(false);

  const countries = useMemo(
    () => Array.from(new Set(channels.map((c) => c.country))),
    [],
  );

  const filtered = channels.filter((c) => {
    if (cat !== "all" && c.category.toLowerCase() !== cat.toLowerCase()) return false;
    if (country !== "all" && c.country !== country) return false;
    if (hdOnly && !c.hd) return false;
    if (favOnly && Number(c.id.split("-")[1]) % 4 !== 0) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-primary" /> Filters
            </div>

            <FilterGroup label="Category">
              <Pill active={cat === "all"} onClick={() => setCat("all")}>All</Pill>
              {categories.map((c) => (
                <Pill key={c.id} active={cat === c.name} onClick={() => setCat(c.name)}>
                  {c.name}
                </Pill>
              ))}
            </FilterGroup>

            <FilterGroup label="Country">
              <Pill active={country === "all"} onClick={() => setCountry("all")}>All</Pill>
              {countries.map((c) => (
                <Pill key={c} active={country === c} onClick={() => setCountry(c)}>
                  {c}
                </Pill>
              ))}
            </FilterGroup>

            <FilterGroup label="Options">
              <Toggle checked={hdOnly} onChange={setHdOnly} label="HD Only" />
              <Toggle checked={favOnly} onChange={setFavOnly} label="Favorites" />
            </FilterGroup>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold">Live TV</h1>
              <p className="text-sm text-muted-foreground">
                {filtered.length} channels available
              </p>
            </div>
          </div>
          <motion.div
            layout
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {filtered.map((c) => (
              <ChannelCard key={c.id} channel={c} />
            ))}
          </motion.div>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No channels match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs transition-all ${
        active
          ? "gradient-primary text-background font-semibold"
          : "bg-secondary/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1 py-1.5 text-sm">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-primary" : "bg-secondary"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
