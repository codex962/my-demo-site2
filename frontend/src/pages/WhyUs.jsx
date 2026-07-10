import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/motion/Reveal";
import { TiltImage } from "../components/motion/Interactive";

export default function WhyUs() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get("/content/whyus").then((r) => setContent(r.data)).catch(() => {});
    document.title = "Why Us — Synergy Petroleum";
  }, []);

  const s = content?.sections || {};
  const hero = s.hero || {};
  const reasons = s.reasons?.items || [];

  const images = [
    "https://images.unsplash.com/photo-1674521645695-815ef207866b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg?auto=compress&w=1200",
    "https://images.pexels.com/photos/2539433/pexels-photo-2539433.jpeg?auto=compress&w=1200",
    "https://images.unsplash.com/photo-1643139863038-7355941e9e89?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  ];

  return (
    <div data-testid="whyus-page">
      <PageHero overline={hero.overline} heading={hero.heading || "Why Go Into Business With Us?"} subheading={hero.subheading} />

      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-10 space-y-24">
        {reasons.map((r, i) => (
          <div key={r.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`} data-testid={`reason-${i}`}>
            <Reveal className={i % 2 === 1 ? "lg:order-2" : ""}>
              <span className="text-orange-500/60 font-heading text-5xl font-extrabold tracking-tighter">0{i + 1}</span>
              <h2 className="mt-4 font-heading text-2xl md:text-3xl font-bold tracking-tighter text-white">{r.title}</h2>
              <p className="mt-5 text-sm md:text-base text-slate-400 leading-relaxed max-w-lg">{r.description}</p>
            </Reveal>
            <Reveal delay={0.15} className={i % 2 === 1 ? "lg:order-1" : ""}>
              <TiltImage src={images[i % images.length]} alt={r.title} className="h-[320px]" />
            </Reveal>
          </div>
        ))}
      </section>
    </div>
  );
}
