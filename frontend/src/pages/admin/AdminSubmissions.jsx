import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Trash2, MailOpen } from "lucide-react";

export default function AdminSubmissions() {
  const [items, setItems] = useState([]);

  const load = () => api.get("/contact/submissions").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.put(`/contact/submissions/${id}/read`);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/contact/submissions/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div data-testid="admin-submissions-page">
      <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Contact Submissions</h1>
      <p className="text-sm text-slate-400 mt-1">{items.length} total · {items.filter((x) => !x.read).length} unread</p>

      <div className="mt-6 space-y-4">
        {items.length === 0 && <p className="text-slate-500 text-sm" data-testid="submissions-empty">No submissions yet.</p>}
        {items.map((s) => (
          <div key={s.id} className={`rounded-xl border p-6 bg-[hsl(222,47%,6%)] ${s.read ? "border-white/10" : "border-orange-400/40"}`} data-testid={`submission-${s.id}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-heading font-bold text-white">{s.name}</span>
                  {!s.read && <span className="text-[10px] font-bold bg-orange-500 text-white rounded-full px-2 py-0.5">NEW</span>}
                  <span className="text-xs text-slate-500">{new Date(s.created_at).toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1.5">
                  {s.email}{s.phone && ` · ${s.phone}`}{s.company && ` · ${s.company}`}
                </div>
              </div>
              <div className="flex shrink-0">
                {!s.read && (
                  <button data-testid={`submission-read-${s.id}`} onClick={() => markRead(s.id)} title="Mark as read" className="p-2 text-slate-400 hover:text-orange-400 transition-colors duration-150"><MailOpen size={16} /></button>
                )}
                <button data-testid={`submission-delete-${s.id}`} onClick={() => remove(s.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors duration-150"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{s.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
