import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { PageHero } from "../components/PageHero";
import { Reveal, Stagger, StaggerItem } from "../components/motion/Reveal";
import { TiltImage } from "../components/motion/Interactive";
import { motion } from "framer-motion";

export default function Brands() {
  const [content, setContent] = useState(null);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    api.get("/content/brands").then((r) => setContent(r.data)).catch(() => {});
    api.get("/brands").then((r) => setBrands(r.data)).catch(() => {});
    document.title = "Brands — Synergy Petroleum";
  }, []);

  const s = content?.sections || {};
  const hero = s.hero || {};
  const benefits = s.benefits || {};
  const provide = s.provide || {};

  return (
    <div data-testid="brands-page">
      <PageHero overline={hero.overline} heading={hero.heading || "Your Fuel Partner"} subheading={hero.subheading} />

      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-10">
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {brands.map((b, i) => (
            <StaggerItem key={b.id} data-testid={`brand-card-${i}`} className="group">
              <div className="rounded-2xl border border-white/10 bg-[hsl(222,47%,7%)] overflow-hidden hover:border-orange-400/40 hover:-translate-y-1 transition-[transform,border-color] duration-300">
                {b.image && (
                  <div className="h-52 overflow-hidden">
                    <img src={b.image} alt={b.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-8">
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-[0.2em]">{b.tagline}</p>
                  <h3 className="mt-2 font-heading text-2xl font-bold text-white tracking-tight">{b.name}</h3>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{b.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tighter text-white">{benefits.heading || "Synergy Petroleum Benefits"}</h2>
          </Reveal>
          <Stagger className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(benefits.items || []).map((item, i) => (
              <StaggerItem key={item.title} className="rounded-2xl border border-white/10 p-8 bg-[hsl(222,47%,6%)]" data-testid={`benefit-card-${i}`}>
                <span className="text-orange-500/60 font-heading text-sm font-bold">0{i + 1}</span>
                <h3 className="mt-3 font-heading text-lg font-bold text-white uppercase tracking-wide">{item.title}</h3>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-[130px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tighter text-white">{provide.heading || "We Provide"}</h2>
            <div className="mt-10 space-y-8">
              {(provide.items || []).map((item) => (
                <div key={item.title}>
                  <div className="flex justify-between text-sm font-semibold text-white mb-2">
                    <span>{item.title}</span><span className="text-orange-400">{item.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: `${item.value}%` }}
                      viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-400"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-sm text-slate-400 leading-relaxed">{provide.description}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <TiltImage src="https://images.unsplash.com/photo-1674521645695-815ef207866b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200" alt="Gas station at night" className="h-[420px]" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
