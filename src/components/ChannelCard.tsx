import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Play, Radio } from "lucide-react";
import type { Channel } from "@/lib/iptv-data";

export function ChannelCard({ channel, large = false }: { channel: Channel; large?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative shrink-0 overflow-hidden rounded-2xl glass ${
        large ? "w-72" : "w-56"
      }`}
    >
      <Link to="/watch/$id" params={{ id: channel.id }} className="block">
        <div className={`relative ${large ? "h-40" : "h-32"} overflow-hidden`}>
          <img
            src={channel.logo}
            alt={channel.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-white/20 backdrop-blur">
            <Radio className="h-3 w-3 animate-pulse-live" />
            Live
          </span>
          <span className="absolute right-3 top-3 text-lg">{channel.flag}</span>
          <button
            className="absolute right-3 bottom-3 grid h-8 w-8 place-items-center rounded-full glass opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
            }}
            aria-label="Favorite"
          >
            <Heart className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-semibold">{channel.name}</h3>
            {channel.hd && (
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                HD
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>{channel.category}</span>
            <span>{channel.viewers} watching</span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="grid h-12 w-12 place-items-center rounded-full gradient-primary glow-cyan">
            <Play className="h-5 w-5 text-background" fill="currentColor" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
