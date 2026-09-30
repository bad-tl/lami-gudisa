"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Loader2,
  MapPin,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";

import {
  createExperience,
  publishExperience,
  updateExperience,
} from "@/app/dashboard/experience/actions";
import {
  experienceSchema,
  type ExperienceFormData,
} from "@/lib/validations/experience";

type ExperienceRecord = {
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
};

type ExperienceFormProps = {
  experience?: ExperienceRecord | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

function formatDateForInput(date: Date | null) {
  if (!date) {
    return "";
  }

  const value = new Date(date);

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

export function ExperienceForm({
  experience,
  onSuccess,
  onCancel,
}: ExperienceFormProps) {
  const isEditing = Boolean(experience);

  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] =
    React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      position: experience?.position ?? "",
      company: experience?.company ?? "",
      employmentType:
        experience?.employmentType ?? "",
      location: experience?.location ?? "",
      startDate: experience
        ? new Date(experience.startDate)
        : new Date(),
      endDate: experience?.endDate
        ? new Date(experience.endDate)
        : null,
      isCurrent: experience?.isCurrent ?? false,
      description: experience?.description ?? "",
      achievements: experience?.achievements ?? "",
    },
  });

  const isCurrent = watch("isCurrent");

  const submit = async (
    data: ExperienceFormData,
    action: "draft" | "publish",
  ) => {
    try {
      setMessage(null);

      if (action === "draft") {
        setIsSaving(true);
      } else {
        setIsPublishing(true);
      }

      const result = isEditing
        ? action === "publish"
          ? await publishExperience(
              experience!.id,
              data,
            )
          : await updateExperience(
              experience!.id,
              data,
            )
        : action === "publish"
          ? await (async () => {
              const created =
                await createExperience(data);

              return publishExperience(
                created.experience.id,
                data,
              );
            })()
          : await createExperience(data);

      if (result.success) {
        setMessage({
          type: "success",
          text:
            action === "publish"
              ? "Experience published successfully."
              : "Experience saved as draft successfully.",
        });

        onSuccess?.();
      }
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = handleSubmit((data) =>
    submit(data, "draft"),
  );

  const handlePublish = handleSubmit((data) =>
    submit(data, "publish"),
  );

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-white/[0.09] dark:bg-white/[0.035] dark:text-white dark:placeholder:text-slate-500";

  const textareaClass =
    "min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-white/[0.09] dark:bg-white/[0.035] dark:text-white dark:placeholder:text-slate-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/20 dark:border-white/[0.08] dark:bg-[#07110f] dark:shadow-black/20"
    >
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-amber-50/70 via-white to-transparent px-5 py-5 dark:border-white/[0.07] dark:from-amber-400/[0.06] dark:via-transparent sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
              {isEditing ? (
                <BriefcaseBusiness className="size-5" />
              ) : (
                <Sparkles className="size-5" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                {isEditing
                  ? "Edit Experience"
                  : "Add Experience"}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Update this professional experience."
                  : "Add a new chapter to the professional journey."}
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
              aria-label="Close form"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
      </div>

      <form className="p-5 sm:p-7">
        <div className="space-y-7">
          {/* Basic information */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                Position details
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Enter the core information about this role.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="position"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Position *
                </label>

                <input
                  id="position"
                  {...register("position")}
                  placeholder="e.g. Accountant & Controller Officer"
                  className={inputClass}
                />

                {errors.position && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.position.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="company"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Company *
                </label>

                <input
                  id="company"
                  {...register("company")}
                  placeholder="e.g. Vision Fund Microfinance"
                  className={inputClass}
                />

                {errors.company && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.company.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="employmentType"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Employment type
                </label>

                <input
                  id="employmentType"
                  {...register("employmentType")}
                  placeholder="e.g. Full-time"
                  className={inputClass}
                />

                {errors.employmentType && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.employmentType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="location"
                    {...register("location")}
                    placeholder="e.g. Addis Ababa, Ethiopia"
                    className={`${inputClass} pl-9`}
                  />
                </div>

                {errors.location && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                Timeline
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Define when this position started and ended.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="startDate"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Start date *
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="startDate"
                    type="date"
                    defaultValue={formatDateForInput(
                      experience?.startDate ?? null,
                    )}
                    onChange={(event) => {
                      const date = parseDate(
                        event.target.value,
                      );

                      if (date) {
                        setValue(
                          "startDate",
                          date,
                          {
                            shouldValidate: true,
                          },
                        );
                      }
                    }}
                    className={`${inputClass} pl-9`}
                  />
                </div>

                {errors.startDate && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="endDate"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  End date
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="endDate"
                    type="date"
                    disabled={isCurrent}
                    defaultValue={formatDateForInput(
                      experience?.endDate ?? null,
                    )}
                    onChange={(event) => {
                      const date = parseDate(
                        event.target.value,
                      );

                      setValue(
                        "endDate",
                        date ?? null,
                        {
                          shouldValidate: true,
                        },
                      );
                    }}
                    className={`${inputClass} pl-9 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-white/[0.02]`}
                  />
                </div>

                {errors.endDate && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Current position */}
            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-4 dark:border-emerald-400/10 dark:bg-emerald-400/[0.05]">
              <input
                type="checkbox"
                {...register("isCurrent", {
                  onChange: (event) => {
                    if (event.target.checked) {
                      setValue("endDate", null, {
                        shouldValidate: true,
                      });
                    }
                  },
                })}
                className="size-4 rounded border-slate-300 text-emerald-600 accent-emerald-600"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                  I currently work here
                </span>

                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                  The public portfolio will display this
                  position as &quot;Present&quot;.
                </span>
              </span>
            </label>
          </section>

          {/* Description */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                Professional story
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Describe the role and highlight meaningful
                contributions.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Briefly describe the role, responsibilities, and scope of the position..."
                  className={textareaClass}
                />

                {errors.description && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="achievements"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Key achievements
                </label>

                <textarea
                  id="achievements"
                  {...register("achievements")}
                  placeholder="Highlight measurable results, achievements, responsibilities, or major contributions..."
                  className={textareaClass}
                />

                {errors.achievements && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.achievements.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Message */}
          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/10 dark:bg-emerald-400/[0.06] dark:text-emerald-300"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-400/10 dark:bg-red-400/[0.06] dark:text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-6 dark:border-white/[0.07] sm:flex-row sm:justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSaving || isPublishing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.09] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.09] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Draft
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving || isPublishing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Publish
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}