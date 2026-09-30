import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductCard } from "@/components/site/product-card";
import { Reveal } from "@/components/site/reveal";
import { SiteLayout } from "@/components/site/layout";
import { categories, products } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { category?: string } =>
    typeof search["category"] === "string" ? { category: search["category"] } : {},
  head: () => ({
    meta: [
      { title: "Shop handmade flowers — Twispp" },
      {
        name: "description",
        content:
          "Browse Twispp's handmade bouquets, flower pots and little floral gifts. Made by hand, made to order.",
      },
      { property: "og:title", content: "Shop handmade flowers — Twispp" },
      {
        property: "og:description",
        content: "Handmade bouquets, pots and floral gifts from Twispp.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();

  const filtered = products.filter((p) => {
    if (category === "all") return true;
    if (category === "best-sellers") return p.bestSeller;
    return p.category === category;
  });

  return (
    <SiteLayout>
      <div className="px-4 pb-8 pt-14 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow">The shop</p>
          <h1 className="display mt-3 text-[clamp(2.6rem,8vw,6rem)] text-primary">
            Pick your little something
          </h1>

          <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-6">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/shop"
                search={{ category: c.id }}
                className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                  category === c.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:border-primary"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              Nothing here yet — more handmade things are on the way ♡
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <ProductCard product={p} priority={i < 4} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
