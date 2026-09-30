"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  certificateSchema,
  type CertificateFormData,
} from "@/lib/validations/certificate";

import {
  createCertificate,
  updateCertificate,
} from "@/app/dashboard/certificates/actions";

import { uploadCertificateImage } from "@/app/dashboard/certificates/upload/actions";

type CertificateItem = {
  id: string;
  title: string;
  issuer: string | null;
  issueDate: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type CertificateFormProps = {
  certificate?: {
    id: string;
    title: string;
    issuer: string | null;
    issueDate: Date | null;
    credentialId: string | null;
    credentialUrl: string | null;
    description: string | null;
    imageUrl: string | null;
    imagePublicId: string | null;
  } | null;

  onSuccess: (certificate: CertificateItem) => void;
  onCancel: () => void;
};


export function CertificateForm({
  certificate,
  onSuccess,
  onCancel,
}: CertificateFormProps) {
  const isEditing = Boolean(certificate);

  const [uploading, setUploading] =
    React.useState(false);

  const [saving, setSaving] =
    React.useState(false);

  const [previewUrl, setPreviewUrl] =
    React.useState<string | null>(
      certificate?.imageUrl ?? null,
    );

  const [imageUrl, setImageUrl] =
    React.useState(
      certificate?.imageUrl ?? "",
    );

  const [imagePublicId, setImagePublicId] =
    React.useState(
      certificate?.imagePublicId ?? "",
    );

  const fileInputRef =
    React.useRef<HTMLInputElement>(null);

  const form = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: certificate?.title ?? "",
      issuer: certificate?.issuer ?? "",
      issueDate: certificate?.issueDate
        ? new Date(certificate.issueDate)
            .toISOString()
            .split("T")[0]
        : "",
      credentialId:
        certificate?.credentialId ?? "",
      credentialUrl:
        certificate?.credentialUrl ?? "",
      description:
        certificate?.description ?? "",
      imageUrl:
        certificate?.imageUrl ?? "",
      imagePublicId:
        certificate?.imagePublicId ?? "",
    },
  });

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const localPreview =
      URL.createObjectURL(file);

    setPreviewUrl(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result =
        await uploadCertificateImage(formData);

      setImageUrl(result.imageUrl);
      setImagePublicId(
        result.imagePublicId,
      );

      form.setValue(
        "imageUrl",
        result.imageUrl,
        {
          shouldValidate: true,
        },
      );

      form.setValue(
        "imagePublicId",
        result.imagePublicId,
        {
          shouldValidate: true,
        },
      );

      setPreviewUrl(result.imageUrl);

      URL.revokeObjectURL(localPreview);
    } catch (error) {
      console.error(error);

      setPreviewUrl(
        certificate?.imageUrl ?? null,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Image upload failed.",
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function onSubmit(
    data: CertificateFormData,
  ) {
    setSaving(true);

    try {
      const payload = {
        ...data,
        imageUrl,
        imagePublicId,
      };

      const result = isEditing
        ? await updateCertificate(
            certificate!.id,
            payload,
          )
        : await createCertificate(
            payload,
          );

      onSuccess(result);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Certificate image */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">
            Certificate Image
          </label>

          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, or WebP. Maximum 5 MB.
          </p>
        </div>

        {previewUrl ? (
          <div className="relative overflow-hidden rounded-xl border bg-muted/30">
            <div className="relative flex min-h-[240px] items-center justify-center p-4">
              <Image
                src={previewUrl}
                alt="Certificate preview"
                width={1000}
                height={700}
                className="max-h-[420px] w-auto object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                setImageUrl("");
                setImagePublicId("");

                form.setValue(
                  "imageUrl",
                  "",
                  {
                    shouldValidate: true,
                  },
                );

                form.setValue(
                  "imagePublicId",
                  "",
                  {
                    shouldValidate: true,
                  },
                );
              }}
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border bg-background/90 shadow-sm transition hover:bg-background"
              aria-label="Remove certificate image"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={uploading}
            className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center transition hover:bg-muted/40 disabled:pointer-events-none disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="mb-3 size-7 animate-spin" />

                <span className="text-sm font-medium">
                  Uploading certificate...
                </span>
              </>
            ) : (
              <>
                <Upload className="mb-3 size-7 text-muted-foreground" />

                <span className="text-sm font-medium">
                  Upload certificate image
                </span>

                <span className="mt-1 text-xs text-muted-foreground">
                  Click to choose an image
                </span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label
          htmlFor="certificate-title"
          className="text-sm font-medium"
        >
          Certificate Title
        </label>

        <input
          id="certificate-title"
          {...form.register("title")}
          placeholder="e.g. Advanced Financial Reporting"
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />

        {form.formState.errors.title && (
          <p className="text-xs text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Issuer + date */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="certificate-issuer"
            className="text-sm font-medium"
          >
            Issuing Organization
          </label>

          <input
            id="certificate-issuer"
            {...form.register("issuer")}
            placeholder="e.g. Addis Ababa University"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          {form.formState.errors.issuer && (
            <p className="text-xs text-destructive">
              {form.formState.errors.issuer.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="certificate-date"
            className="text-sm font-medium"
          >
            Issue Date
          </label>

          <input
            id="certificate-date"
            type="date"
            {...form.register("issueDate")}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          {form.formState.errors.issueDate && (
            <p className="text-xs text-destructive">
              {form.formState.errors.issueDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Credential ID + URL */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="credential-id"
            className="text-sm font-medium"
          >
            Credential ID
          </label>

          <input
            id="credential-id"
            {...form.register(
              "credentialId",
            )}
            placeholder="Optional"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          {form.formState.errors.credentialId && (
            <p className="text-xs text-destructive">
              {
                form.formState.errors
                  .credentialId.message
              }
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="credential-url"
            className="text-sm font-medium"
          >
            Credential URL
          </label>

          <input
            id="credential-url"
            type="url"
            {...form.register(
              "credentialUrl",
            )}
            placeholder="https://..."
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          {form.formState.errors.credentialUrl && (
            <p className="text-xs text-destructive">
              {
                form.formState.errors
                  .credentialUrl.message
              }
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="certificate-description"
          className="text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="certificate-description"
          {...form.register(
            "description",
          )}
          rows={5}
          placeholder="Briefly describe what this certificate represents..."
          className="w-full resize-y rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />

        {form.formState.errors.description && (
          <p className="text-xs text-destructive">
            {
              form.formState.errors
                .description.message
            }
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving || uploading}
          className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            saving ||
            uploading
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:pointer-events-none disabled:opacity-60"
        >
          {saving && (
            <Loader2 className="size-4 animate-spin" />
          )}

          {isEditing
            ? "Update Certificate"
            : "Save Certificate"}
        </button>
      </div>
    </form>
  );
}