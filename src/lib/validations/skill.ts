import { z } from "zod";

export const skillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Skill name is required.")
    .max(150, "Skill name must be 150 characters or less."),

  category: z
    .string()
    .trim()
    .max(100, "Category must be 100 characters or less.")
    .optional()
    .or(z.literal("")),

  level: z
    .number()
    .int("Skill level must be a whole number.")
    .min(0, "Skill level cannot be below 0.")
    .max(100, "Skill level cannot exceed 100.")
    .nullable()
    .optional(),

  icon: z
    .string()
    .trim()
    .max(100, "Icon name must be 100 characters or less.")
    .optional()
    .or(z.literal("")),
});

export type SkillFormData = z.infer<typeof skillSchema>;