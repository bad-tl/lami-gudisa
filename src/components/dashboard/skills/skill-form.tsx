"use client";

import * as React from "react";
import { Loader2, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  createSkill,
  updateSkill,
} from "@/app/dashboard/skills/actions";

import {
  skillSchema,
  type SkillFormData,
} from "@/lib/validations/skill";

type SkillRecord = {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  level: number | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type SkillFormProps = {
  skill: SkillRecord | null;
  onSuccess: (skill: SkillRecord) => void;
  onCancel: () => void;
};

export function SkillForm({
  skill,
  onSuccess,
  onCancel,
}: SkillFormProps) {
  const [serverError, setServerError] =
    React.useState<string | null>(null);

  const isEditing = Boolean(skill);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      level: skill?.level ?? null,
      icon: skill?.icon ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = form;

  const level = watch("level");

  async function onSubmit(data: SkillFormData) {
    setServerError(null);

    try {
      const result = isEditing
        ? await updateSkill(skill!.id, data)
        : await createSkill(data);

      if (result.success) {
        onSuccess(result.skill as SkillRecord);
      }
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Professional Capability
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {isEditing ? "Edit Skill" : "Add Skill"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "Update the information for this professional skill."
              : "Add a professional capability to the portfolio."}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-fit gap-2"
        >
          <X className="size-4" />
          Cancel
        </Button>
      </div>

      {/* Form body */}
      <div className="space-y-8 p-6 sm:p-8">
        {/* Basic information */}
        <div>
          <div className="mb-5">
            <h3 className="font-semibold text-slate-900">
              Skill Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Define the skill and how it should be organized.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="skill-name">
                Skill Name
              </FieldLabel>

              <Input
                id="skill-name"
                placeholder="Financial Analysis & Reporting"
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
              />

              <FieldDescription>
                Use a clear professional skill name.
              </FieldDescription>

              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={Boolean(errors.category)}>
              <FieldLabel htmlFor="skill-category">
                Category
              </FieldLabel>

              <Input
                id="skill-category"
                placeholder="Finance & Accounting"
                {...register("category")}
                aria-invalid={Boolean(errors.category)}
              />

              <FieldDescription>
                Example: Finance, Accounting, Software.
              </FieldDescription>

              <FieldError errors={[errors.category]} />
            </Field>
          </div>
        </div>

        {/* Proficiency */}
        <div>
          <div className="mb-5">
            <h3 className="font-semibold text-slate-900">
              Proficiency
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Optionally show a proficiency level on the public
              portfolio.
            </p>
          </div>

          <Field data-invalid={Boolean(errors.level)}>
            <FieldLabel htmlFor="skill-level">
              Skill Level
            </FieldLabel>

            <div className="flex items-center gap-4">
              <Input
                id="skill-level"
                type="number"
                min={0}
                max={100}
                step={1}
                placeholder="85"
                className="max-w-32"
                value={level ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  setValue(
                    "level",
                    value === ""
                      ? null
                      : Number(value),
                    {
                      shouldValidate: true,
                    },
                  );
                }}
                aria-invalid={Boolean(errors.level)}
              />

              <span className="text-sm font-medium text-slate-500">
                %
              </span>
            </div>

            <FieldDescription>
              Leave empty if you do not want to display a
              proficiency percentage.
            </FieldDescription>

            <FieldError errors={[errors.level]} />
          </Field>
        </div>

        {/* Icon */}
        <div>
          <div className="mb-5">
            <h3 className="font-semibold text-slate-900">
              Icon
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Optional icon identifier. We can add a visual icon
              selector later.
            </p>
          </div>

          <Field data-invalid={Boolean(errors.icon)}>
            <FieldLabel htmlFor="skill-icon">
              Icon Name
            </FieldLabel>

            <Input
              id="skill-icon"
              placeholder="chart"
              {...register("icon")}
              aria-invalid={Boolean(errors.icon)}
            />

            <FieldDescription>
              Example: chart, calculator, briefcase.
            </FieldDescription>

            <FieldError errors={[errors.icon]} />
          </Field>
        </div>

        {/* Error */}
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-6 sm:flex-row sm:justify-end sm:p-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}

          {isEditing ? "Save Changes" : "Save Skill"}
        </Button>
      </div>
    </form>
  );
}