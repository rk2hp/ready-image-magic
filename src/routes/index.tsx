import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Gift, Hand, Heart, MessageCircle, Sparkles, Sun } from "lucide-react";

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
      { property: "og:description", content: "Handcrafted little things made to make someone smile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const ease = [0.22, 1, 0.36, 1] as const;

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yMain = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yA = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-blush blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-lavender/60 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute left-1/3 top-0 -z-10 h-[260px] w-[260px] rounded-full bg-butter/40 blur-[90px]" />

      <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-coral" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Handmade in small batches · India
            </span>
          </motion.div>

          <h1 className="display mt-7 text-[clamp(3.4rem,10.5vw,8.8rem)] text-primary">
            {["Flowers", "that don't", "fade."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
                  className={`block ${i === 1 ? "italic text-botanical" : ""}`}
                >
                  {line}
                  {i === 2 && <span className="ml-3 inline-block align-top text-[0.35em] text-coral">✿</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-7 max-w-md text-[17px] leading-relaxed text-muted-foreground"
          >
            Handcrafted bouquets, smiley pots and tiny blooms — twisted and tied by hand,
            and just as bright a year from now as the day you gave them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/shop"
              search={{}}
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5"
            >
              Shop the collection
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/story"
              className="rounded-full border border-primary/30 px-8 py-4 text-xs uppercase tracking-[0.18em] text-primary transition hover:border-primary hover:bg-card"
            >
              Our story
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex items-center gap-6 border-t border-border pt-6 text-sm"
          >
            {[
              ["100%", "Handmade"],
              ["0", "Wilting, ever"],
              ["1 of 1", "Every piece"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="display text-3xl text-primary">{n}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Collage */}
        <div className="relative mx-auto w-full max-w-[580px]">
          <motion.div
            style={{ y: yMain }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease }}
            className="relative overflow-hidden rounded-t-[999px] rounded-b-[28px] border-[10px] border-card shadow-[var(--shadow-float)]"
          >
            <img
              src={founder.url}
              alt="Twispp's maker holding a handmade sunflower bouquet"
              className="aspect-[4/5] w-full object-cover"
              width={920}
              height={1150}
            />
          </motion.div>

          <motion.div
            style={{ y: yA }}
            className="float-slow absolute -left-4 bottom-10 hidden w-40 rotate-[-7deg] overflow-hidden rounded-2xl border-[6px] border-card shadow-[var(--shadow-float)] sm:block lg:-left-16 lg:w-48"
          >
            <img src={sunshine.url} alt="" aria-hidden className="aspect-[4/5] w-full object-cover" />
          </motion.div>
          <motion.div
            style={{ y: yB }}
            className="float-slow absolute -right-2 top-16 hidden w-32 rotate-[8deg] overflow-hidden rounded-2xl border-[6px] border-card shadow-[var(--shadow-lift)] sm:block lg:-right-10"
          >
            <img src={pot.url} alt="" aria-hidden className="aspect-square w-full object-cover" />
          </motion.div>

          {/* Rotating badge */}
          <div className="absolute -bottom-6 right-6 grid h-28 w-28 place-items-center rounded-full bg-butter shadow-[var(--shadow-lift)]">
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            >
              <defs>
                <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-plum text-[9.5px] uppercase tracking-[0.2em]">
                <textPath href="#circle">made to smile · made by hand ·</textPath>
              </text>
            </motion.svg>
            <Heart className="h-6 w-6 fill-plum text-plum" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Handmade with love", "Flowers that stay", "Gift-wrapped", "Made to order", "Every piece unique", "Confirmed on WhatsApp"];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-plum/20 bg-plum py-4 text-primary-foreground">
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="display flex items-center gap-10 text-2xl italic">
            {t} <span className="text-butter not-italic">✿</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Promises() {
  const list = [
    { icon: Hand, title: "Twisted by hand", text: "Every petal shaped one at a time." },
    { icon: Sun, title: "Never wilts", text: "No water, no fading, no goodbyes." },
    { icon: Gift, title: "Ready to gift", text: "Wrapped, tied and note included." },
    { icon: MessageCircle, title: "Personal touch", text: "We confirm every order on WhatsApp." },
  ];
  return (
    <section className="px-4 py-20 sm:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06} className="bg-card p-8">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-blush">
              <p.icon className="h-5 w-5 text-plum" />
            </div>
            <h3 className="mt-6 text-2xl text-primary">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MoodPicker() {
  const [active, setActive] = useState<Mood>("for-your-crush");
  const shown = products.filter((p) => p.moods.includes(active));
  const current = moods.find((m) => m.id === active)!;

  return (
    <section className="relative overflow-hidden bg-lavender/35 px-4 py-24 sm:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.9fr_1.4fr]">
        <div>
          <Reveal>
            <p className="eyebrow">Shop by feeling</p>
            <h2 className="display mt-3 text-[clamp(2.6rem,6vw,5rem)] text-primary">
              Who's it <span className="italic">for?</span>
            </h2>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Pick a feeling and we'll show you the little things that say it best.
            </p>
          </Reveal>
          <div className="mt-10 flex flex-col">
            {moods.map((mood) => {
              const on = active === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setActive(mood.id)}
                  aria-pressed={on}
                  className="group flex items-baseline justify-between border-b border-plum/15 py-3 text-left"
                >
                  <span className={`display text-2xl transition sm:text-3xl ${on ? "italic text-primary" : "text-foreground/50 group-hover:text-foreground"}`}>
                    {mood.label}
                  </span>
                  <span className={`text-xs transition ${on ? "text-coral" : "text-transparent"}`}>●</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <motion.p
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="display text-3xl italic text-botanical"
          >
            “{current.note}”
          </motion.p>
          <motion.div
            key={active + "-grid"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mt-8 grid gap-8 sm:grid-cols-2"
          >
            {shown.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing for this mood yet — more little things are on the way.</p>
            ) : (
              shown.slice(0, 4).map((p) => <ProductCard key={p.slug} product={p} />)
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["01", "Pick your blooms", "Choose a bouquet, pot or little gift."],
    ["02", "Add a note", "Tell us the occasion and your message."],
    ["03", "We confirm", "We message you on WhatsApp to finalise."],
    ["04", "Handmade & sent", "Made with care, wrapped and delivered."],
  ];
  return (
    <section className="px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="text-center">
          <p className="eyebrow">How ordering works</p>
          <h2 className="display mt-3 text-[clamp(2.4rem,6vw,4.5rem)] text-primary">Simple, sweet, personal</h2>
        </Reveal>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 0.08} className="relative text-center">
              <p className="display text-7xl italic text-petal">{n}</p>
              <h3 className="mt-3 text-2xl text-primary">{t}</h3>
              <p className="mx-auto mt-2 max-w-[220px] text-sm text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Marquee />
      <Promises />

      {/* Collection */}
      <section className="px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">The collection</p>
                <h2 className="display mt-3 text-[clamp(2.4rem,6vw,4.5rem)] text-primary">
                  Little things, <span className="italic">big smiles</span>
                </h2>
              </div>
              <Link to="/shop" search={{}} className="link-underline text-xs uppercase tracking-[0.18em]">
                See everything →
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

      {/* Editorial split */}
      <section className="grain bg-blush px-4 py-24 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="grid grid-cols-2 gap-4">
            <img src={hero.url} alt="Wildflower mix bouquet" loading="lazy" className="aspect-[3/4] w-full rounded-t-full object-cover" />
            <img src={colourPop.url} alt="Colour pop bouquet" loading="lazy" className="mt-16 aspect-[3/4] w-full rounded-b-full object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">The craft</p>
            <p className="display mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.08] text-plum">
              Every stem is twisted, shaped and tied by hand. No two turn out exactly the same —{" "}
              <span className="italic">and that's the whole point.</span>
            </p>
            <p className="mt-8 text-sm text-plum/70">Made by hand ♡ Every piece is slightly unique.</p>
          </Reveal>
        </div>
      </section>

      <MoodPicker />

      {/* Categories */}
      <section className="px-4 pt-24 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-3">
          {[
            { img: colourPop.url, label: "Bouquets", note: "Wrapped & ready", category: "bouquets", wide: true },
            { img: pot.url, label: "Flower pots", note: "Desk-sized joy", category: "flower-pots", wide: false },
          ].map((c) => (
            <Reveal key={c.label} className={c.wide ? "md:col-span-2" : ""}>
              <Link to="/shop" search={{ category: c.category }} className="group relative block overflow-hidden rounded-3xl">
                <div className={c.wide ? "aspect-[16/10]" : "aspect-[4/5] md:aspect-auto md:h-full"}>
                  <img src={c.img} alt={c.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/80 to-transparent p-7 text-primary-foreground">
                  <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">{c.note}</p>
                  <p className="display mt-1 text-4xl">
                    {c.label} <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />

      {/* Story */}
      <section className="px-4 pb-24 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 overflow-hidden rounded-[32px] bg-card p-6 shadow-[var(--shadow-lift)] sm:p-10 lg:grid-cols-2">
          <Reveal>
            <img src={founder.url} alt="The maker behind Twispp with a handmade bouquet" loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover" />
          </Reveal>
          <Reveal delay={0.1} className="lg:pr-10">
            <p className="eyebrow">Our story</p>
            <h2 className="display mt-3 text-[clamp(2.4rem,5.5vw,4.4rem)] text-primary">
              We make flowers <span className="italic">that stay.</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Twispp started with a simple idea: make something small, handmade and beautiful
              enough to make someone smile. Every piece still begins at one little table,
              with a lot of patience and a little bit of love.
            </p>
            <Link to="/story" className="mt-8 inline-block rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90">
              Read our story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="text-center">
            <h2 className="display text-[clamp(1.8rem,4.5vw,3.2rem)] text-primary">
              From our little corner of the internet ♡
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[sunshine.url, hero.url, pot.url, colourPop.url].map((src, i) => (
              <Reveal key={src} delay={i * 0.05}>
                <div className={`overflow-hidden rounded-2xl ${i % 2 ? "md:mt-10" : ""}`}>
                  <img src={src} alt="Handmade Twispp flowers" loading="lazy" className="aspect-square h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Follow @twispp — link coming soon
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="grain relative overflow-hidden bg-plum px-4 py-28 text-primary-foreground sm:px-8">
        <div aria-hidden className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-coral/30 blur-[90px]" />
        <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-lavender/30 blur-[90px]" />
        <div className="relative mx-auto max-w-[1000px] text-center">
          <Reveal>
            <p className="text-butter">✿ ✿ ✿</p>
            <h2 className="display mt-4 text-[clamp(2.8rem,8vw,6.5rem)]">
              Made to make <span className="italic text-butter">someone</span> smile
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm text-primary-foreground/70">
              Tell us the occasion and we'll wrap it accordingly. Orders are confirmed
              personally on WhatsApp before anything is made.
            </p>
            <Link to="/shop" search={{}} className="mt-10 inline-block rounded-full bg-butter px-9 py-4 text-xs uppercase tracking-[0.18em] text-plum transition hover:-translate-y-0.5">
              Pick your little something
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
