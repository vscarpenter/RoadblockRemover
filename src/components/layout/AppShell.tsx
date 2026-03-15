"use client";

import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps): ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-[var(--color-base)]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
          <main className="relative z-[1] flex-1 overflow-y-auto p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-7xl"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
