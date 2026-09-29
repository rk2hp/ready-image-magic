import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="grain mt-24 bg-plum px-4 py-16 text-primary-foreground sm:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-5xl">Twispp</p>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/75">
            Handcrafted with love, made to smile. Little handmade flowers that stay
            exactly as bright as the day you gave them.
          </p>
        </div>

        <div>
          <p className="eyebrow text-lavender">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link to="/shop" search={{}} className="link-underline">
                All products
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "bouquets" }} className="link-underline">
                Bouquets
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "flower-pots" }} className="link-underline">
                Flower pots
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="link-underline">
                Wishlist
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-lavender">Twispp</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link to="/story" className="link-underline">
                Our story
              </Link>
            </li>
            <li>
              <a href="#" className="link-underline">
                Instagram (link coming soon)
              </a>
            </li>
            <li>
              <Link to="/admin" className="link-underline">
                Owner dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1400px] flex-col gap-2 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Twispp. Made by hand ♡</p>
        <p>Orders are confirmed personally over WhatsApp.</p>
      </div>
    </footer>
  );
}
