"use client";

import * as React from "react";
import { Loader2, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  educationSchema,
  type EducationFormData,
} from "@/lib/validations/education";

import {
  createEducation,
  updateEducation,
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

type EducationFormProps = {
  education: EducationRecord | null;
  onSuccess: (education: EducationRecord) => void;
  onCancel: () => void;
};

function formatDateForInput(date: Date | null) {
  if (!date) return "";

  const value = new Date(date);

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function EducationForm({
  education,
  onSuccess,
  onCancel,
}: EducationFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: education?.degree ?? "",
      field: education?.field ?? "",
      institution: education?.institution ?? "",
      location: education?.location ?? "",
      startDate: education
        ? new Date(education.startDate)
        : undefined,
      endDate: education?.endDate
        ? new Date(education.endDate)
        : null,
      isCurrent: education?.isCurrent ?? false,
      description: education?.description ?? "",
    },
  });

  const isCurrent = form.watch("isCurrent");

  async function onSubmit(data: EducationFormData) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = education
        ? await updateEducation(education.id, data)
        : await createEducation(data);

      onSuccess(result.education as EducationRecord);
    } catch (error) {
      console.error("Education save failed:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the education record.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {/* Form header */}
      <div className="border-b bg-muted/20 px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {education ? "Edit record" : "New record"}
            </p>

            <h3 className="mt-1 text-xl font-semibold tracking-tight">
              {education
                ? "Edit education"
                : "Add education"}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Add an academic qualification or educational achievement.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close form"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-5 sm:p-6">
          <FieldGroup className="gap-6">
            {/* Degree */}
            <Field
              data-invalid={!!form.formState.errors.degree}
            >
              <FieldLabel htmlFor="degree">
                Degree / Qualification
              </FieldLabel>

              <Input
                id="degree"
                placeholder="e.g. Bachelor of Arts"
                {...form.register("degree")}
                aria-invalid={!!form.formState.errors.degree}
              />

              <FieldError
                errors={[form.formState.errors.degree]}
              />
            </Field>

            {/* Field + Institution */}
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                data-invalid={!!form.formState.errors.field}
              >
                <FieldLabel htmlFor="field">
                  Field of Study
                </FieldLabel>

                <Input
                  id="field"
                  placeholder="e.g. Accounting and Finance"
                  {...form.register("field")}
                  aria-invalid={!!form.formState.errors.field}
                />

                <FieldError
                  errors={[form.formState.errors.field]}
                />
              </Field>

              <Field
                data-invalid={!!form.formState.errors.institution}
              >
                <FieldLabel htmlFor="institution">
                  Institution
                </FieldLabel>

                <Input
                  id="institution"
                  placeholder="e.g. Addis Ababa University"
                  {...form.register("institution")}
                  aria-invalid={
                    !!form.formState.errors.institution
                  }
                />

                <FieldError
                  errors={[form.formState.errors.institution]}
                />
              </Field>
            </div>

            {/* Location */}
            <Field
              data-invalid={!!form.formState.errors.location}
            >
              <FieldLabel htmlFor="location">
                Location
              </FieldLabel>

              <Input
                id="location"
                placeholder="e.g. Addis Ababa, Ethiopia"
                {...form.register("location")}
                aria-invalid={!!form.formState.errors.location}
              />

              <FieldError
                errors={[form.formState.errors.location]}
              />
            </Field>

            {/* Dates */}
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                data-invalid={!!form.formState.errors.startDate}
              >
                <FieldLabel htmlFor="startDate">
                  Start Date
                </FieldLabel>

                <Input
                  id="startDate"
                  type="date"
                  defaultValue={formatDateForInput(
                    education?.startDate
                      ? new Date(education.startDate)
                      : null,
                  )}
                  onChange={(event) => {
                    form.setValue(
                      "startDate",
                      parseDate(event.target.value) as Date,
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                  aria-invalid={
                    !!form.formState.errors.startDate
                  }
                />

                <FieldError
                  errors={[form.formState.errors.startDate]}
                />
              </Field>

              <Field
                data-invalid={!!form.formState.errors.endDate}
              >
                <FieldLabel htmlFor="endDate">
                  End Date
                </FieldLabel>

                <Input
                  id="endDate"
                  type="date"
                  disabled={isCurrent}
                  defaultValue={formatDateForInput(
                    education?.endDate
                      ? new Date(education.endDate)
                      : null,
                  )}
                  onChange={(event) => {
                    form.setValue(
                      "endDate",
                      event.target.value
                        ? parseDate(event.target.value) ?? null
                        : null,
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                  aria-invalid={
                    !!form.formState.errors.endDate
                  }
                />

                <FieldError
                  errors={[form.formState.errors.endDate]}
                />
              </Field>
            </div>

            {/* Current education */}
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <FieldLabel
                    htmlFor="isCurrent"
                    className="cursor-pointer"
                  >
                    Currently studying
                  </FieldLabel>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    Enable this if the education is currently
                    in progress.
                  </p>
                </div>

                <Switch
                  id="isCurrent"
                  checked={isCurrent}
                  onCheckedChange={(checked) => {
                    form.setValue("isCurrent", checked, {
                      shouldValidate: true,
                    });

                    if (checked) {
                      form.setValue("endDate", null, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <Field
              data-invalid={!!form.formState.errors.description}
            >
              <FieldLabel htmlFor="description">
                Description
              </FieldLabel>

              <Textarea
                id="description"
                rows={5}
                placeholder="Briefly describe this education, specialization, or what was achieved."
                {...form.register("description")}
                aria-invalid={
                  !!form.formState.errors.description
                }
              />

              <FieldError
                errors={[form.formState.errors.description]}
              />
            </Field>
          </FieldGroup>

          {/* Server error */}
          {submitError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {submitError}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t bg-muted/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
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

            {isSubmitting
              ? "Saving..."
              : education
                ? "Save Changes"
                : "Save Education"}
          </Button>
        </div>
      </form>
    </div>
  );
}