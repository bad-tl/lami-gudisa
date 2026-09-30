"use client";

import * as React from "react";

import {
  Image as ImageIcon,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  gallerySchema,
  type GalleryFormData,
} from "@/lib/validations/gallery";

import {
  createGalleryItem,
  updateGalleryItem,
} from "@/app/dashboard/gallery/actions";

import { uploadGalleryImage } from "@/app/dashboard/gallery/upload/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type GalleryRecord = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  imageUrl: string;
  imagePublicId: string;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type GalleryFormProps = {
  item?: GalleryRecord | null;
  onSuccess: (item: GalleryRecord) => void;
  onCancel: () => void;
};

export function GalleryForm({
  item,
  onSuccess,
  onCancel,
}: GalleryFormProps) {
  const [isUploading, setIsUploading] =
    React.useState(false);

  const [isSaving, setIsSaving] =
    React.useState(false);

  const [serverError, setServerError] =
    React.useState("");

  const [previewUrl, setPreviewUrl] =
    React.useState(item?.imageUrl ?? "");

  const fileInputRef =
    React.useRef<HTMLInputElement>(null);

  const isEditing = Boolean(item);

  const form = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: item?.title ?? "",
      category: item?.category ?? "",
      description: item?.description ?? "",
      imageUrl: item?.imageUrl ?? "",
      imagePublicId: item?.imagePublicId ?? "",
    },
  });

  const imageUrl = form.watch("imageUrl");

  React.useEffect(() => {
    setPreviewUrl(imageUrl || "");
  }, [imageUrl]);

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setServerError("");
    setIsUploading(true);

    try {
      const localPreview =
        URL.createObjectURL(file);

      setPreviewUrl(localPreview);

      const formData = new FormData();
      formData.append("file", file);

      const result =
        await uploadGalleryImage(formData);

      form.setValue(
        "imageUrl",
        result.imageUrl,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      form.setValue(
        "imagePublicId",
        result.imagePublicId,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setPreviewUrl(result.imageUrl);

      URL.revokeObjectURL(localPreview);
    } catch (error) {
      setPreviewUrl(
        item?.imageUrl ?? "",
      );

      setServerError(
        error instanceof Error
          ? error.message
          : "Image upload failed.",
      );
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleRemoveImage() {
    form.setValue("imageUrl", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    form.setValue("imagePublicId", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(
    data: GalleryFormData,
  ) {
    setServerError("");
    setIsSaving(true);

    try {
      const savedItem = item
        ? await updateGalleryItem(
            item.id,
            data,
          )
        : await createGalleryItem(data);

      onSuccess(savedItem);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <ImageIcon className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {isEditing
                  ? "Edit Gallery Item"
                  : "Add Gallery Item"}
              </h2>

              <p className="text-sm text-muted-foreground">
                Add a visual item to the portfolio gallery.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSaving || isUploading}
          className="gap-2 self-start sm:self-auto"
        >
          <X className="size-4" />
          Cancel
        </Button>
      </div>

      {/* Image */}
      <div className="space-y-3">
        <Label>Gallery Image</Label>

        <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Gallery preview"
                className="aspect-video w-full object-cover"
              />

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isUploading || isSaving}
                className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-black/90 disabled:pointer-events-none disabled:opacity-50"
                aria-label="Remove image"
              >
                <X className="size-4" />
              </button>

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg">
                    <Loader2 className="size-4 animate-spin" />
                    Uploading...
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={isUploading || isSaving}
              className="flex aspect-video w-full flex-col items-center justify-center gap-3 px-6 text-center transition hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
            >
              <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
                <Upload className="size-6" />
              </div>

              <div>
                <p className="font-medium text-foreground">
                  Upload gallery image
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  JPG, PNG, or WebP · Maximum 5 MB
                </p>
              </div>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />

        {form.formState.errors.imageUrl && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.imageUrl
                .message
            }
          </p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="gallery-title">
          Title
        </Label>

        <Input
          id="gallery-title"
          placeholder="e.g. Professional Achievement"
          {...form.register("title")}
          disabled={isSaving || isUploading}
        />

        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.title
                .message
            }
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="gallery-category">
          Category
        </Label>

        <Input
          id="gallery-category"
          placeholder="e.g. Professional, Award, Event"
          {...form.register("category")}
          disabled={isSaving || isUploading}
        />

        {form.formState.errors.category && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.category
                .message
            }
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="gallery-description">
          Description
        </Label>

        <Textarea
          id="gallery-description"
          placeholder="Add a short description..."
          rows={5}
          {...form.register("description")}
          disabled={isSaving || isUploading}
        />

        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.description
                .message
            }
          </p>
        )}
      </div>

      {/* Server error */}
      {serverError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving || isUploading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isSaving ||
            isUploading ||
            !form.watch("imageUrl")
          }
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              {isEditing
                ? "Save Changes"
                : "Create Gallery Item"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}