import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Wrench, ChartLineUp, HandHeart, CaretDown } from "@phosphor-icons/react";
import { api } from "../lib/api";
import { Hero3D } from "../components/Hero3D";
import { Reveal, Stagger, StaggerItem } from "../components/motion/Reveal";
import { MagneticButton } from "../components/motion/Interactive";

const pillarIcons = [Wrench, ChartLineUp, HandHeart];

export default function Home() {
  const [content, setContent] = useState(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    api.get("/content/home").then((r) => setContent(r.data)).catch(() => {});
    document.title = "Synergy Petroleum — #1 in Premium and Private Label Fuel";
  }, []);

  const s = content?.sections || {};
  const hero = s.hero || {};
  const strengths = s.strengths || {};
  const pillars = s.pillars?.items || [];
  const cta = s.cta || {};

  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden grain">
        <Hero3D />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[hsl(222,47%,4%)] to-transparent pointer-events-none z-[5]" />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-orange-400 text-xs font-semibold uppercase tracking-[0.25em] mb-6"
          >
            {hero.overline || "Northern California Fuel Distribution"}
          </motion.p>          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white max-w-3xl leading-[1.02] text-glow"
            data-testid="home-hero-heading"
          >
            {hero.heading || "Fueling the Future of Northern California"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-7 text-base md:text-lg text-slate-300 max-w-xl leading-relaxed"
          >
            {hero.subheading || ""}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.7 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to="/services">
              <MagneticButton data-testid="home-cta-services" className="px-7 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm flex items-center gap-2 glow-cyan transition-colors duration-200">
                {hero.cta_primary || "Discover Our Services"} <ArrowRight size={17} weight="bold" />
              </MagneticButton>
            </Link>
            <Link to="/contact">
              <MagneticButton data-testid="home-cta-contact" className="px-7 py-3.5 rounded-full border border-white/20 hover:border-orange-400/60 hover:bg-white/5 text-white font-semibold text-sm transition-colors duration-200">
                {hero.cta_secondary || "Contact Us"}
              </MagneticButton>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-slate-500"
        >
          <CaretDown size={24} />
        </motion.div>
      </section>

      {/* Key Strengths */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4">{strengths.overline || "Our Key Strengths"}</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white max-w-2xl">
              {strengths.heading || "Quality in every step of our process"}
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-5">
            {(strengths.items || []).map((item, i) => (
              <StaggerItem
                key={item.title}
                className={`${i === 0 ? "md:col-span-8" : i === 1 ? "md:col-span-4" : "md:col-span-4"} group`}
                data-testid={`strength-card-${i}`}
              >
                <Link to={item.link || "/services"} className="block h-full rounded-2xl border border-white/10 bg-[hsl(222,47%,7%)] p-8 hover:border-orange-400/40 hover:-translate-y-1 transition-[transform,border-color] duration-300">
                  <span className="text-orange-500/60 font-heading text-sm font-bold">0{i + 1}</span>
                  <h3 className="mt-4 font-heading text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 uppercase tracking-wider">
                    Explore <ArrowRight size={13} weight="bold" className="group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 lg:py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {pillars.map((p, i) => {
            const Icon = pillarIcons[i % 3];
            return (
              <Reveal key={p.title} delay={i * 0.15} data-testid={`pillar-${i}`}>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-400/25 flex items-center justify-center mb-6">
                  <Icon size={24} weight="duotone" className="text-orange-400" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wide">{p.title}</h3>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">{p.description}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-emerald-500/5" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white">{cta.heading || "Ready to power your business?"}</h2>
            <p className="mt-5 text-base md:text-lg text-slate-400 max-w-xl mx-auto">{cta.subheading || ""}</p>
            <Link to="/contact" className="inline-block mt-9">
              <MagneticButton data-testid="home-bottom-cta" className="px-9 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-semibold flex items-center gap-2 glow-cyan transition-colors duration-200">
                {cta.button || "Get in Touch"} <ArrowRight size={18} weight="bold" />
              </MagneticButton>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
