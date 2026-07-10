import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatApiErrorDetail } from "../../lib/api";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "w-full rounded-lg bg-[hsl(217,33%,10%)] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-400/60 transition-colors duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" data-testid="admin-login-page">
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px]" />
      <motion.form
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        onSubmit={submit}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[hsl(222,47%,6%)] p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="Synergy Petroleum" className="h-11 w-auto" />
          <div className="border-l border-white/10 pl-3">
            <div className="font-heading font-bold text-white text-sm">Admin</div>
            <div className="text-xs text-slate-500">Content Management</div>
          </div>
        </div>
        <div className="space-y-4">
          <input data-testid="admin-email-input" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          <input data-testid="admin-password-input" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        </div>
        {error && <p data-testid="admin-login-error" className="mt-4 text-sm text-red-400">{error}</p>}
        <button data-testid="admin-login-submit" type="submit" disabled={busy} className="mt-7 w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white font-semibold text-sm transition-colors duration-200">
          {busy ? "Signing in..." : "Sign In"}
        </button>
      </motion.form>
    </div>
  );
}
