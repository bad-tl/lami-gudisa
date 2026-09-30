import { z } from "zod";

export const experienceSchema = z
  .object({
    position: z
      .string()
      .trim()
      .min(1, "Position is required.")
      .max(
        200,
        "Position must be 200 characters or less.",
      ),

    company: z
      .string()
      .trim()
      .min(1, "Company is required.")
      .max(
        200,
        "Company must be 200 characters or less.",
      ),

    employmentType: z
      .string()
      .trim()
      .max(
        100,
        "Employment type must be 100 characters or less.",
      )
      .optional()
      .or(z.literal("")),

    location: z
      .string()
      .trim()
      .max(
        200,
        "Location must be 200 characters or less.",
      )
      .optional()
      .or(z.literal("")),

    startDate: z
      .date({
        error: "Start date is required.",
      }),

    endDate: z
      .date()
      .nullable()
      .optional(),

    isCurrent: z.boolean(),

    description: z
      .string()
      .trim()
      .max(
        3000,
        "Description must be 3000 characters or less.",
      )
      .optional()
      .or(z.literal("")),

    achievements: z
      .string()
      .trim()
      .max(
        3000,
        "Achievements must be 3000 characters or less.",
      )
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (
      data.isCurrent &&
      data.endDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message:
          "End date must be empty for a current position.",
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
        message:
          "End date cannot be before the start date.",
      });
    }
  });

export type ExperienceFormData =
  z.infer<typeof experienceSchema>;