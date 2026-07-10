import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

const links = [
  { to: "/", label: "Home" },
  { to: "/brands", label: "Brands" },
  { to: "/services", label: "Services" },
  { to: "/maintenance", label: "Maintenance" },
  { to: "/locations", label: "Locations" },
  { to: "/why-us", label: "Why Us" },
  { to: "/company", label: "Company" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "bg-black/70 backdrop-blur-xl backdrop-saturate-150 border-white/10" : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center group">
          <img src="/logo.png" alt="Synergy Petroleum" className="h-10 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-orange-400 bg-orange-500/10" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            data-testid="nav-link-contact"
            className="ml-3 px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors duration-200 glow-cyan"
          >
            Contact Us
          </Link>
        </nav>

        <button
          data-testid="nav-mobile-toggle"
          className="lg:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <List size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {[...links, { to: "/contact", label: "Contact" }].map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-testid={`nav-mobile-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium ${isActive ? "text-orange-400 bg-orange-500/10" : "text-slate-300"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
