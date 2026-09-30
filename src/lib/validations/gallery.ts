import { z } from "zod";

export const gallerySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or less."),

  category: z
    .string()
    .trim()
    .max(100, "Category must be 100 characters or less.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or less.")
    .optional()
    .or(z.literal("")),

  imageUrl: z
    .string()
    .url("Please provide a valid image URL."),

  imagePublicId: z
    .string()
    .trim()
    .min(1, "Image public ID is required.")
    .max(500, "Image public ID is too long."),
});

export type GalleryFormData = z.infer<typeof gallerySchema>;