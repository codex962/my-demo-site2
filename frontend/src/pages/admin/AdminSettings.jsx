import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";

export default function AdminSettings() {
  const [form, setForm] = useState({ phone: "", email: "", address: "", hours: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => setForm({ phone: r.data.phone || "", email: r.data.email || "", address: r.data.address || "", hours: r.data.hours || "" })).catch(() => {});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/settings", form);
      toast.success("Contact info updated");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-lg bg-[hsl(217,33%,10%)] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-400/60";

  return (
    <div data-testid="admin-settings-page">
      <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Contact Info</h1>
      <p className="text-sm text-slate-400 mt-1">Shown in the footer and on the Contact page.</p>
      <form onSubmit={save} className="mt-6 max-w-xl rounded-xl border border-white/10 bg-[hsl(222,47%,6%)] p-6 space-y-4">
        {[["phone", "Phone"], ["email", "Email"], ["address", "Address"], ["hours", "Hours"]].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1.5">{label}</label>
            <input data-testid={`settings-input-${key}`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={inputCls} />
          </div>
        ))}
        <button data-testid="settings-save-btn" type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors duration-200">
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
