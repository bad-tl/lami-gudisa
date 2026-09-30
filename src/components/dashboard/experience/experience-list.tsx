"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Edit3,
  MapPin,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";

import {
  deleteExperience,
  publishExperience,
  reorderExperience,
  unpublishExperience,
} from "@/app/dashboard/experience/actions";

type Experience = {
  id: string;
  position: string;
  company: string;
  employmentType: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
  achievements: string | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type ExperienceListProps = {
  experiences: Experience[];
  onEdit?: (experience: Experience) => void;
};

const accentStyles = [
  {
    border:
      "border-amber-200/70 dark:border-amber-400/10",
    glow: "from-amber-500/[0.08]",
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  },
  {
    border:
      "border-teal-200/70 dark:border-teal-400/10",
    glow: "from-teal-500/[0.08]",
    icon: "bg-teal-100 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300",
  },
  {
    border:
      "border-violet-200/70 dark:border-violet-400/10",
    glow: "from-violet-500/[0.08]",
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  },
  {
    border:
      "border-sky-200/70 dark:border-sky-400/10",
    glow: "from-sky-500/[0.08]",
    icon: "bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
  },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getDateRange(experience: Experience) {
  const start = formatDate(experience.startDate);

  if (experience.isCurrent) {
    return `${start} — Present`;
  }

  if (experience.endDate) {
    return `${start} — ${formatDate(experience.endDate)}`;
  }

  return start;
}

export function ExperienceList({
  experiences,
  onEdit,
}: ExperienceListProps) {
  const [items, setItems] = useState(experiences);
  const [loadingId, setLoadingId] = useState<string | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(
    null,
  );

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoadingId(id);
      setMessage(null);

      await deleteExperience(id);

      setItems((current) =>
        current.filter((item) => item.id !== id),
      );

      setMessage("Experience deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete experience.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handlePublish(
    experience: Experience,
  ) {
    try {
      setLoadingId(experience.id);
      setMessage(null);

      await publishExperience(experience.id, {
        position: experience.position,
        company: experience.company,
        employmentType:
          experience.employmentType ?? "",
        location: experience.location ?? "",
        startDate: new Date(experience.startDate),
        endDate: experience.endDate
          ? new Date(experience.endDate)
          : null,
        isCurrent: experience.isCurrent,
        description: experience.description ?? "",
        achievements: experience.achievements ?? "",
      });

      setItems((current) =>
        current.map((item) =>
          item.id === experience.id
            ? {
                ...item,
                status: "PUBLISHED",
              }
            : item,
        ),
      );

      setMessage("Experience published successfully.");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to publish experience.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleUnpublish(id: string) {
    try {
      setLoadingId(id);
      setMessage(null);

      await unpublishExperience(id);

      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "DRAFT",
              }
            : item,
        ),
      );

      setMessage("Experience moved to draft.");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to unpublish experience.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleReorder(
    id: string,
    direction: "up" | "down",
  ) {
    const currentIndex = items.findIndex(
      (item) => item.id === id,
    );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      return;
    }

    try {
      setLoadingId(id);
      setMessage(null);

      await reorderExperience(id, direction);

      const updatedItems = [...items];

      [
        updatedItems[currentIndex],
        updatedItems[targetIndex],
      ] = [
        updatedItems[targetIndex],
        updatedItems[currentIndex],
      ];

      setItems(updatedItems);
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to reorder experience.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.025]">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
          <BriefcaseBusiness className="size-6" />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
          No experience added yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Add Lami&apos;s first professional experience
          to start building his career journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {message && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-slate-300">
          {message}
        </div>
      )}

      {items.map((experience, index) => {
        const accent =
          accentStyles[index % accentStyles.length];

        const isLoading =
          loadingId === experience.id;

        return (
          <motion.article
            key={experience.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.05,
            }}
            className={`group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-shadow hover:shadow-xl dark:bg-white/[0.035] ${accent.border}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} via-transparent to-transparent opacity-70`}
            />

            <div className="relative p-5 sm:p-6 lg:p-7">
              {/* Top row */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${accent.icon}`}
                  >
                    <BriefcaseBusiness className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white sm:text-xl">
                        {experience.position}
                      </h2>

                      {experience.isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Current
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {experience.company}
                    </p>
                  </div>
                </div>

                {/* Status */}
                {experience.status === "PUBLISHED" ? (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-400/10 dark:bg-emerald-400/[0.07] dark:text-emerald-300">
                    <CheckCircle2 className="size-3.5" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:border-amber-400/10 dark:bg-amber-400/[0.07] dark:text-amber-300">
                    <Clock3 className="size-3.5" />
                    Draft
                  </span>
                )}
              </div>

              {/* Metadata */}
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">
                  {getDateRange(experience)}
                </span>

                {experience.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {experience.location}
                  </span>
                )}

                {experience.employmentType && (
                  <span>
                    {experience.employmentType}
                  </span>
                )}
              </div>

              {/* Description */}
              {experience.description && (
                <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {experience.description}
                </p>
              )}

              {/* Actions */}
              <div className="mt-7 flex flex-col gap-3 border-t border-slate-200/80 pt-5 dark:border-white/[0.07] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
<button
  type="button"
  disabled={isLoading}
  onClick={() => onEdit?.(experience)}
  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.09] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
>
  <Edit3 className="size-3.5" />
  Edit
</button>

                  {experience.status ===
                  "PUBLISHED" ? (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        handleUnpublish(
                          experience.id,
                        )
                      }
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-400/10 dark:bg-amber-400/[0.06] dark:text-amber-300 dark:hover:bg-amber-400/[0.1]"
                    >
                      <XCircle className="size-3.5" />
                      Unpublish
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        handlePublish(
                          experience,
                        )
                      }
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Publish
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      handleDelete(experience.id)
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/10 dark:bg-red-400/[0.06] dark:text-red-300 dark:hover:bg-red-400/[0.1]"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>

                {/* Reordering */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={
                      isLoading || index === 0
                    }
                    onClick={() =>
                      handleReorder(
                        experience.id,
                        "up",
                      )
                    }
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/[0.09] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
                    aria-label="Move experience up"
                  >
                    <ArrowUp className="size-4" />
                  </button>

                  <button
                    type="button"
                    disabled={
                      isLoading ||
                      index === items.length - 1
                    }
                    onClick={() =>
                      handleReorder(
                        experience.id,
                        "down",
                      )
                    }
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/[0.09] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
                    aria-label="Move experience down"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}