
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  BriefcaseBusiness,
  Image as ImageIcon,
  Loader2,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  aboutSchema,
  type AboutFormData,
} from "@/lib/validations/about";

import {
  publishAbout,
  saveAbout,
} from "@/app/dashboard/about/actions";

import { uploadAboutImage } from "@/app/dashboard/about/upload/actions";

type AboutRecord = {
  id: string;
  title: string;
  shortDescription: string | null;
  fullDescription: string | null;
  yearsOfExperience: string | null;
  location: string | null;
  position: string | null;
  organization: string | null;
  educationSummary: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  status: string;
};

type AboutFormProps = {
  about: AboutRecord | null;
};

export function AboutForm({ about }: AboutFormProps) {
  const shouldReduceMotion = useReducedMotion();

  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] =
    React.useState(false);

  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: about?.title ?? "",
      shortDescription:
        about?.shortDescription ?? "",
      fullDescription:
        about?.fullDescription ?? "",
      yearsOfExperience:
        about?.yearsOfExperience ?? "",
      location: about?.location ?? "",
      position: about?.position ?? "",
      organization:
        about?.organization ?? "",
      educationSummary:
        about?.educationSummary ?? "",
      imageUrl: about?.imageUrl ?? "",
      imagePublicId:
        about?.imagePublicId ?? "",
    },
  });

  const imageUrl = watch("imageUrl");
  const [isUploading, setIsUploading] = React.useState(false);
const fileInputRef = React.useRef<HTMLInputElement>(null);

