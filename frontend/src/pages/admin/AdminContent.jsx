import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";

function FieldEditor({ value, onChange, path }) {
  if (typeof value === "string") {
    const long = value.length > 70;
    return long ? (
      <textarea data-testid={`content-field-${path}`} rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-[hsl(217,33%,10%)] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400/60" />
    ) : (
      <input data-testid={`content-field-${path}`} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-[hsl(217,33%,10%)] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400/60" />
    );
  }
  if (typeof value === "number") {
    return <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-32 rounded-lg bg-[hsl(217,33%,10%)] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400/60" />;
  }
  if (Array.isArray(value)) {
    return (
      <div className="space-y-4 pl-4 border-l border-white/10">
        {value.map((item, i) => (
          <div key={i} className="rounded-lg border border-white/5 p-3 bg-white/[0.02]">
            <div className="text-xs text-slate-500 font-semibold mb-2">Item {i + 1}</div>
            {React.createElement(FieldEditor, { value: item, path: `${path}-${i}`, onChange: (v) => onChange(value.map((x, j) => (j === i ? v : x))) })}
          </div>
        ))}
      </div>
    );
  }
  if (value && typeof value === "object") {
    return (
      <div className="space-y-3">
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1.5">{k.replace(/_/g, " ")}</label>
            {React.createElement(FieldEditor, { value: v, path: `${path}-${k}`, onChange: (nv) => onChange({ ...value, [k]: nv }) })}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdminContent() {
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/content").then((r) => {
      setPages(r.data);
      if (r.data.length) setSelected(r.data[0]);
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/content/${selected.slug}`, selected);
      setPages(pages.map((p) => (p.slug === selected.slug ? selected : p)));
      toast.success(`"${selected.slug}" page saved`);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="admin-content-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Page Content</h1>
          <p className="text-sm text-slate-400 mt-1">Edit text on any page. Changes go live instantly.</p>
        </div>
        {selected && (
          <button data-testid="content-save-btn" onClick={save} disabled={saving} className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors duration-200">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        {pages.map((p) => (
          <button
            key={p.slug}
            data-testid={`content-tab-${p.slug}`}
            onClick={() => setSelected(pages.find((x) => x.slug === p.slug))}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
              selected?.slug === p.slug ? "bg-orange-500/15 text-orange-400 border border-orange-400/40" : "text-slate-400 border border-white/10 hover:text-white"
            }`}
          >
            {p.slug}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-6 space-y-6">
          {Object.entries(selected.sections || {}).map(([sectionKey, sectionVal]) => (
            <div key={sectionKey} className="rounded-xl border border-white/10 bg-[hsl(222,47%,6%)] p-6">
              <h3 className="font-heading text-base font-bold text-orange-400 uppercase tracking-wider mb-5">{sectionKey}</h3>
              <FieldEditor
                value={sectionVal}
                path={`${selected.slug}-${sectionKey}`}
                onChange={(nv) => setSelected({ ...selected, sections: { ...selected.sections, [sectionKey]: nv } })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
