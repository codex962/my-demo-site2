import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { PageHero } from "../components/PageHero";
import { Reveal, Stagger, StaggerItem } from "../components/motion/Reveal";
import { TiltImage } from "../components/motion/Interactive";

export default function Company() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get("/content/company").then((r) => setContent(r.data)).catch(() => {});
    document.title = "Company — Synergy Petroleum";
  }, []);

  const s = content?.sections || {};
  const hero = s.hero || {};
  const story = s.story || {};
  const mission = s.mission || {};
  const stats = s.stats?.items || [];

  return (
    <div data-testid="company-page">
      <PageHero
        overline={hero.overline}
        heading={hero.heading || "Locally Grown. Regionally Trusted."}
        subheading={hero.subheading}
        image="https://images.pexels.com/photos/2539433/pexels-photo-2539433.jpeg?auto=compress&w=1600"
      />

      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-10">
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((st, i) => (
            <StaggerItem key={st.label} data-testid={`stat-${i}`} className="rounded-2xl border border-white/10 bg-[hsl(222,47%,7%)] p-7 text-center">
              <div className="font-heading text-4xl font-extrabold tracking-tighter text-orange-400 text-glow">{st.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-400 font-semibold">{st.label}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Our Story</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tighter text-white">{story.heading || "Our Story"}</h2>
            <p className="mt-6 text-sm md:text-base text-slate-400 leading-relaxed">{story.description}</p>
            <h3 className="mt-10 font-heading text-xl font-bold text-white">{mission.heading || "Our Mission"}</h3>
            <p className="mt-4 text-sm md:text-base text-slate-400 leading-relaxed">{mission.description}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <TiltImage src="https://images.unsplash.com/photo-1674521645695-815ef207866b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200" alt="Synergy gas station" className="h-[480px]" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
