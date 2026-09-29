import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import founder from "@/assets/twispp-founder.png.asset.json";
import hero from "@/assets/twispp-hero.jpg.asset.json";
import pot from "@/assets/twispp-flower-pot.jpg.asset.json";
import sunshine from "@/assets/twispp-sunshine.jpg.asset.json";
import colourPop from "@/assets/twispp-colour-pop.jpg.asset.json";
import { ProductCard } from "@/components/site/product-card";
import { Reveal } from "@/components/site/reveal";
import { SiteLayout } from "@/components/site/layout";
import { moods, products, type Mood } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Twispp — Handcrafted Flowers Made to Smile" },
      {
        name: "description",
        content:
          "Handmade flower bouquets, smiley flower pots and little floral gifts by Twispp. Flowers that don't fade, made to order in India.",
      },
      { property: "og:title", content: "Twispp — Flowers that don't fade" },
      {
        property: "og:description",
        content: "Handcrafted little things made to make someone smile.",
      },
    ],
  }),
  component: Home,
});

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yPetal = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-8 sm:pt-16">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            Handmade in small batches
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="display mt-5 text-[clamp(3.2rem,11vw,8.5rem)] text-primary"
          >
            Flowers
            <br />
            <span className="italic">that don't</span> fade.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            Handcrafted little things made to make someone smile — bouquets, pots and
            tiny blooms that stay exactly as bright as the day you gave them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/shop"
              search={{}}
              className="rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90"
            >
              Shop the collection
            </Link>
            <Link
              to="/story"
              className="rounded-full border border-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Discover Twispp
            </Link>
          </motion.div>
        </div>

        <div className="relative">
          <motion.div
            style={{ y: yImage }}
            className="relative ml-auto w-full max-w-[560px] overflow-hidden rounded-[2px]"
          >
            <img
              src={founder.url}
              alt="Twispp's maker holding a handmade sunflower bouquet"
              className="w-full object-cover"
              width={920}
              height={1150}
            />
          </motion.div>

          <motion.img
            style={{ y: yPetal }}
            src={sunshine.url}
            alt=""
            aria-hidden
            className="float-slow absolute -left-2 bottom-6 hidden w-36 rotate-[-8deg] rounded-[2px] shadow-[var(--shadow-float)] sm:block lg:-left-14 lg:w-48"
          />
          <motion.img
            style={{ y: yPetal }}
            src={pot.url}
            alt=""
            aria-hidden
            className="float-slow absolute -top-4 left-4 hidden w-24 rotate-[7deg] rounded-[2px] shadow-[var(--shadow-lift)] lg:block"
          />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 -z-10 h-[420px] w-[420px] rounded-full bg-blush blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 -z-10 h-[360px] w-[360px] rounded-full bg-lavender/60 blur-[100px]"
      />
    </section>
  );
}

function MoodPicker() {
  const [active, setActive] = useState<Mood | null>(null);
  const shown = active ? products.filter((p) => p.moods.includes(active)) : [];

  return (
    <section className="px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="eyebrow">Shop by feeling</p>
          <h2 className="display mt-3 text-[clamp(2.4rem,6vw,4.5rem)]">Pick a mood</h2>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {moods.map((mood, i) => {
            const isActive = active === mood.id;
            return (
              <Reveal key={mood.id} delay={i * 0.03}>
                <button
                  type="button"
                  onClick={() => setActive(isActive ? null : mood.id)}
                  aria-pressed={isActive}
                  className={`group rounded-full border px-5 py-3 text-left transition ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary"
                  }`}
                >
                  <span className="block text-[13px] uppercase tracking-[0.14em]">
                    {mood.label}
                  </span>
                  <span
                    className={`block text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {mood.note}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        {active && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {shown.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing for this mood yet — more little things are on the way.
              </p>
            ) : (
              shown.map((p) => <ProductCard key={p.slug} product={p} />)
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function Home() {
  return (
    <SiteLayout>
      <Hero />

      {/* Featured products */}
      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">The collection</p>
                <h2 className="display mt-3 text-[clamp(2.4rem,6vw,4.5rem)]">
                  Little things, big smiles
                </h2>
              </div>
              <Link
                to="/shop"
                search={{}}
                className="link-underline text-xs uppercase tracking-[0.18em]"
              >
                See everything
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <ProductCard product={p} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial statement */}
      <section className="grain bg-blush px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <p className="display text-[clamp(2rem,5vw,3.6rem)] leading-[1.08] text-plum">
              Every stem is twisted, shaped and tied by hand. No two turn out exactly the
              same — and that's the whole point.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-sm text-plum/70">
              Made by hand ♡ Every piece is slightly unique.
            </p>
          </Reveal>
        </div>
      </section>

      <MoodPicker />

      {/* Category showcase */}
      <section className="px-4 pb-20 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-3">
          {[
            { img: colourPop.url, label: "Bouquets", category: "bouquets", span: "md:col-span-2 aspect-[16/10]" },
            { img: pot.url, label: "Flower pots", category: "flower-pots", span: "aspect-[4/5]" },
          ].map((c) => (
            <Reveal key={c.label} className={c.span.includes("col-span") ? "md:col-span-2" : ""}>
              <Link
                to="/shop"
                search={{ category: c.category }}
                className="group relative block overflow-hidden"
              >
                <div className={c.span.replace("md:col-span-2 ", "")}>
                  <img
                    src={c.img}
                    alt={c.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                </div>
                <span className="absolute bottom-5 left-5 bg-background/90 px-4 py-2 text-xs uppercase tracking-[0.18em]">
                  {c.label}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="px-4 py-20 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={founder.url}
              alt="The maker behind Twispp with a handmade bouquet"
              loading="lazy"
              className="w-full max-w-[520px] object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Our story</p>
            <h2 className="display mt-3 text-[clamp(2.4rem,6vw,4.5rem)] text-primary">
              We make flowers
              <br />
              that stay.
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Twispp started with a simple idea: make something small, handmade and
              beautiful enough to make someone smile.
            </p>
            <Link
              to="/story"
              className="mt-8 inline-block rounded-full border border-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Read more
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Social gallery */}
      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <h2 className="display text-[clamp(1.8rem,4.5vw,3.2rem)]">
              From our little corner of the internet ♡
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[sunshine.url, hero.url, pot.url, colourPop.url].map((src, i) => (
              <Reveal key={src} delay={i * 0.05}>
                <div
                  className={`overflow-hidden ${i % 3 === 1 ? "aspect-[4/5]" : "aspect-square"}`}
                >
                  <img
                    src={src}
                    alt="Handmade Twispp flowers"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Follow @twispp — link coming soon
            </p>
          </Reveal>
        </div>
      </section>

      {/* Made to make someone smile */}
      <section className="grain bg-plum px-4 py-24 text-primary-foreground sm:px-8">
        <div className="mx-auto max-w-[1400px] text-center">
          <Reveal>
            <h2 className="display text-[clamp(2.6rem,8vw,6rem)]">
              Made to make someone smile
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm text-primary-foreground/70">
              Tell us the occasion and we'll wrap it accordingly. Orders are confirmed
              personally on WhatsApp before anything is made.
            </p>
            <Link
              to="/shop"
              search={{}}
              className="mt-10 inline-block rounded-full bg-butter px-8 py-3.5 text-xs uppercase tracking-[0.18em] text-plum transition hover:opacity-90"
            >
              Pick your little something
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
