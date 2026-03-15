import type { Category } from "@/types/roadblock";

export interface CategoryConfig {
  value: Category;
  label: string;
  color: string;
  bgColor: string;
  accentVar: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { value: "CI/CD", label: "CI/CD", color: "text-blue-400", bgColor: "bg-blue-400/10", accentVar: "var(--color-cat-cicd)" },
  { value: "DX", label: "Developer Experience", color: "text-violet-400", bgColor: "bg-violet-400/10", accentVar: "var(--color-cat-dx)" },
  { value: "Process", label: "Process", color: "text-amber-400", bgColor: "bg-amber-400/10", accentVar: "var(--color-cat-process)" },
  { value: "Tooling", label: "Tooling", color: "text-teal-400", bgColor: "bg-teal-400/10", accentVar: "var(--color-cat-tooling)" },
  { value: "Culture", label: "Culture", color: "text-rose-400", bgColor: "bg-rose-400/10", accentVar: "var(--color-cat-culture)" },
] as const;

export const CATEGORY_MAP = new Map(
  CATEGORIES.map((c) => [c.value, c]),
);
