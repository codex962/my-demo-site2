import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Preloader = ({ onDone }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          data-testid="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[hsl(222,47%,4%)]"
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.div
            className="absolute w-[420px] h-[420px] rounded-full bg-orange-500/15 blur-[120px]"
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src="/logo.png"
            alt="Synergy Petroleum"
            className="relative h-16 md:h-20 w-auto drop-shadow-[0_0_25px_rgba(245,130,32,0.35)]"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="relative mt-10 w-48 h-[3px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.9, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative mt-5 text-[11px] uppercase tracking-[0.35em] text-slate-500 font-semibold"
          >
            Fueling Northern California
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
