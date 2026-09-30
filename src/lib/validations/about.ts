import { z } from "zod";

export const aboutSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or less."),

  shortDescription: z
    .string()
    .trim()
    .max(
      500,
      "Short description must be 500 characters or less."
    )
    .optional()
    .or(z.literal("")),

  fullDescription: z
    .string()
    .trim()
    .max(
      3000,
      "Full description must be 3000 characters or less."
    )
    .optional()
    .or(z.literal("")),

  yearsOfExperience: z
    .string()
    .trim()
    .max(
      50,
      "Years of experience must be 50 characters or less."
    )
    .optional()
    .or(z.literal("")),

  location: z
    .string()
    .trim()
    .max(
      150,
      "Location must be 150 characters or less."
    )
    .optional()
    .or(z.literal("")),

  position: z
    .string()
    .trim()
    .max(
      150,
      "Position must be 150 characters or less."
    )
    .optional()
    .or(z.literal("")),

  organization: z
    .string()
    .trim()
    .max(
      200,
      "Organization must be 200 characters or less."
    )
    .optional()
    .or(z.literal("")),

  educationSummary: z
    .string()
    .trim()
    .max(
      500,
      "Education summary must be 500 characters or less."
    )
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
    .max(
      500,
      "Image public ID is too long."
    )
    .optional()
    .or(z.literal("")),
});

export type AboutFormData = z.infer<typeof aboutSchema>;