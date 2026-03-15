"use client";

import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";
import { logger } from "@/lib/logger";
import { useToast } from "@/providers/ToastProvider";
import { CATEGORIES } from "@/constants/categories";
import { SEVERITIES } from "@/constants/severities";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Category, Severity } from "@/types/roadblock";

const TITLE_MAX_LENGTH = 100;

export function ReportForm(): ReactElement {
  const router = useRouter();
  const { showToast } = useToast();
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedWaste, setEstimatedWaste] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!category) newErrors.category = "Category is required.";
    if (!severity) newErrors.severity = "Severity is required.";
    if (!title.trim()) newErrors.title = "Title is required.";
    if (title.length > TITLE_MAX_LENGTH) {
      newErrors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
    }
    if (!description.trim()) newErrors.description = "Description is required.";
    const waste = Number(estimatedWaste);
    if (!estimatedWaste || isNaN(waste) || waste < 0) {
      newErrors.estimatedWaste = "Enter a valid number of hours (0 or more).";
    }
    return newErrors;
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await pb.collection("roadblocks").create({
        category: category as Category,
        severity: severity as Severity,
        title: title.trim(),
        description: description.trim(),
        estimated_waste: Number(estimatedWaste),
        status: "Open",
      });

      showToast("Roadblock reported successfully!", "success");
      logger.info("Roadblock created anonymously");
      router.push("/dashboard/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit roadblock.";
      showToast(message, "error");
      logger.error("Failed to create roadblock", { error: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-[var(--color-accent)]/15 bg-[var(--color-accent-muted)] p-4">
        <svg className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <p className="text-sm text-[var(--color-accent-hover)]">
          Your submission is completely anonymous. No identifying information is
          stored with this report.
        </p>
      </div>

      <Select
        label="Category"
        options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Select a category"
        error={errors.category}
      />

      <Select
        label="Severity"
        options={SEVERITIES.map((s) => ({ value: s.value, label: s.label }))}
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
        placeholder="Select severity"
        error={errors.severity}
      />

      <div>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="Brief description of the roadblock"
          error={errors.title}
        />
        <p className="mt-1 text-right font-mono text-[10px] text-[var(--color-text-tertiary)]">
          {title.length}/{TITLE_MAX_LENGTH}
        </p>
      </div>

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Provide details about the friction point, its impact, and any context that would help a resolver..."
        hint="Markdown supported"
        rows={6}
        error={errors.description}
      />

      <Input
        label="Estimated Waste (hours/week)"
        type="number"
        min="0"
        step="0.5"
        value={estimatedWaste}
        onChange={(e) => setEstimatedWaste(e.target.value)}
        placeholder="e.g., 2"
        error={errors.estimatedWaste}
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full bg-gradient-to-r from-[var(--color-accent)] to-violet-500 hover:brightness-110"
      >
        Submit Roadblock
      </Button>
    </form>
  );
}
