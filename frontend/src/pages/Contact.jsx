import { useEffect, useState } from "react";
import { api, formatApiErrorDetail } from "../lib/api";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/motion/Reveal";
import { MagneticButton } from "../components/motion/Interactive";
import { Phone, EnvelopeSimple, MapPin, Clock, PaperPlaneTilt } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function Contact() {
  const [content, setContent] = useState(null);
  const [info, setInfo] = useState({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/content/contact").then((r) => setContent(r.data)).catch(() => {});
    api.get("/settings").then((r) => setInfo(r.data)).catch(() => {});
    document.title = "Contact — Synergy Petroleum";
  }, []);

  const hero = content?.sections?.hero || {};
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! Our team will get back to you shortly.");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inputCls = "w-full rounded-lg bg-[hsl(217,33%,10%)] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/40 transition-colors duration-200";

  return (
    <div data-testid="contact-page">
      <PageHero overline={hero.overline} heading={hero.heading || "Let's Talk Fuel"} subheading={hero.subheading} />

      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-5 space-y-5">
          {[
            { Icon: MapPin, label: "Address", value: info.address || "510 Myrtle Ave Suite 209, South San Francisco, CA 94080", tid: "contact-info-address" },
            { Icon: Phone, label: "Phone", value: info.phone || "(650) 634-8449", tid: "contact-info-phone" },
            { Icon: EnvelopeSimple, label: "Email", value: info.email || "info@casynergy.com", tid: "contact-info-email" },
            { Icon: Clock, label: "Hours", value: info.hours || "24/7 Help Desk", tid: "contact-info-hours" },
          ].map(({ Icon, label, value, tid }) => (
            <div key={label} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[hsl(222,47%,7%)] p-6" data-testid={tid}>
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-400/25 flex items-center justify-center shrink-0">
                <Icon size={21} weight="duotone" className="text-orange-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">{label}</div>
                <div className="mt-1.5 text-sm text-white font-medium">{value}</div>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-7">
          <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-[hsl(222,47%,6%)] p-8 lg:p-10" data-testid="contact-form">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white mb-8">Send us a message</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input data-testid="contact-input-name" required placeholder="Full name *" value={form.name} onChange={set("name")} className={inputCls} />
              <input data-testid="contact-input-email" required type="email" placeholder="Email address *" value={form.email} onChange={set("email")} className={inputCls} />
              <input data-testid="contact-input-phone" placeholder="Phone number" value={form.phone} onChange={set("phone")} className={inputCls} />
              <input data-testid="contact-input-company" placeholder="Company" value={form.company} onChange={set("company")} className={inputCls} />
            </div>
            <textarea data-testid="contact-input-message" required rows={5} placeholder="How can we help? *" value={form.message} onChange={set("message")} className={`${inputCls} mt-5 resize-none`} />
            <MagneticButton
              type="submit"
              disabled={sending}
              data-testid="contact-submit-btn"
              className="mt-7 px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white font-semibold text-sm flex items-center gap-2 glow-cyan transition-colors duration-200"
            >
              <PaperPlaneTilt size={17} /> {sending ? "Sending..." : "Send Message"}
            </MagneticButton>
          </form>
        </Reveal>
      </section>
    </div>
  );
}
