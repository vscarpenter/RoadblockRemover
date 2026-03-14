import type { Category } from "@/types/roadblock";

export interface CategoryConfig {
  value: Category;
  label: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { value: "CI/CD", label: "CI/CD", color: "text-blue-700", bgColor: "bg-blue-100" },
  { value: "DX", label: "Developer Experience", color: "text-purple-700", bgColor: "bg-purple-100" },
  { value: "Process", label: "Process", color: "text-amber-700", bgColor: "bg-amber-100" },
  { value: "Tooling", label: "Tooling", color: "text-teal-700", bgColor: "bg-teal-100" },
  { value: "Culture", label: "Culture", color: "text-rose-700", bgColor: "bg-rose-100" },
] as const;

export const CATEGORY_MAP = new Map(
  CATEGORIES.map((c) => [c.value, c]),
);
