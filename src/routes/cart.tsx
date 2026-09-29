import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";

import { SiteLayout } from "@/components/site/layout";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Twispp" },
      { name: "description", content: "Review the handmade little things in your Twispp cart." },
      { property: "og:title", content: "Your cart — Twispp" },
      { property: "og:description", content: "Review your Twispp order before requesting it." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, setQuantity, remove } = useCart();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-8">
        <h1 className="display text-[clamp(2.4rem,7vw,4.5rem)] text-primary">Your cart</h1>

        {lines.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Nothing here yet. Something cute is waiting.</p>
            <Link
              to="/shop"
              search={{}}
              className="mt-8 inline-block rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <ul className="divide-y divide-border border-y border-border">
              {lines.map((line) => (
                <li key={line.slug} className="flex gap-4 py-6">
                  <Link to="/product/$slug" params={{ slug: line.slug }} className="shrink-0">
                    <img
                      src={line.image}
                      alt={line.name}
                      className="h-28 w-24 object-cover sm:h-32 sm:w-28"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="display text-xl">{line.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatINR(line.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${line.name}`}
                        onClick={() => remove(line.slug)}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(line.slug, line.quantity - 1)}
                          className="grid h-10 w-10 place-items-center hover:bg-secondary"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(line.slug, line.quantity + 1)}
                          className="grid h-10 w-10 place-items-center hover:bg-secondary"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm">{formatINR(line.price * line.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit bg-secondary p-7">
              <h2 className="eyebrow">Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>Delivery</dt>
                  <dd>To be confirmed</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt>Estimated total</dt>
                  <dd>{formatINR(subtotal)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-7 block rounded-full bg-primary px-6 py-3.5 text-center text-xs uppercase tracking-[0.18em] text-primary-foreground"
              >
                Continue to order
              </Link>
              <p className="mt-4 text-xs text-muted-foreground">
                No payment now — we confirm availability and delivery with you on WhatsApp
                first.
              </p>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
