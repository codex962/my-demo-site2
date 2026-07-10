import { Link } from "react-router-dom";
import { Phone, EnvelopeSimple, MapPin } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export const Footer = () => {
  const [info, setInfo] = useState({});
  useEffect(() => {
    api.get("/settings").then((r) => setInfo(r.data)).catch(() => {});
  }, []);

  return (
    <footer className="border-t border-white/10 bg-[hsl(222,47%,3%)] relative grain">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="mb-4">
            <img src="/logo.png" alt="Synergy Petroleum" className="h-12 w-auto" />
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            #1 in premium and private label fuel. Distribution, retail, and 24/7 maintenance services across Northern California.
          </p>
        </div>
        <div className="md:col-span-3">
          <h4 className="text-white font-heading font-semibold mb-4 text-sm uppercase tracking-[0.2em]">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {[["Brands", "/brands"], ["Services", "/services"], ["Maintenance", "/maintenance"], ["Locations", "/locations"], ["Why Us", "/why-us"], ["Company", "/company"]].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-slate-400 hover:text-orange-400 transition-colors duration-200">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <h4 className="text-white font-heading font-semibold mb-4 text-sm uppercase tracking-[0.2em]">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3"><MapPin size={18} className="text-orange-400 mt-0.5 shrink-0" /><span data-testid="footer-address">{info.address || "510 Myrtle Ave Suite 209, South San Francisco, CA"}</span></li>
            <li className="flex items-center gap-3"><Phone size={18} className="text-orange-400 shrink-0" /><span data-testid="footer-phone">{info.phone || "(650) 634-8449"}</span></li>
            <li className="flex items-center gap-3"><EnvelopeSimple size={18} className="text-orange-400 shrink-0" /><span data-testid="footer-email">{info.email || "info@casynergy.com"}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Synergy Petroleum. All rights reserved.
      </div>
    </footer>
  );
};
