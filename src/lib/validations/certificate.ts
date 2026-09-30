import { z } from "zod";

export const certificateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Certificate title is required.")
    .max(
      200,
      "Certificate title must be 200 characters or less.",
    ),

  issuer: z
    .string()
    .trim()
    .max(
      150,
      "Issuer must be 150 characters or less.",
    )
    .optional()
    .or(z.literal("")),

  issueDate: z
    .string()
    .optional()
    .or(z.literal("")),

  credentialId: z
    .string()
    .trim()
    .max(
      200,
      "Credential ID must be 200 characters or less.",
    )
    .optional()
    .or(z.literal("")),

  credentialUrl: z
    .string()
    .trim()
    .url("Please provide a valid credential URL.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(
      2000,
      "Description must be 2000 characters or less.",
    )
    .optional()
    .or(z.literal("")),

  imageUrl: z
    .string()
    .url("Please provide a valid certificate image URL.")
    .optional()
    .or(z.literal("")),

  imagePublicId: z
    .string()
    .trim()
    .max(
      500,
      "Image public ID is too long.",
    )
    .optional()
    .or(z.literal("")),
});

export type CertificateFormData =
  z.infer<typeof certificateSchema>;