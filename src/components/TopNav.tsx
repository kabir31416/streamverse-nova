import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, User, Tv, Heart, Home, Newspaper, Film, Baby, Trophy } from "lucide-react";
import { useState } from "react";
import { SearchModal } from "./SearchModal";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/live", label: "Live TV", icon: Tv },
  { to: "/category/sports", label: "Sports", icon: Trophy },
  { to: "/category/movies", label: "Movies", icon: Film },
  { to: "/category/news", label: "News", icon: Newspaper },
  { to: "/category/kids", label: "Kids", icon: Baby },
  { to: "/favorites", label: "Favorites", icon: Heart },
];

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface">
              <Tv className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
            <span className="hidden font-display text-lg font-semibold tracking-tight sm:block">
              Bongo<span className="text-muted-foreground">TV</span>
            </span>
          </Link>

          <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    active
                      ? "text-primary text-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full bg-secondary/60 text-muted-foreground transition-all hover:bg-secondary hover:text-primary"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              to="/profile"
              className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-background"
              aria-label="Profile"
            >
              <User className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="scrollbar-hide flex gap-1 overflow-x-auto border-t border-border/40 px-4 py-2 lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </motion.header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
