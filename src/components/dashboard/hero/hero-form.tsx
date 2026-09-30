"use client";

import * as React from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  ImagePlus,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { hero } from "@/generated/prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroVisual } from "@/components/portfolio/hero/hero-visual";

import {
  heroSchema,
  type HeroFormData,
} from "@/lib/validations/hero";

import {
  publishHero,
  saveHero,
} from "@/app/dashboard/hero/actions";

import { uploadHeroImage } from "@/app/dashboard/hero/upload/actions";

type HeroFormProps = {
  hero: hero | null;
};

type FormStatus =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

export function HeroForm({ hero }: HeroFormProps) {
  const router = useRouter();

  const [isSaving, setIsSaving] = React.useState(false);

  const [saveMode, setSaveMode] = React.useState<
    "draft" | "publish" | null
  >(null);

  const [formStatus, setFormStatus] =
    React.useState<FormStatus>(null);

  /*
   * Local image state
   *
   * selectedImage:
   * The actual file selected from the computer.
   *
   * imagePreview:
   * The temporary browser URL used to display the image immediately.
   */
  const [selectedImage, setSelectedImage] =
    React.useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    React.useState<string>(hero?.imageUrl ?? "");

  const [isUploadingImage, setIsUploadingImage] =
    React.useState(false);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),

    defaultValues: {
      eyebrow: hero?.eyebrow ?? "",

      name:
        hero?.name ??
        "Lami Gudisa",

      title:
        hero?.title ??
        "Accountant & Controller Officer",

      headline:
        hero?.headline ??
        "Turning financial insight into smarter business decisions.",

      description:
        hero?.description ?? "",

      imageUrl:
        hero?.imageUrl ?? "",

      imagePublicId:
        hero?.imagePublicId ?? "",

      primaryButtonText:
        hero?.primaryButtonText ??
        "View My Experience",

      primaryButtonUrl:
        hero?.primaryButtonUrl ??
        "/experience",

      secondaryButtonText:
        hero?.secondaryButtonText ??
        "Download CV",

      secondaryButtonUrl:
        hero?.secondaryButtonUrl ??
        "/cv",
    },
  });

  const formData = watch();

  /*
   * Clean up temporary browser URLs when the component unmounts.
   */
  React.useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /*
   * Select an image from the local computer and upload it
   * to Cloudinary through the protected server action.
   */
  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFormStatus({
        type: "error",
        message: "Please choose a JPG, PNG, or WebP image.",
      });
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setFormStatus({
        type: "error",
        message: "Image must be 5 MB or smaller.",
      });
      event.target.value = "";
      return;
    }

    if (isUploadingImage) {
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(previewUrl);
    setIsUploadingImage(true);
    setFormStatus(null);

    // Never save the temporary browser blob URL to Neon.
    setValue("imageUrl", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    setValue("imagePublicId", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const result = await uploadHeroImage(uploadData);

      setValue("imageUrl", result.imageUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("imagePublicId", result.imagePublicId, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setImagePreview(result.imageUrl);

      setFormStatus({
        type: "success",
        message: "Profile image uploaded successfully.",
      });
    } catch (error) {
      console.error("Hero image upload error:", error);

      URL.revokeObjectURL(previewUrl);

      setImagePreview(hero?.imageUrl ?? "");
      setValue("imageUrl", hero?.imageUrl ?? "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("imagePublicId", hero?.imagePublicId ?? "", {
        shouldDirty: true,
        shouldValidate: true,
      });

      setFormStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Image upload failed. Please try again.",
      });
    } finally {
      setIsUploadingImage(false);
      setSelectedImage(null);
      event.target.value = "";
    }
  }

  /*
   * Remove the currently selected image.
   */
  function removeImage() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    if (isUploadingImage) return;

    setSelectedImage(null);
    setImagePreview("");

    setValue("imageUrl", "", {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("imagePublicId", "", {
      shouldDirty: true,
      shouldValidate: true,
    });

    setFormStatus(null);
  }

  /*
   * Save either a draft or a published version.
   */
  async function handleSave(
    data: HeroFormData,
    mode: "draft" | "publish"
  ) {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveMode(mode);
    setFormStatus(null);

    try {
      /* Never save a local blob URL or an image that is still uploading. */
      if (isUploadingImage || selectedImage) {
        throw new Error(
          "Please wait for the image upload to finish before saving."
        );
      }

      if (data.imageUrl?.startsWith("blob:")) {
        throw new Error(
          "The selected image has not finished uploading. Please wait and try again."
        );
      }

      const result =
        mode === "draft"
          ? await saveHero(data)
          : await publishHero(data);

      if (!result.success) {
        throw new Error(
          mode === "draft"
            ? "Unable to save the Hero draft."
            : "Unable to publish the Hero."
        );
      }

      setFormStatus({
        type: "success",
        message:
          mode === "draft"
            ? "Hero draft saved successfully."
            : "Hero published successfully.",
      });

      router.refresh();
    } catch (error) {
      console.error("Hero save error:", error);

      setFormStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
      setSaveMode(null);
    }
  }

  /*
   * Handle Zod validation errors.
   */
  function handleValidationError() {
    setFormStatus({
      type: "error",
      message:
        "Please fix the highlighted fields before saving.",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(
        (data) =>
          handleSave(data, "publish"),
        handleValidationError
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">

        {/* ========================================================= */}
        {/* EDITOR */}
        {/* ========================================================= */}

        <div className="space-y-6">

          {/* ======================================================= */}
          {/* HERO CONTENT */}
          {/* ======================================================= */}

          <section className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="border-b border-border/60 px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>

                <div>
                  <h2 className="font-semibold tracking-tight">
                    Hero content
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Define the professional message visitors see first.
                  </p>
                </div>

              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">

              {/* Eyebrow */}
              <div className="space-y-2">
                <label
                  htmlFor="eyebrow"
                  className="text-sm font-medium"
                >
                  Eyebrow
                </label>

                <Input
                  id="eyebrow"
                  {...register("eyebrow")}
                  placeholder="ACCOUNTING • FINANCE • ANALYSIS"
                  className="h-11 rounded-xl"
                  aria-invalid={Boolean(errors.eyebrow)}
                />

                {errors.eyebrow && (
                  <p className="text-xs text-destructive">
                    {errors.eyebrow.message}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  A short professional category displayed above the name.
                </p>
              </div>

              {/* Name + Title */}
              <div className="grid gap-5 md:grid-cols-2">

                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium"
                  >
                    Name
                  </label>

                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Lami Gudisa"
                    className="h-11 rounded-xl"
                    aria-invalid={Boolean(errors.name)}
                  />

                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium"
                  >
                    Professional title
                  </label>

                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Accountant & Controller Officer"
                    className="h-11 rounded-xl"
                    aria-invalid={Boolean(errors.title)}
                  />

                  {errors.title && (
                    <p className="text-xs text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

              </div>

              {/* Headline */}
              <div className="space-y-2">
                <label
                  htmlFor="headline"
                  className="text-sm font-medium"
                >
                  Headline
                </label>

                <textarea
                  id="headline"
                  {...register("headline")}
                  rows={3}
                  placeholder="Turning financial insight into smarter business decisions."
                  aria-invalid={Boolean(errors.headline)}
                  className="flex min-h-24 w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-xs outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/10 aria-[invalid=true]:border-destructive"
                />

                {errors.headline && (
                  <p className="text-xs text-destructive">
                     {errors.headline.message}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  The main statement that communicates Lami&apos;s
                  professional value.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  {...register("description")}
                  rows={5}
                  placeholder="Describe Lami's experience, expertise, and professional value..."
                  aria-invalid={Boolean(errors.description)}
                  className="flex min-h-32 w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-xs outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/10 aria-[invalid=true]:border-destructive"
                />

                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Keep this concise enough to remain easy to scan on the
                  landing page.
                </p>
              </div>

            </div>
          </section>

          {/* ======================================================= */}
          {/* PROFILE IMAGE */}
          {/* ======================================================= */}

          <section className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm transition-shadow duration-300 hover:shadow-md">

            <div className="border-b border-border/60 px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ImagePlus className="size-5" />
                </div>

                <div>
                  <h2 className="font-semibold tracking-tight">
                    Profile image
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose a professional photo from the computer.
                  </p>
                </div>

              </div>
            </div>

            <div className="p-5 sm:p-6">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                {/* Image preview */}
                <div className="relative flex size-36 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-lg ring-1 ring-border/70 sm:size-40">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Hero profile"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ImagePlus className="size-7" />

                      <span className="text-[11px] font-medium">
                        No image
                      </span>
                    </div>
                  )}

                </div>

                {/* Image controls */}
                <div className="min-w-0 flex-1">

                  <p className="text-sm font-semibold">
                    Professional profile photo
                  </p>

                  <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                    Choose a high-quality portrait from the local computer.
                    It will be uploaded securely to Cloudinary, and you can change it whenever you want.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {/* Hidden file input */}
                    <input
                      id="hero-image-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={isUploadingImage}
                      className="sr-only"
                    />

                    {/* File picker button */}
                    <label
                      htmlFor="hero-image-upload"
                      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-medium shadow-xs transition-all duration-200 ${
                        isUploadingImage
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:-translate-y-0.5 hover:bg-accent hover:shadow-sm"
                      }`}
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <ImagePlus className="size-4" />
                          {imagePreview ? "Change image" : "Choose image"}
                        </>
                      )}
                    </label>

                    {/* Remove */}
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={removeImage}
                        disabled={isSaving || isUploadingImage}
                      >
                        Remove
                      </Button>
                    )}

                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>JPG</span>
                    <span>PNG</span>
                    <span>WebP</span>
                    <span>Maximum 5 MB</span>
                  </div>

                  {selectedImage && (
                    <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">

                      <p className="truncate text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        Selected: {selectedImage.name}
                      </p>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Image preview ready. Cloudinary upload will be connected next.
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </div>
          </section>

          {/* ======================================================= */}
          {/* CALL TO ACTIONS */}
          {/* ======================================================= */}

          <section className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm transition-shadow duration-300 hover:shadow-md">

            <div className="border-b border-border/60 px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ArrowUpRight className="size-5" />
                </div>

                <div>
                  <h2 className="font-semibold tracking-tight">
                    Call to actions
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Control the actions visitors can take from the Hero.
                  </p>
                </div>

              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">

              {/* Primary */}
              <div className="space-y-4">

                <div>
                  <p className="text-sm font-semibold">
                    Primary action
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Your most important visitor action.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  <div className="space-y-2">
                    <label
                      htmlFor="primaryButtonText"
                      className="text-sm font-medium"
                    >
                      Button text
                    </label>

                    <Input
                      id="primaryButtonText"
                      {...register("primaryButtonText")}
                      placeholder="View My Experience"
                      className="h-11 rounded-xl"
                      aria-invalid={Boolean(
                        errors.primaryButtonText
                      )}
                    />

                    {errors.primaryButtonText && (
                      <p className="text-xs text-destructive">
                        {errors.primaryButtonText.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="primaryButtonUrl"
                      className="text-sm font-medium"
                    >
                      Button URL
                    </label>

                    <Input
                      id="primaryButtonUrl"
                      {...register("primaryButtonUrl")}
                      placeholder="/experience"
                      className="h-11 rounded-xl"
                      aria-invalid={Boolean(
                        errors.primaryButtonUrl
                      )}
                    />

                    {errors.primaryButtonUrl && (
                      <p className="text-xs text-destructive">
                        {errors.primaryButtonUrl.message}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              <div className="border-t border-border/60" />

              {/* Secondary */}
              <div className="space-y-4">

                <div>
                  <p className="text-sm font-semibold">
                    Secondary action
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    A supporting action for visitors.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  <div className="space-y-2">
                    <label
                      htmlFor="secondaryButtonText"
                      className="text-sm font-medium"
                    >
                      Button text
                    </label>

                    <Input
                      id="secondaryButtonText"
                      {...register("secondaryButtonText")}
                      placeholder="Download CV"
                      className="h-11 rounded-xl"
                      aria-invalid={Boolean(
                        errors.secondaryButtonText
                      )}
                    />

                    {errors.secondaryButtonText && (
                      <p className="text-xs text-destructive">
                        {errors.secondaryButtonText.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="secondaryButtonUrl"
                      className="text-sm font-medium"
                    >
                      Button URL
                    </label>

                    <Input
                      id="secondaryButtonUrl"
                      {...register("secondaryButtonUrl")}
                      placeholder="/cv"
                      className="h-11 rounded-xl"
                      aria-invalid={Boolean(
                        errors.secondaryButtonUrl
                      )}
                    />

                    {errors.secondaryButtonUrl && (
                      <p className="text-xs text-destructive">
                        {errors.secondaryButtonUrl.message}
                      </p>
                    )}
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* ======================================================= */}
          {/* STATUS MESSAGE */}
          {/* ======================================================= */}

          {formStatus && (
            <div
              role="status"
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm ${
                formStatus.type === "success"
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                  : "border-destructive/20 bg-destructive/5 text-destructive"
              }`}
            >
              {formStatus.type === "success" ? (
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 size-5 shrink-0" />
              )}

              <p>{formStatus.message}</p>
            </div>
          )}

          {/* ======================================================= */}
          {/* ACTION BAR */}
          {/* ======================================================= */}

          <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/95 p-3 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">

            <p className="hidden text-xs text-muted-foreground sm:block">
              {isDirty
                ? "You have unsaved changes."
                : "All changes are saved."}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

              {/* Save Draft */}
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl sm:px-6"
                disabled={isSaving || isUploadingImage}
                onClick={handleSubmit(
                  (data) =>
                    handleSave(data, "draft"),
                  handleValidationError
                )}
              >
                {isSaving && saveMode === "draft" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </Button>

              {/* Publish */}
              <Button
                type="submit"
                className="h-11 rounded-xl bg-primary px-6 font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
                disabled={isSaving || isUploadingImage}
              >
                {isSaving && saveMode === "publish" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Changes"
                )}
              </Button>

            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* LIVE PREVIEW */}
        {/* ========================================================= */}

        <aside className="xl:sticky xl:top-24 xl:self-start">

          <section className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm">

            <div className="border-b border-border/60 px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>

                <div>
                  <h2 className="font-semibold tracking-tight">
                    Live preview
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Preview exactly how the public Hero will look.
                  </p>
                </div>

              </div>
            </div>

            <div className="overflow-hidden bg-[#020817]">

              <HeroVisual
                eyebrow={formData.eyebrow}
                name={formData.name}
                title={formData.title}
                headline={formData.headline}
                description={formData.description}
                imageUrl={imagePreview}
                primaryButtonText={
                  formData.primaryButtonText
                }
                primaryButtonUrl={
                  formData.primaryButtonUrl
                }
                secondaryButtonText={
                  formData.secondaryButtonText
                }
                secondaryButtonUrl={
                  formData.secondaryButtonUrl
                }
                showScrollIndicator={false}
                showExperienceBadge
              />

            </div>

          </section>

        </aside>

      </div>
    </form>
  );
}