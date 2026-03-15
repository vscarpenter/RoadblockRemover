"use client";

import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import type { Roadblock, Status } from "@/types/roadblock";
import { ALLOWED_TRANSITIONS } from "@/constants/statuses";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/providers/ToastProvider";
import { logger } from "@/lib/logger";

interface ResolutionFormProps {
  roadblock: Roadblock;
  onUpdate: (data: {
    status?: Status;
    resolution_note?: string;
  }) => Promise<void>;
}

export function ResolutionForm({ roadblock, onUpdate }: ResolutionFormProps): ReactElement {
  const { showToast } = useToast();
  const [resolutionNote, setResolutionNote] = useState(
    roadblock.resolution_note ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const allowedNext = ALLOWED_TRANSITIONS[roadblock.status];

  if (allowedNext.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-tertiary)]">
        This roadblock is closed. No further transitions available.
      </p>
    );
  }

  async function handleTransition(
    event: FormEvent,
    nextStatus: Status,
  ): Promise<void> {
    event.preventDefault();
    setError("");

    if (nextStatus === "Closed" && !resolutionNote.trim()) {
      setError("A resolution note is required when closing a roadblock.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: { status: Status; resolution_note?: string } = {
        status: nextStatus,
      };
      if (resolutionNote.trim()) {
        payload.resolution_note = resolutionNote.trim();
      }
      await onUpdate(payload);
      showToast(`Status updated to "${nextStatus}"`, "success");
      logger.info("Roadblock status updated", {
        roadblockId: roadblock.id,
        from: roadblock.status,
        to: nextStatus,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      showToast(message, "error");
      logger.error("Failed to update roadblock status", { error: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4">
      <Textarea
        label="Resolution Note"
        value={resolutionNote}
        onChange={(e) => setResolutionNote(e.target.value)}
        placeholder="Describe the fix, workaround, or outcome..."
        hint={
          allowedNext.includes("Closed")
            ? "Required when closing"
            : "Optional"
        }
      />

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        {allowedNext.map((nextStatus) => (
          <Button
            key={nextStatus}
            type="button"
            variant={nextStatus === "Closed" ? "secondary" : "primary"}
            isLoading={isSubmitting}
            onClick={(e) => handleTransition(e, nextStatus)}
          >
            Move to {nextStatus}
          </Button>
        ))}
      </div>
    </form>
  );
}
