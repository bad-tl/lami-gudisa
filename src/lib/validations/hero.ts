import { z } from "zod";

export const heroSchema = z.object({
  eyebrow: z
    .string()
    .trim()
    .max(100, "Eyebrow must be 100 characters or less.")
    .optional()
    .or(z.literal("")),

  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or less."),

  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must be 150 characters or less."),

  headline: z
    .string()
    .trim()
    .min(1, "Headline is required.")
    .max(250, "Headline must be 250 characters or less."),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or less.")
    .optional()
    .or(z.literal("")),

  imageUrl: z
    .string()
    .url("Please provide a valid image URL.")
    .optional()
    .or(z.literal("")),

  imagePublicId: z
    .string()
    .trim()
    .max(500, "Image public ID is too long.")
    .optional()
    .or(z.literal("")),

  primaryButtonText: z
    .string()
    .trim()
    .max(80, "Primary button text must be 80 characters or less.")
    .optional()
    .or(z.literal("")),

  primaryButtonUrl: z
    .string()
    .trim()
    .max(500, "Primary button URL is too long.")
    .optional()
    .or(z.literal("")),

  secondaryButtonText: z
    .string()
    .trim()
    .max(80, "Secondary button text must be 80 characters or less.")
    .optional()
    .or(z.literal("")),

  secondaryButtonUrl: z
    .string()
    .trim()
    .max(500, "Secondary button URL is too long.")
    .optional()
    .or(z.literal("")),
});

export type HeroFormData = z.infer<typeof heroSchema>;