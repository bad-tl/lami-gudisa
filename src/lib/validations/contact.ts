import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Please provide a valid URL.")
  .optional()
  .or(z.literal(""));

export const contactSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address."),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .max(50, "Phone number is too long."),

  location: z
    .string()
    .trim()
    .min(1, "Location is required.")
    .max(150, "Location is too long."),

  availability: z
    .string()
    .trim()
    .max(200, "Availability must be 200 characters or less.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or less.")
    .optional()
    .or(z.literal("")),

  facebook: optionalUrl,
  telegram: optionalUrl,
  instagram: optionalUrl,
  linkedin: optionalUrl,
});

export type ContactFormData = z.infer<typeof contactSchema>;