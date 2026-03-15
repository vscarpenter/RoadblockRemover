"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function LoginPage(): ReactElement {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--color-base)] px-4">
      {/* Grid pattern background */}
      <div className="grid-pattern absolute inset-0" />
      {/* Radial glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[var(--color-accent)]/[0.07] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mb-3 font-mono text-3xl font-bold bg-gradient-to-r from-[var(--color-accent)] to-violet-400 bg-clip-text text-transparent">
            RR
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Roadblock Remover
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Identify and eliminate engineering friction
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)]/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Tab selector */}
          <div className="mb-6 flex gap-1 rounded-lg bg-[var(--color-surface-raised)] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all duration-150 ${
                activeTab === "login"
                  ? "bg-[var(--color-surface-overlay)] text-[var(--color-text-primary)] shadow-sm"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all duration-150 ${
                activeTab === "register"
                  ? "bg-[var(--color-surface-overlay)] text-[var(--color-text-primary)] shadow-sm"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              Create account
            </button>
          </div>

          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </motion.div>
    </div>
  );
}
