import { AnimatePresence, motion } from "framer-motion";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useIptv } from "@/hooks/useIptv";

const recent = ["ESPN HD", "BBC News", "HBO Max"];
const trending = ["FIFA Final", "Premier League", "Breaking News", "Live Concerts"];

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return channels
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 6);
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-start bg-background/80 px-4 pt-24 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border/60 px-4">
              <Search className="h-5 w-5 text-primary" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search channels, shows, sports..."
                className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={onClose}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {q.trim() ? (
                results.length ? (
                  <div className="space-y-1">
                    {results.map((c) => (
                      <Link
                        key={c.id}
                        to="/watch/$id"
                        params={{ id: c.id }}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/60"
                      >
                        <img src={c.logo} alt={c.name} className="h-10 w-10 rounded-md object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {c.flag} {c.category} · {c.language}
                          </div>
                        </div>
                        {c.hd && (
                          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            HD
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No channels found
                  </p>
                )
              ) : (
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Recent
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQ(r)}
                          className="rounded-full bg-secondary/60 px-3 py-1.5 text-xs hover:bg-secondary"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" /> Trending
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQ(r)}
                          className="rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary hover:bg-primary/20"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
