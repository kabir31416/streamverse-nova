import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { channels } from "@/lib/iptv-data";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const [favs, setFavs] = useState<string[]>(channels.slice(0, 8).map((c) => c.id));
  const list = channels.filter((c) => favs.includes(c.id));

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary glow-cyan">
          <Heart className="h-5 w-5 text-background" fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Your Favorites</h1>
          <p className="text-sm text-muted-foreground">{list.length} saved channels</p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="glass grid place-items-center rounded-2xl py-20 text-center">
          <Heart className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No favorites yet.</p>
          <Link to="/live" className="mt-4 rounded-full gradient-primary px-5 py-2 text-sm font-semibold text-background">
            Browse Live TV
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence>
            {list.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative overflow-hidden rounded-2xl glass"
              >
                <Link to="/watch/$id" params={{ id: c.id }} className="block">
                  <div className="relative h-32 overflow-hidden">
                    <img src={c.logo} alt={c.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  </div>
                  <div className="p-3">
                    <div className="truncate font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.flag} {c.category}</div>
                  </div>
                </Link>
                <button
                  onClick={() => setFavs((f) => f.filter((id) => id !== c.id))}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/70 backdrop-blur transition-colors hover:bg-destructive hover:text-white"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