async function handleImageUpload(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  try {
    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAboutImage(formData);

    setValue("imageUrl", result.imageUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("imagePublicId", result.imagePublicId, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setMessage({
      type: "success",
      text: "Image uploaded successfully. Save or publish to keep the change.",
    });
  } catch (error) {
    console.error(
      "Failed to upload About image:",
      error,
    );

    setMessage({
      type: "error",
      text:
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading the image.",
    });
  } finally {
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
}

  async function handleSaveDraft(
    data: AboutFormData,
  ) {
    try {
      setIsSaving(true);
      setMessage(null);

      const result = await saveAbout(data);

      reset({
        title: result.about.title,
        shortDescription:
          result.about.shortDescription ?? "",
        fullDescription:
          result.about.fullDescription ?? "",
        yearsOfExperience:
          result.about.yearsOfExperience ?? "",
        location:
          result.about.location ?? "",
        position:
          result.about.position ?? "",
        organization:
          result.about.organization ?? "",
        educationSummary:
          result.about.educationSummary ?? "",
        imageUrl:
          result.about.imageUrl ?? "",
        imagePublicId:
          result.about.imagePublicId ?? "",
      });

      setMessage({
        type: "success",
        text: "Your About section was saved as a draft.",
      });
    } catch (error) {
      console.error(
        "Failed to save About draft:",
        error,
      );

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong while saving.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish(
    data: AboutFormData,
  ) {
    try {
      setIsPublishing(true);
      setMessage(null);

      const result = await publishAbout(data);

      reset({
        title: result.about.title,
        shortDescription:
          result.about.shortDescription ?? "",
        fullDescription:
          result.about.fullDescription ?? "",
        yearsOfExperience:
          result.about.yearsOfExperience ?? "",
        location:
          result.about.location ?? "",
        position:
          result.about.position ?? "",
        organization:
          result.about.organization ?? "",
        educationSummary:
          result.about.educationSummary ?? "",
        imageUrl:
          result.about.imageUrl ?? "",
        imagePublicId:
          result.about.imagePublicId ?? "",
      });

      setMessage({
        type: "success",
        text: "Your About section is now published.",
      });
    } catch (error) {
      console.error(
        "Failed to publish About section:",
        error,
      );

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong while publishing.",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  function handleRemoveImage() {
    setValue("imageUrl", "", {
      shouldDirty: true,
    });

    setValue("imagePublicId", "", {
      shouldDirty: true,
    });

    setMessage(null);
  }

  return (
    <form
      onSubmit={handleSubmit(handlePublish)}
      className="space-y-6"
    >
      {/* ------------------------------------------------------------------ */}
      {/* About Content                                                      */}
      {/* ------------------------------------------------------------------ */}

      <AnimatedCard
        delay={0}
        reduceMotion={shouldReduceMotion}
      >
        <CardHeader
          icon={UserRound}
          title="About Content"
          description="Define the main story visitors will read about you."
        />

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Title
            </label>

            <input
              id="title"
              {...register("title")}
              placeholder="About Me"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500/60 dark:focus:ring-emerald-500/10"
            />

            {errors.title && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label
              htmlFor="shortDescription"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Short Description
            </label>

            <textarea
              id="shortDescription"
              {...register("shortDescription")}
              rows={3}
              placeholder="A concise introduction to your professional background."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500/60 dark:focus:ring-emerald-500/10"
            />

            {errors.shortDescription && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          {/* Full Description */}
          <div>
            <label
              htmlFor="fullDescription"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Full Description
            </label>

            <textarea
              id="fullDescription"
              {...register("fullDescription")}
              rows={7}
              placeholder="Write the complete professional story..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500/60 dark:focus:ring-emerald-500/10"
            />

            {errors.fullDescription && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.fullDescription.message}
              </p>
            )}
          </div>
        </div>
      </AnimatedCard>

      {/* ------------------------------------------------------------------ */}
      {/* Professional Information                                          */}
      {/* ------------------------------------------------------------------ */}

      <AnimatedCard
        delay={0.08}
        reduceMotion={shouldReduceMotion}
      >
        <CardHeader
          icon={BriefcaseBusiness}
          title="Professional Information"
          description="Add the key facts that describe the professional profile."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Years of Experience"
            placeholder="4+ years"
            registration={register(
              "yearsOfExperience",
            )}
            error={
              errors.yearsOfExperience?.message
            }
          />

          <Field
            label="Current Position"
            placeholder="Accountant and Controller Officer"
            registration={register("position")}
            error={errors.position?.message}
          />

          <Field
            label="Organization"
            placeholder="Vision Fund Microfinance"
            registration={register(
              "organization",
            )}
            error={errors.organization?.message}
          />

          <Field
            label="Location"
            placeholder="Addis Ababa, Ethiopia"
            registration={register("location")}
            error={errors.location?.message}
          />

          <div className="sm:col-span-2">
            <TextAreaField
              label="Education Summary"
              registration={register(
                "educationSummary",
              )}
              placeholder="Degree in Accounting; currently learning MA in EMBA at Addis Ababa University."
              rows={4}
              error={
                errors.educationSummary?.message
              }
            />
          </div>
        </div>
      </AnimatedCard>

      {/* ------------------------------------------------------------------ */}
      {/* About Image                                                        */}
      {/* ------------------------------------------------------------------ */}

      <AnimatedCard
        delay={0.16}
        reduceMotion={shouldReduceMotion}
      >
        <CardHeader
          icon={ImageIcon}
          title="About Image"
          description="Upload a professional image for the About section."
        />

        <div className="flex flex-col items-center">
          <motion.div
            whileHover={
              shouldReduceMotion
                ? undefined
                : { scale: 1.015 }
            }
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-[1.5rem] bg-emerald-500/10 blur-xl dark:bg-emerald-500/10" />

            <div className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="About preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <ImageIcon className="h-5 w-5" />
                  </div>

                  <span className="px-5 text-xs text-slate-400">
                    No image selected
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <input
  ref={fileInputRef}
  type="file"
  accept="image/jpeg,image/png,image/webp"
  onChange={handleImageUpload}
  className="hidden"
/>
            <motion.button
  type="button"
  disabled={isUploading}
  onClick={() => fileInputRef.current?.click()}
  whileHover={
    shouldReduceMotion || isUploading
      ? undefined
      : { y: -1 }
  }
  whileTap={
    shouldReduceMotion || isUploading
      ? undefined
      : { scale: 0.98 }
  }
  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
>
  {isUploading ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      Uploading...
    </>
  ) : (
    <>
      <ImageIcon className="h-4 w-4" />
      {imageUrl ? "Change Image" : "Upload Image"}
    </>
  )}
</motion.button>

            {imageUrl && (
              <motion.button
                type="button"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -1 }
                }
                whileTap={
                  shouldReduceMotion
                    ? undefined
                    : { scale: 0.98 }
                }
                onClick={handleRemoveImage}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                Remove Image
              </motion.button>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-400">
            JPG • PNG • WebP · Maximum 5 MB
          </p>
        </div>
      </AnimatedCard>

      {/* ------------------------------------------------------------------ */}
      {/* Feedback                                                           */}
      {/* ------------------------------------------------------------------ */}

      {message && (
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 8,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          className={`rounded-xl border px-4 py-3 text-center text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Publishing Controls                                                */}
      {/* ------------------------------------------------------------------ */}

      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 12,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.22,
        }}
        className="flex flex-col justify-center gap-3 pb-8 sm:flex-row"
      >
        {/* Save Draft */}
        <motion.button
          type="button"
          disabled={
            isSaving || isPublishing
          }
          onClick={handleSubmit(
            handleSaveDraft,
          )}
          whileHover={
            shouldReduceMotion ||
            isSaving ||
            isPublishing
              ? undefined
              : { y: -1 }
          }
          whileTap={
            shouldReduceMotion ||
            isSaving ||
            isPublishing
              ? undefined
              : { scale: 0.98 }
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {isSaving
            ? "Saving..."
            : "Save Draft"}
        </motion.button>

        {/* Publish */}
        <motion.button
          type="submit"
          disabled={
            isSaving || isPublishing
          }
          whileHover={
            shouldReduceMotion ||
            isSaving ||
            isPublishing
              ? undefined
              : { y: -1 }
          }
          whileTap={
            shouldReduceMotion ||
            isSaving ||
            isPublishing
              ? undefined
              : { scale: 0.98 }
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}

          {isPublishing
            ? "Publishing..."
            : "Publish Changes"}
        </motion.button>
      </motion.div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable UI pieces                                                         */
/* -------------------------------------------------------------------------- */

function AnimatedCard({
  children,
  delay,
  reduceMotion,
}: {
  children: React.ReactNode;
  delay: number;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.section
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 18,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay,
          ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-colors duration-500 hover:border-emerald-200/80 sm:p-7 dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-[0_8px_40px_rgba(0,0,0,0.18)] dark:hover:border-emerald-500/20"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-400/0 blur-3xl transition-all duration-700 group-hover:bg-emerald-400/10 dark:group-hover:bg-emerald-400/10" />

      <div className="relative">
        {children}
      </div>
    </motion.section>
  );
}

function CardHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7 flex flex-col items-center text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200/70 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
        <Icon className="h-4.5 w-4.5" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h2>

      <p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  placeholder,
  registration,
  error,
}: {
  label: string;
  placeholder: string;
  registration: ReturnType<
    ReturnType<typeof useForm<AboutFormData>>["register"]
  >;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        {...registration}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500/60 dark:focus:ring-emerald-500/10"
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  placeholder,
  rows,
  registration,
  error,
}: {
  label: string;
  placeholder: string;
  rows: number;
  registration: ReturnType<
    ReturnType<typeof useForm<AboutFormData>>["register"]
  >;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <textarea
        {...registration}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500/60 dark:focus:ring-emerald-500/10"
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
