"use client";

import type { ReactElement } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ReportForm } from "@/components/roadblocks/ReportForm";

export default function ReportPage(): ReactElement {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Report a Roadblock
        </h1>
        <p className="mb-6 text-gray-600">
          Help leadership identify and fix the friction slowing your team down.
        </p>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <ReportForm />
        </div>
      </div>
    </AppShell>
  );
}
