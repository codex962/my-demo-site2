import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { PageHero } from "../components/PageHero";
import { Reveal, Stagger, StaggerItem } from "../components/motion/Reveal";
import { TiltImage } from "../components/motion/Interactive";
import { GasPump, Drop, Truck, Leaf, ChartLineUp, Gauge } from "@phosphor-icons/react";

const ICONS = { GasPump, Drop, Truck, Leaf, ChartLineUp, Gauge };

export default function Services() {
  const [content, setContent] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/content/services").then((r) => setContent(r.data)).catch(() => {});
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
    document.title = "Services — Synergy Petroleum";
  }, []);

  const hero = content?.sections?.hero || {};

  return (
    <div data-testid="services-page">
      <PageHero overline={hero.overline} heading={hero.heading || "Services Built Around Your Business"} subheading={hero.subheading} />

      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-10">
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-white/10 rounded-2xl overflow-hidden">
          {services.map((svc, i) => {
            const Icon = ICONS[svc.icon] || GasPump;
            const isGreen = svc.icon === "Leaf";
            return (
              <StaggerItem key={svc.id} data-testid={`service-card-${i}`} className="group p-8 lg:p-10 border-b border-r border-white/10 bg-[hsl(222,47%,5.5%)] hover:bg-[hsl(222,47%,8%)] transition-colors duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 ${isGreen ? "bg-emerald-500/10 border-emerald-400/25" : "bg-orange-500/10 border-orange-400/25"}`}>
                  <Icon size={24} weight="duotone" className={isGreen ? "text-emerald-400" : "text-orange-400"} />
                </div>
                <h3 className="font-heading text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200">{svc.name}</h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{svc.description}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <TiltImage src="https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg?auto=compress&w=1200" alt="Fuel delivery truck on highway" className="h-[400px]" />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Around the Clock</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tighter text-white">Deliveries that never sleep</h2>
            <p className="mt-6 text-sm md:text-base text-slate-400 leading-relaxed">
              Synergy Petroleum provides around-the-clock deliveries and devoted in-house dispatchers. Our in-house technical teams and sales representatives are always on hand — so your tanks stay full and your business keeps moving.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
