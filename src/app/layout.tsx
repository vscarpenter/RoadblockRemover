import type { ReactElement } from "react";
import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roadblock Remover",
  description:
    "Identify, visualize, and eliminate systemic friction in the software development lifecycle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return (
    <html lang="en">
      <body className="font-sans antialiased noise-overlay">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
