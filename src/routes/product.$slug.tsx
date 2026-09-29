import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/site/product-card";
import { SiteLayout } from "@/components/site/layout";
import { useCart } from "@/lib/cart";
import { formatINR, getProduct, products } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — Twispp` : "Twispp";
    const description = p?.description ?? "Handmade flowers by Twispp.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const wished = has(product.slug);

  function addToCart() {
    add(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity,
    );
    toast("Added to your little collection ♡", { description: product.name });
  }

  return (
    <SiteLayout>
      <div className="px-4 pt-8 sm:px-8">
        <nav className="mx-auto max-w-[1400px] text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <Link to="/shop" search={{}} className="link-underline">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <button
            type="button"
            onClick={() => setZoom((z) => !z)}
            aria-label={zoom ? "Zoom out" : "Zoom in"}
            className="block w-full overflow-hidden bg-secondary"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className={cn(
                "w-full object-cover transition-transform duration-700",
                zoom ? "scale-150 cursor-zoom-out" : "cursor-zoom-in",
              )}
            />
          </button>
          <p className="mt-3 text-xs text-muted-foreground">Tap the photo to zoom</p>
        </div>

        <div className="lg:pt-6">
          <h1 className="display text-[clamp(2.4rem,6vw,4rem)] text-primary">
            {product.name}
          </h1>
          <p className="mt-3 text-muted-foreground">{product.tagline}</p>
          <p className="mt-6 text-2xl">{formatINR(product.price)}</p>

          <p className="mt-6 max-w-md leading-relaxed text-foreground/80">
            {product.description}
          </p>

          <ul className="mt-6 space-y-1.5 text-sm text-muted-foreground">
            {product.details.map((d) => (
              <li key={d}>— {d}</li>
            ))}
          </ul>

          <div className="mt-8">
            <label htmlFor="gift-note" className="eyebrow">
              Gift note (optional)
            </label>
            <textarea
              id="gift-note"
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              rows={2}
              placeholder="We'll ask for this again at checkout"
              className="mt-2 w-full border border-border bg-card p-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-12 w-12 place-items-center hover:bg-secondary"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="grid h-12 w-12 place-items-center hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={addToCart}
              className="h-12 rounded-full bg-primary px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90"
            >
              Add to cart
            </button>

            <button
              type="button"
              onClick={() => toggle(product.slug)}
              aria-pressed={wished}
              className="grid h-12 w-12 place-items-center rounded-full border border-border hover:border-primary"
              aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-coral text-coral")} />
            </button>
          </div>

          <div className="mt-10 space-y-3 border-t border-border pt-8 text-sm text-muted-foreground">
            <p>
              <span className="text-foreground">Delivery:</span> confirmed personally over
              WhatsApp after you send your order request.
            </p>
            <p>
              <span className="text-foreground">Care:</span> keep away from water, dust
              gently. No watering needed, ever.
            </p>
            <p className="text-foreground">Made by hand ♡ Every piece is slightly unique.</p>
          </div>
        </div>
      </div>

      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="display text-3xl">You might also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
