import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { categories, channels } from "@/lib/iptv-data";
import { ChannelCard } from "@/components/ChannelCard";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = categories.find((c) => c.id === slug);
  if (!cat) throw notFound();

  const list = channels.filter(
    (c) => c.category.toLowerCase() === cat.name.toLowerCase() ||
           (cat.id === "intl" && c.country !== "USA"),
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div className={`relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br ${cat.gradient} p-8 sm:p-12`}>
        <div className="relative z-10">
          <div className="text-5xl">{cat.icon}</div>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{cat.name}</h1>
          <p className="mt-2 text-white/90">{cat.count} channels available · Live now</p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      </div>

      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </div>
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
