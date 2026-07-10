import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Trash2, Pencil, Plus } from "lucide-react";

const empty = { name: "", address: "", city: "", lat: 37.7, lng: -122.4, type: "Gas Station", description: "" };

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/locations").then((r) => setLocations(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...editing, lat: Number(editing.lat), lng: Number(editing.lng) };
    try {
      if (editing.id) await api.put(`/locations/${editing.id}`, payload);
      else await api.post("/locations", payload);
      toast.success("Location saved");
      setEditing(null);
      load();
    } catch {
      toast.error("Failed to save location");
    }
  };

  const remove = async (id) => {
    await api.delete(`/locations/${id}`);
    toast.success("Location deleted");
    load();
  };

  const inputCls = "w-full rounded-lg bg-[hsl(217,33%,10%)] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400/60";

  return (
    <div data-testid="admin-locations-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Locations</h1>
          <p className="text-sm text-slate-400 mt-1">Manage gas stations and hubs shown on the map.</p>
        </div>
        <button data-testid="location-add-btn" onClick={() => setEditing({ ...empty })} className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold flex items-center gap-2 transition-colors duration-200">
          <Plus size={16} /> Add Location
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="mt-6 rounded-xl border border-orange-400/30 bg-[hsl(222,47%,6%)] p-6 grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="location-form">
          <input data-testid="location-input-name" required placeholder="Name *" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
          <input data-testid="location-input-type" placeholder="Type (Gas Station / Hub)" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className={inputCls} />
          <input data-testid="location-input-address" placeholder="Address" value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} className={inputCls} />
          <input data-testid="location-input-city" placeholder="City" value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className={inputCls} />
          <input data-testid="location-input-lat" required type="number" step="any" placeholder="Latitude *" value={editing.lat} onChange={(e) => setEditing({ ...editing, lat: e.target.value })} className={inputCls} />
          <input data-testid="location-input-lng" required type="number" step="any" placeholder="Longitude *" value={editing.lng} onChange={(e) => setEditing({ ...editing, lng: e.target.value })} className={inputCls} />
          <textarea placeholder="Description" rows={2} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={`${inputCls} md:col-span-2`} />
          <div className="flex gap-3 md:col-span-2">
            <button data-testid="location-save-btn" type="submit" className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-colors duration-200">Save</button>
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors duration-200">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-6 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(222,47%,7%)] text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">City</th>
              <th className="text-left px-4 py-3 font-semibold">Type</th>
              <th className="text-left px-4 py-3 font-semibold">Coords</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id} className="border-t border-white/5 hover:bg-white/[0.02]" data-testid={`location-row-${loc.id}`}>
                <td className="px-4 py-3 text-white font-medium">{loc.name}</td>
                <td className="px-4 py-3 text-slate-400">{loc.city}</td>
                <td className="px-4 py-3 text-slate-400">{loc.type}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{loc.lat.toFixed(3)}, {loc.lng.toFixed(3)}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button data-testid={`location-edit-${loc.id}`} onClick={() => setEditing(loc)} className="p-2 text-slate-400 hover:text-orange-400 transition-colors duration-150"><Pencil size={15} /></button>
                  <button data-testid={`location-delete-${loc.id}`} onClick={() => remove(loc.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors duration-150"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
