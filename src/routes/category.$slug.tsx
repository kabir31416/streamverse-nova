import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { categoryTiles } from "@/lib/iptv-data";
import { ChannelCard } from "@/components/ChannelCard";
import { useIptv } from "@/hooks/useIptv";
import { useState } from "react";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = categoryTiles.find((c) => c.id === slug);
  if (!cat) throw notFound();

  const { data, isLoading } = useIptv();
  const channels = data?.channels ?? [];
  const [limit, setLimit] = useState(40);

  const list = channels.filter((c) =>
    cat.country ? c.country === cat.country : c.categories.includes(cat.iptvId!),
  );
  const visible = list.slice(0, limit);

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div className={`relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br ${cat.gradient} p-8 sm:p-12`}>
        <div className="relative z-10">
          <div className="text-5xl">{cat.icon}</div>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{cat.name}</h1>
          <p className="mt-2 text-white/90">
            {isLoading ? "Loading…" : `${list.length.toLocaleString()} channels available · Live now`}
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : list.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((c) => (
              <ChannelCard key={c.id} channel={c} />
            ))}
          </div>
          {visible.length < list.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setLimit((l) => l + 40)}
                className="rounded-full glass px-6 py-2.5 text-sm font-semibold hover:bg-secondary"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No channels yet in this category.</p>
          <Link to="/live" className="mt-4 inline-block text-primary hover:underline">
            Browse all live channels →
          </Link>
        </div>
      )}
    </div>
  );
}
