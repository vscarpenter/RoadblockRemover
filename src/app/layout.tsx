import type { ReactElement } from "react";
import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider, THEME_STORAGE_KEY } from "@/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roadblock Remover",
  description:
    "Identify, visualize, and eliminate systemic friction in the software development lifecycle.",
};

/**
 * Inline script that runs before React hydration to prevent
 * a flash of the wrong theme. Reads localStorage synchronously
 * and sets data-theme on <html> immediately.
 *
 * Theme resolution logic here must mirror ThemeProvider.getInitialTheme().
 */
const THEME_INIT_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased noise-overlay">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
