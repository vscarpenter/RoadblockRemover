"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Must match the key used in layout.tsx's inline FOUC-prevention script */
export const THEME_STORAGE_KEY = "roadblock-remover-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }): ReactElement {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isUserChosen = useRef(
    typeof window !== "undefined" && !!localStorage.getItem(THEME_STORAGE_KEY),
  );

  // Apply theme to DOM on mount and changes
  useEffect(() => {
    applyTheme(theme);
    if (isUserChosen.current) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    // Enable CSS transitions only after first mount to prevent initial-load flash
    document.documentElement.classList.add("theme-ready");
  }, [theme]);

  // Listen for system preference changes when the user hasn't explicitly chosen
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange(event: MediaQueryListEvent): void {
      if (!isUserChosen.current) {
        setTheme(event.matches ? "dark" : "light");
      }
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback((): void => {
    isUserChosen.current = true;
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
