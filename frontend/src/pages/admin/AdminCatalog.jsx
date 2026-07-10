import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Trash2, Pencil, Plus } from "lucide-react";

export default function AdminCatalog({ kind }) {
  const isBrand = kind === "brands";
  const empty = isBrand
    ? { name: "", tagline: "", description: "", image: "", order: 0 }
    : { name: "", description: "", image: "", icon: "GasPump", order: 0 };
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get(`/${kind}`).then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); setEditing(null); }, [kind]);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...editing, order: Number(editing.order) };
    try {
      if (editing.id) await api.put(`/${kind}/${editing.id}`, payload);
      else await api.post(`/${kind}`, payload);
      toast.success("Saved");
      setEditing(null);
      load();
    } catch {
      toast.error("Failed to save");
    }
  };

  const remove = async (id) => {
    await api.delete(`/${kind}/${id}`);
    toast.success("Deleted");
    load();
  };

  const inputCls = "w-full rounded-lg bg-[hsl(217,33%,10%)] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400/60";

  return (
    <div data-testid={`admin-${kind}-page`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight capitalize">{kind}</h1>
          <p className="text-sm text-slate-400 mt-1">Manage {kind} shown on the public site.</p>
        </div>
        <button data-testid={`${kind}-add-btn`} onClick={() => setEditing({ ...empty })} className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold flex items-center gap-2 transition-colors duration-200">
          <Plus size={16} /> Add
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="mt-6 rounded-xl border border-orange-400/30 bg-[hsl(222,47%,6%)] p-6 grid grid-cols-1 md:grid-cols-2 gap-4" data-testid={`${kind}-form`}>
          <input data-testid={`${kind}-input-name`} required placeholder="Name *" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
          {isBrand ? (
            <input placeholder="Tagline" value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} className={inputCls} />
          ) : (
            <input placeholder="Icon (GasPump, Drop, Truck, Leaf, ChartLineUp, Gauge)" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className={inputCls} />
          )}
          <input placeholder="Image URL" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className={inputCls} />
          <input type="number" placeholder="Order" value={editing.order} onChange={(e) => setEditing({ ...editing, order: e.target.value })} className={inputCls} />
          <textarea placeholder="Description" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={`${inputCls} md:col-span-2`} />
          <div className="flex gap-3 md:col-span-2">
            <button data-testid={`${kind}-save-btn`} type="submit" className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-colors duration-200">Save</button>
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors duration-200">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-[hsl(222,47%,7%)] p-5" data-testid={`${kind}-item-${item.id}`}>
            <div className="flex items-start justify-between">
              <h3 className="font-heading font-bold text-white">{item.name}</h3>
              <div className="flex shrink-0">
                <button data-testid={`${kind}-edit-${item.id}`} onClick={() => setEditing(item)} className="p-1.5 text-slate-400 hover:text-orange-400 transition-colors duration-150"><Pencil size={14} /></button>
                <button data-testid={`${kind}-delete-${item.id}`} onClick={() => remove(item.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors duration-150"><Trash2 size={14} /></button>
              </div>
            </div>
            {item.tagline && <p className="text-xs text-orange-400 mt-1">{item.tagline}</p>}
            <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
