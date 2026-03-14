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
      // Payload intentionally omits any user/author reference for anonymity
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
      <div className="rounded-md bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
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
        <p className="mt-1 text-right text-xs text-gray-400">
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

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Submit Roadblock
      </Button>
    </form>
  );
}
