import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../lib/api";
import { PageHero } from "../components/PageHero";
import { Stagger, StaggerItem } from "../components/motion/Reveal";
import { MapPin } from "@phosphor-icons/react";

const icon = L.divIcon({
  className: "",
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#f58220;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 0 12px rgba(245,130,32,0.7)"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

export default function Locations() {
  const [content, setContent] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    api.get("/content/contact").catch(() => {});
    api.get("/locations").then((r) => setLocations(r.data)).catch(() => {});
    document.title = "Locations — Synergy Petroleum";
  }, []);

  return (
    <div data-testid="locations-page">
      <PageHero
        overline="Our Locations"
        heading="Across the Bay & Beyond"
        subheading="From South San Francisco to the Central Valley — find a Synergy station or hub near you."
      />

      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="rounded-2xl overflow-hidden border border-white/10 glow-cyan" data-testid="locations-map">
          <MapContainer center={[37.62, -122.1]} zoom={9} style={{ height: "480px", width: "100%" }} scrollWheelZoom={false}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />
            {locations.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={icon}>
                <Popup>
                  <strong>{loc.name}</strong><br />{loc.address}, {loc.city}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <Stagger className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc, i) => (
            <StaggerItem key={loc.id} data-testid={`location-card-${i}`} className="rounded-2xl border border-white/10 bg-[hsl(222,47%,7%)] p-7 hover:border-orange-400/40 hover:-translate-y-1 transition-[transform,border-color] duration-300">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-400/25 flex items-center justify-center">
                  <MapPin size={20} weight="duotone" className="text-orange-400" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-3 py-1 rounded-full">{loc.type}</span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-white">{loc.name}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{loc.address}</p>
              <p className="text-sm text-slate-500">{loc.city}</p>
              {loc.description && <p className="mt-3 text-xs text-slate-500 leading-relaxed">{loc.description}</p>}
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
