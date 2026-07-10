import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { FileText, MapPin, Tags, Wrench, Inbox } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pages: 0, locations: 0, brands: 0, services: 0, submissions: 0, unread: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/content"),
      api.get("/locations"),
      api.get("/brands"),
      api.get("/services"),
      api.get("/contact/submissions"),
    ]).then(([p, l, b, s, sub]) => {
      setStats({
        pages: p.data.length,
        locations: l.data.length,
        brands: b.data.length,
        services: s.data.length,
        submissions: sub.data.length,
        unread: sub.data.filter((x) => !x.read).length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: "Pages", value: stats.pages, Icon: FileText, to: "/admin/content" },
    { label: "Locations", value: stats.locations, Icon: MapPin, to: "/admin/locations" },
    { label: "Brands", value: stats.brands, Icon: Tags, to: "/admin/brands" },
    { label: "Services", value: stats.services, Icon: Wrench, to: "/admin/services" },
    { label: "Submissions", value: stats.submissions, Icon: Inbox, to: "/admin/submissions", badge: stats.unread },
  ];

  return (
    <div data-testid="admin-dashboard">
      <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Dashboard</h1>
      <p className="text-sm text-slate-400 mt-1">Manage your website content from here.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, Icon, to, badge }) => (
          <Link key={label} to={to} data-testid={`dashboard-card-${label.toLowerCase()}`} className="rounded-xl border border-white/10 bg-[hsl(222,47%,7%)] p-5 hover:border-orange-400/40 transition-colors duration-200 relative">
            {badge > 0 && <span className="absolute top-3 right-3 text-[10px] font-bold bg-orange-500 text-white rounded-full px-2 py-0.5">{badge} new</span>}
            <Icon size={20} className="text-orange-400" />
            <div className="mt-3 font-heading text-3xl font-bold text-white">{value}</div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">{label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
