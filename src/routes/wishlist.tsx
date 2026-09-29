import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductCard } from "@/components/site/product-card";
import { SiteLayout } from "@/components/site/layout";
import { products } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your wishlist — Twispp" },
      { name: "description", content: "The handmade Twispp pieces you saved for later." },
      { property: "og:title", content: "Your wishlist — Twispp" },
      { property: "og:description", content: "Saved handmade flowers from Twispp." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { slugs } = useWishlist();
  const saved = products.filter((p) => slugs.includes(p.slug));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
        <h1 className="display text-[clamp(2.4rem,7vw,4.5rem)] text-primary">
          Saved for later
        </h1>

        {saved.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              Nothing saved yet. Tap the heart on anything you love.
            </p>
            <Link
              to="/shop"
              search={{ category: "all" }}
              className="mt-8 inline-block rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {saved.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
