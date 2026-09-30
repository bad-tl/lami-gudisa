"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  Clock3,
  Edit3,
  GraduationCap,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  deleteEducation,
  publishEducation,
  reorderEducation,
  unpublishEducation,
} from "@/app/dashboard/education/actions";

type EducationRecord = {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  description: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type EducationListProps = {
  educations: EducationRecord[];
  onEdit: (education: EducationRecord) => void;
  onChange: React.Dispatch<React.SetStateAction<EducationRecord[]>>;
};

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateRange(education: EducationRecord) {
  const start = formatDate(education.startDate);
  const end = education.isCurrent
    ? "Present"
    : formatDate(education.endDate);

  return `${start} — ${end ?? "Present"}`;
}

export function EducationList({
  educations,
  onEdit,
  onChange,
}: EducationListProps) {
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  async function handlePublish(id: string) {
    setLoadingId(id);

    try {
      const result = await publishEducation(id);

      onChange((current) =>
        current.map((education) =>
          education.id === id
            ? result.education
            : education,
        ),
      );
    } catch (error) {
      console.error("Failed to publish education:", error);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleUnpublish(id: string) {
    setLoadingId(id);

    try {
      const result = await unpublishEducation(id);

      onChange((current) =>
        current.map((education) =>
          education.id === id
            ? result.education
            : education,
        ),
      );
    } catch (error) {
      console.error("Failed to unpublish education:", error);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education record?",
    );

    if (!confirmed) return;

    setLoadingId(id);

    try {
      await deleteEducation(id);

      onChange((current) =>
        current.filter((education) => education.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete education:", error);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleReorder(
    id: string,
    direction: "up" | "down",
  ) {
    setLoadingId(id);

    try {
      await reorderEducation(id, direction);

      onChange((current) => {
        const sorted = [...current].sort(
          (a, b) => a.sortOrder - b.sortOrder,
        );

        const index = sorted.findIndex(
          (education) => education.id === id,
        );

        if (index === -1) return current;

        const targetIndex =
          direction === "up" ? index - 1 : index + 1;

        if (
          targetIndex < 0 ||
          targetIndex >= sorted.length
        ) {
          return current;
        }

        [
          sorted[index],
          sorted[targetIndex],
        ] = [
          sorted[targetIndex],
          sorted[index],
        ];

        return sorted.map((education, position) => ({
          ...education,
          sortOrder: position,
        }));
      });
    } catch (error) {
      console.error("Failed to reorder education:", error);
    } finally {
      setLoadingId(null);
    }
  }

  if (educations.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <GraduationCap className="size-7" />
        </div>

        <h3 className="text-lg font-semibold">
          Your academic journey starts here
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Add your degrees, qualifications, and educational
          achievements to build your academic profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educations.map((education, index) => {
        const isLoading = loadingId === education.id;
        const isPublished = education.status === "PUBLISHED";

        return (
          <article
            key={education.id}
            className="
              group relative overflow-hidden rounded-3xl border
              bg-card p-5 shadow-sm
              transition-all duration-300
              hover:-translate-y-0.5
              hover:shadow-md
              sm:p-6
            "
          >
            {/* Accent */}
            <div
              className="
                absolute inset-y-0 left-0 w-1
                bg-primary/70
                transition-all duration-300
                group-hover:w-1.5
              "
            />

            <div className="flex min-w-0 flex-col gap-5 pl-2 sm:pl-3">
              {/* Top row */}
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <GraduationCap className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {isPublished ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="size-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-400">
                          <Clock3 className="size-3" />
                          Draft
                        </span>
                      )}

                      {education.isCurrent && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                          In Progress
                        </span>
                      )}
                    </div>

                    <h3 className="break-words text-lg font-semibold tracking-tight sm:text-xl">
                      {education.degree}
                    </h3>

                    <p className="mt-1 break-words text-sm font-medium text-muted-foreground">
                      {education.institution}
                    </p>
                  </div>
                </div>

                {/* More menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        aria-label={`Actions for ${education.degree}`}
                      />
                    }
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(education)}
                    >
                      <Edit3 className="size-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      disabled={index === 0 || isLoading}
                      onClick={() =>
                        handleReorder(education.id, "up")
                      }
                    >
                      <ArrowUp className="size-4" />
                      Move Up
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      disabled={
                        index === educations.length - 1 ||
                        isLoading
                      }
                      onClick={() =>
                        handleReorder(education.id, "down")
                      }
                    >
                      <ArrowDown className="size-4" />
                      Move Down
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {isPublished ? (
                      <DropdownMenuItem
                        disabled={isLoading}
                        onClick={() =>
                          handleUnpublish(education.id)
                        }
                      >
                        <Clock3 className="size-4" />
                        Unpublish
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        disabled={isLoading}
                        onClick={() =>
                          handlePublish(education.id)
                        }
                      >
                        <CheckCircle2 className="size-4" />
                        Publish
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      disabled={isLoading}
                      onClick={() =>
                        handleDelete(education.id)
                      }
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Details */}
              <div className="grid min-w-0 gap-4 border-t pt-5 sm:grid-cols-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Field of Study
                  </p>

                  <p className="mt-1 break-words text-sm font-medium">
                    {education.field || "Not specified"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Period
                  </p>

                  <p className="mt-1 break-words text-sm font-medium">
                    {formatDateRange(education)}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Location
                  </p>

                  <p className="mt-1 break-words text-sm font-medium">
                    {education.location || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Description */}
              {education.description && (
                <div className="flex min-w-0 items-start gap-3 rounded-2xl bg-muted/30 p-4">
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />

                  <p className="min-w-0 break-words text-sm leading-6 text-muted-foreground">
                    {education.description}
                  </p>
                </div>
              )}

              {/* Bottom actions */}
              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Drag-free ordering • Use the menu to reorder
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => onEdit(education)}
                    className="gap-2"
                  >
                    <Edit3 className="size-3.5" />
                    Edit
                  </Button>

                  {isPublished ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      onClick={() =>
                        handleUnpublish(education.id)
                      }
                      className="gap-2"
                    >
                      <Clock3 className="size-3.5" />
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      disabled={isLoading}
                      onClick={() =>
                        handlePublish(education.id)
                      }
                      className="gap-2"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}