import { z } from "zod";

export const educationSchema = z
  .object({
    degree: z
      .string()
      .trim()
      .min(1, "Degree or qualification is required.")
      .max(200, "Degree or qualification must be 200 characters or less."),

    field: z
      .string()
      .trim()
      .max(200, "Field of study must be 200 characters or less.")
      .optional()
      .or(z.literal("")),

    institution: z
      .string()
      .trim()
      .min(1, "Institution is required.")
      .max(200, "Institution must be 200 characters or less."),

    location: z
      .string()
      .trim()
      .max(200, "Location must be 200 characters or less.")
      .optional()
      .or(z.literal("")),

    startDate: z.date({
      error: "Start date is required.",
    }),

    endDate: z.date().nullable().optional(),

    isCurrent: z.boolean(),

    description: z
      .string()
      .trim()
      .max(3000, "Description must be 3000 characters or less.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.isCurrent && data.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be empty for current education.",
      });
    }

    if (
      !data.isCurrent &&
      data.endDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date cannot be before the start date.",
      });
    }
  });

export type EducationFormData = z.infer<typeof educationSchema>;