import { createFileRoute, Link } from "@tanstack/react-router";

import founder from "@/assets/twispp-founder.png.asset.json";
import hero from "@/assets/twispp-hero.jpg.asset.json";
import { Reveal } from "@/components/site/reveal";
import { SiteLayout } from "@/components/site/layout";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our story — Twispp" },
      {
        name: "description",
        content:
          "Twispp started with a simple idea: make something small, handmade and beautiful enough to make someone smile.",
      },
      { property: "og:title", content: "Our story — Twispp" },
      {
        property: "og:description",
        content: "The handmade little flower brand behind Twispp.",
      },
    ],
  }),
  component: Story,
});

function Story() {
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Our story</p>
          <h1 className="display mt-3 text-[clamp(2.8rem,8vw,6rem)] text-primary">
            We make flowers
            <br />
            that stay.
          </h1>
          <p className="mt-8 max-w-md leading-relaxed text-muted-foreground">
            Twispp started with a simple idea: make something small, handmade and
            beautiful enough to make someone smile.
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            Every bouquet, pot and little bloom is twisted and shaped by hand, one at a
            time. Nothing is mass produced, so no two pieces are exactly alike.
          </p>
          <Link
            to="/shop"
            search={{ category: "all" }}
            className="mt-10 inline-block rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground"
          >
            Shop the collection
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <img
            src={founder.url}
            alt="The maker behind Twispp holding a handmade bouquet"
            className="w-full object-cover"
          />
        </Reveal>
      </section>

      <section className="grain bg-blush px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-[1100px]">
          <p className="display text-[clamp(1.8rem,4.5vw,3rem)] leading-tight text-plum">
            Made by hand ♡ Every piece is slightly unique.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8">
        <img
          src={hero.url}
          alt="A handmade Twispp bouquet in soft light"
          loading="lazy"
          className="mx-auto w-full max-w-[1400px] object-cover"
        />
      </section>
    </SiteLayout>
  );
}
