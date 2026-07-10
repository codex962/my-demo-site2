import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { PageHero } from "../components/PageHero";
import { Reveal, Stagger, StaggerItem } from "../components/motion/Reveal";
import { MagneticButton } from "../components/motion/Interactive";
import { Headset, Wrench, Clock, ArrowRight } from "@phosphor-icons/react";

export default function Maintenance() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get("/content/maintenance").then((r) => setContent(r.data)).catch(() => {});
    document.title = "Maintenance & Services — Synergy Petroleum";
  }, []);

  const s = content?.sections || {};
  const hero = s.hero || {};
  const expertise = s.expertise || {};
  const helpdesk = s.helpdesk || {};

  return (
    <div data-testid="maintenance-page">
      <PageHero overline={hero.overline} heading={hero.heading || "24/7 Help Desk. On-Site Technicians."} subheading={hero.subheading} />

      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tighter text-white">{expertise.heading || "Certified Equipment Expertise"}</h2>
        </Reveal>
        <Stagger className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(expertise.items || []).map((item, i) => (
            <StaggerItem key={item.title} data-testid={`expertise-card-${i}`} className="rounded-2xl border border-white/10 bg-[hsl(222,47%,7%)] p-8 hover:border-orange-400/40 hover:-translate-y-1 transition-[transform,border-color] duration-300">
              <Wrench size={26} weight="duotone" className="text-orange-400 mb-5" />
              <h3 className="font-heading text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute left-1/3 top-0 w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-[130px]" />
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-[0.2em] mb-8">
              <Clock size={15} /> Available 24/7
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white">{helpdesk.heading || "Round-the-Clock Support"}</h2>
            <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">{helpdesk.description}</p>
            <div className="mt-10 flex justify-center">
              <Link to="/contact">
                <MagneticButton data-testid="maintenance-cta" className="px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm flex items-center gap-2 glow-cyan transition-colors duration-200">
                  <Headset size={18} /> Reach the Help Desk <ArrowRight size={16} weight="bold" />
                </MagneticButton>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
