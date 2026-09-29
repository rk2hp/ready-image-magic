import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface WishlistValue {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);
const STORAGE_KEY = "twispp-wishlist-v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSlugs(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, hydrated]);

  const value = useMemo<WishlistValue>(
    () => ({
      slugs,
      has: (slug) => slugs.includes(slug),
      toggle: (slug) =>
        setSlugs((prev) =>
          prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
        ),
    }),
    [slugs],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
