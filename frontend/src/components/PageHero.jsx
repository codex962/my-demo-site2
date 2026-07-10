import { Reveal } from "./motion/Reveal";

export const PageHero = ({ overline, heading, subheading, image }) => (
  <section className="relative pt-36 lg:pt-44 pb-16 lg:pb-24 overflow-hidden">
    {image && (
      <div className="absolute inset-0">
        <img src={image} alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,4%)]/60 via-[hsl(222,47%,4%)]/70 to-[hsl(222,47%,4%)]" />
      </div>
    )}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
    <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
      <Reveal>
        {overline && <p className="text-orange-400 text-xs font-semibold uppercase tracking-[0.25em] mb-5">{overline}</p>}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white max-w-3xl leading-[1.05]">{heading}</h1>
        {subheading && <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">{subheading}</p>}
      </Reveal>
    </div>
  </section>
);
