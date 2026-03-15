import type { Category } from "@/types/roadblock";

export interface CategoryConfig {
  value: Category;
  label: string;
  color: string;
  bgColor: string;
  accentVar: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { value: "CI/CD", label: "CI/CD", color: "text-[var(--color-cat-cicd)]", bgColor: "bg-[var(--color-cat-cicd)]/10", accentVar: "var(--color-cat-cicd)" },
  { value: "DX", label: "Developer Experience", color: "text-[var(--color-cat-dx)]", bgColor: "bg-[var(--color-cat-dx)]/10", accentVar: "var(--color-cat-dx)" },
  { value: "Process", label: "Process", color: "text-[var(--color-cat-process)]", bgColor: "bg-[var(--color-cat-process)]/10", accentVar: "var(--color-cat-process)" },
  { value: "Tooling", label: "Tooling", color: "text-[var(--color-cat-tooling)]", bgColor: "bg-[var(--color-cat-tooling)]/10", accentVar: "var(--color-cat-tooling)" },
  { value: "Culture", label: "Culture", color: "text-[var(--color-cat-culture)]", bgColor: "bg-[var(--color-cat-culture)]/10", accentVar: "var(--color-cat-culture)" },
] as const;

export const CATEGORY_MAP = new Map(
  CATEGORIES.map((c) => [c.value, c]),
);
