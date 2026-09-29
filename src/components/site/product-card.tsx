import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart";
import { formatINR, type Product } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

const aspectClass = {
  tall: "aspect-[4/5]",
  square: "aspect-square",
  wide: "aspect-[5/4]",
} as const;

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -4, y: px * 4 });
  }

  const wished = has(product.slug);

  return (
    <div className="group [perspective:1200px]">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="tilt-card relative"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          boxShadow: tilt.x || tilt.y ? "var(--shadow-float)" : "var(--shadow-lift)",
        }}
      >
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block overflow-hidden rounded-sm bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <div className={cn("relative overflow-hidden", aspectClass[product.aspect])}>
            <img
              src={product.images[0]}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              style={{
                transform: `translate3d(${tilt.y * -2}px, ${tilt.x * 2}px, 0)`,
              }}
            />
            {product.bestSeller && (
              <span className="absolute left-3 top-3 rounded-full bg-butter px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-plum">
                Loved a lot
              </span>
            )}
          </div>
        </Link>

        <button
          type="button"
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          aria-pressed={wished}
          onClick={() => toggle(product.slug)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/85 text-primary backdrop-blur transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-coral text-coral")} />
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="display text-xl">
            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              className="link-underline"
            >
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>
          <p className="mt-2 text-sm font-medium">{formatINR(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            add({
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
            });
            toast("Added to your little collection ♡", { description: product.name });
          }}
          className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </div>
  );
}
