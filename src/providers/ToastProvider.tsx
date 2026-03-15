"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 4000;

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const TYPE_STYLES: Record<ToastType, { bar: string; container: string }> = {
  success: {
    bar: "bg-emerald-400",
    container: "border-emerald-500/20 text-emerald-400",
  },
  error: {
    bar: "bg-red-400",
    container: "border-red-500/20 text-red-400",
  },
  info: {
    bar: "bg-[var(--color-accent)]",
    container: "border-[var(--color-accent)]/20 text-[var(--color-accent-hover)]",
  },
};

export function ToastProvider({ children }: { children: ReactNode }): ReactElement {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info"): void => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_DURATION_MS);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = TYPE_STYLES[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`flex overflow-hidden rounded-lg border bg-[var(--color-surface-raised)]/95 shadow-lg backdrop-blur-xl ${styles.container}`}
                role="alert"
              >
                <div className={`w-1 shrink-0 ${styles.bar}`} />
                <p className="px-4 py-3 text-sm">
                  {toast.message}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
