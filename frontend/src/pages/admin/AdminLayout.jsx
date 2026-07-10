import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, FileText, MapPin, Tags, Wrench, Inbox, Settings, LogOut, ExternalLink } from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/admin/content", label: "Page Content", Icon: FileText },
  { to: "/admin/locations", label: "Locations", Icon: MapPin },
  { to: "/admin/brands", label: "Brands", Icon: Tags },
  { to: "/admin/services", label: "Services", Icon: Wrench },
  { to: "/admin/submissions", label: "Submissions", Icon: Inbox },
  { to: "/admin/settings", label: "Contact Info", Icon: Settings },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (user === false || !user) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen flex" data-testid="admin-layout">
      <aside className="w-60 shrink-0 border-r border-white/10 bg-[hsl(222,47%,5%)] flex flex-col fixed inset-y-0">
        <div className="p-5 border-b border-white/10">
          <img src="/logo.png" alt="Synergy Petroleum" className="h-9 w-auto" />
          <div className="text-xs text-slate-500 mt-2 truncate">{user.email}</div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              data-testid={`admin-nav-${label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive ? "bg-orange-500/15 text-orange-400" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-150">
            <ExternalLink size={17} /> View Site
          </a>
          <button
            data-testid="admin-logout-btn"
            onClick={async () => { await logout(); navigate("/admin"); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150"
          >
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-60 p-8 bg-[hsl(222,47%,4%)] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
