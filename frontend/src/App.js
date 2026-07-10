import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { PageTransition } from "./components/motion/Reveal";
import Home from "./pages/Home";
import Brands from "./pages/Brands";
import Services from "./pages/Services";
import Maintenance from "./pages/Maintenance";
import Locations from "./pages/Locations";
import WhyUs from "./pages/WhyUs";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContent from "./pages/admin/AdminContent";
import AdminLocations from "./pages/admin/AdminLocations";
import AdminCatalog from "./pages/admin/AdminCatalog";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminSettings from "./pages/admin/AdminSettings";

const publicPages = [
  ["/", Home, "fadeScale"],
  ["/brands", Brands, "slideRight"],
  ["/services", Services, "slideUp"],
  ["/maintenance", Maintenance, "curtain"],
  ["/locations", Locations, "zoomOut"],
  ["/why-us", WhyUs, "slideLeft"],
  ["/company", Company, "blurFade"],
  ["/contact", Contact, "tilt"],
];

function PublicSite() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {publicPages.map(([path, Page, variant]) => (
            <Route key={path} path={path} element={<PageTransition variant={variant}><Page /></PageTransition>} />
          ))}
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const lenis = new Lenis({ lerp: 0.12 });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="locations" element={<AdminLocations />} />
          <Route path="brands" element={<AdminCatalog kind="brands" />} />
          <Route path="services" element={<AdminCatalog kind="services" />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    );
  }

  return <PublicSite />;
}

function App() {
  const [loading, setLoading] = useState(!window.location.pathname.startsWith("/admin"));

  return (
    <div className="App dark">
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="bottom-right" theme="dark" richColors />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
