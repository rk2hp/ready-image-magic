import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

import logo from "@/assets/twispp-logo.jpg.asset.json";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { products } from "@/lib/products";

const navLinks = [
  { label: "Shop", to: "/shop" as const, search: {} },
  { label: "Collections", to: "/shop" as const, search: { category: "bouquets" } },
  { label: "Gifts", to: "/shop" as const, search: { category: "gifts" } },
  { label: "Our Story", to: "/story" as const, search: {} },
];

export function SiteHeader() {
  const { count } = useCart();
  const { slugs } = useWishlist();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  return (
    <>
      <div className="bg-plum px-4 py-2 text-center text-[11px] uppercase tracking-[0.2em] text-primary-foreground">
        Handmade in small batches · Made to order across India
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="-ml-1 grid h-9 w-9 place-items-center md:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2" aria-label="Twispp home">
              <img src={logo.url} alt="" className="h-9 w-9 rounded-full object-cover" />
              <span className="display text-2xl tracking-tight text-primary">Twispp</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                search={link.search as never}
                className="link-underline text-[13px] uppercase tracking-[0.16em] text-foreground/80 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search products"
              onClick={() => setSearchOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Heart className="h-[18px] w-[18px]" />
              {slugs.length > 0 && (
                <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-coral" />
              )}
            </Link>
            <Link
              to="/cart"
              aria-label={`Cart, ${count} items`}
              className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border/70 bg-background px-4 py-4 sm:px-8">
            <div className="mx-auto max-w-[1400px]">
              <label htmlFor="site-search" className="eyebrow">
                Search
              </label>
              <input
                id="site-search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “sunshine”"
                className="mt-2 w-full border-b border-border bg-transparent pb-2 text-lg outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              {results.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {results.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 text-sm hover:text-primary"
                      >
                        <img src={p.images[0]} alt="" className="h-10 w-10 object-cover" />
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="display text-2xl text-primary">Twispp</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-6 pt-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                search={link.search as never}
                onClick={() => setOpen(false)}
                className="display border-b border-border/60 py-4 text-4xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
