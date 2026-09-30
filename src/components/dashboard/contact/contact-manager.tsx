"use client";

import * as React from "react";
import {
  Check,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
} from "lucide-react";

import { saveContactData } from "@/app/dashboard/contact/actions";
import { contactSchema } from "@/lib/validations/contact";

type ContactData = {
  contact: {
    id: string;
    email: string;
    phone: string;
    location: string;
    availability: string;
    description: string;
    status: string;
  } | null;
  social: {
    facebook: string;
    telegram: string;
    instagram: string;
    linkedin: string;
  };
};

type ContactForm = {
  email: string;
  phone: string;
  location: string;
  availability: string;
  description: string;
  facebook: string;
  telegram: string;
  instagram: string;
  linkedin: string;
};

type ContactManagerProps = {
  initialData: ContactData;
};

export default function ContactManager({
  initialData,
}: ContactManagerProps) {
  const [form, setForm] = React.useState<ContactForm>({
    email: initialData.contact?.email || "lamigudisa94@gmail.com",
    phone: initialData.contact?.phone || "+251910358636",
    location:
      initialData.contact?.location || "Ethiopia, Addis Ababa",
    availability: initialData.contact?.availability || "",
    description: initialData.contact?.description || "",
    facebook: initialData.social.facebook || "",
    telegram: initialData.social.telegram || "",
    instagram: initialData.social.instagram || "",
    linkedin: initialData.social.linkedin || "",
  });

  const [errors, setErrors] = React.useState<
    Partial<Record<keyof ContactForm, string>>
  >({});

  const [isSaving, setIsSaving] = React.useState(false);

  const [message, setMessage] = React.useState<
    "idle" | "success" | "error"
  >("idle");

  function updateField(field: keyof ContactForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setMessage("idle");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("idle");

    const result = contactSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof ContactForm, string>
      > = {};

      const flattened = result.error.flatten().fieldErrors;

      Object.entries(flattened).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          fieldErrors[field as keyof ContactForm] = messages[0];
        }
      });

      setErrors(fieldErrors);
      setMessage("error");
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      const response = await saveContactData(result.data);

      if (!response.success) {
        setMessage("error");

        if (response.fieldErrors) {
          const serverErrors: Partial<
            Record<keyof ContactForm, string>
          > = {};

          Object.entries(response.fieldErrors).forEach(
            ([field, messages]) => {
              if (messages && messages.length > 0) {
                serverErrors[field as keyof ContactForm] =
                  messages[0];
              }
            },
          );

          setErrors(serverErrors);
        }

        return;
      }

      setMessage("success");
    } catch (error) {
      console.error("Contact save error:", error);
      setMessage("error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-500">
          Communication
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Contact
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Manage the contact information and social media links
          displayed on the public portfolio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Contact Information
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              This information will appear on the public Contact
              section.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <ContactField
              id="email"
              label="Email"
              type="email"
              value={form.email}
              icon={<Mail className="size-4" />}
              error={errors.email}
              onChange={(value) => updateField("email", value)}
            />

            <ContactField
              id="phone"
              label="Phone"
              type="tel"
              value={form.phone}
              icon={<Phone className="size-4" />}
              error={errors.phone}
              onChange={(value) => updateField("phone", value)}
            />

            <ContactField
              id="location"
              label="Location"
              type="text"
              value={form.location}
              icon={<MapPin className="size-4" />}
              error={errors.location}
              className="md:col-span-2"
              onChange={(value) => updateField("location", value)}
            />

            <ContactField
              id="availability"
              label="Availability"
              type="text"
              value={form.availability}
              placeholder="Available for new opportunities"
              error={errors.availability}
              onChange={(value) =>
                updateField("availability", value)
              }
            />

            <ContactField
              id="description"
              label="Description"
              type="text"
              value={form.description}
              placeholder="A short professional invitation to connect"
              error={errors.description}
              onChange={(value) =>
                updateField("description", value)
              }
            />
          </div>
        </section>

        {/* Social Media */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Social Media
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add the social profiles visitors can access from the
              public Contact section.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <ContactField
              id="facebook"
              label="Facebook"
              type="url"
              value={form.facebook}
              placeholder="https://facebook.com/..."
              icon={<Globe className="size-4" />}
              error={errors.facebook}
              onChange={(value) => updateField("facebook", value)}
            />

            <ContactField
              id="telegram"
              label="Telegram"
              type="url"
              value={form.telegram}
              placeholder="https://t.me/..."
              icon={<MessageCircle className="size-4" />}
              error={errors.telegram}
              onChange={(value) => updateField("telegram", value)}
            />

            <ContactField
              id="instagram"
              label="Instagram"
              type="url"
              value={form.instagram}
              placeholder="https://instagram.com/..."
              icon={<Globe className="size-4" />}
              error={errors.instagram}
              onChange={(value) =>
                updateField("instagram", value)
              }
            />

            <ContactField
              id="linkedin"
              label="LinkedIn"
              type="url"
              value={form.linkedin}
              placeholder="https://linkedin.com/in/..."
              icon={<ExternalLink className="size-4" />}
              error={errors.linkedin}
              onChange={(value) =>
                updateField("linkedin", value)
              }
            />
          </div>
        </section>

        {/* Save */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {message === "success" ? (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="size-4" />
                  <span>Changes saved successfully.</span>
                </div>
              ) : message === "error" ? (
                <p className="text-sm font-medium text-red-500">
                  Please check the highlighted fields and try again.
                </p>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Save your contact information and social links.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

type ContactFieldProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  onChange: (value: string) => void;
};

function ContactField({
  id,
  label,
  type,
  value,
  placeholder,
  icon,
  error,
  className,
  onChange,
}: ContactFieldProps) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full rounded-xl border bg-slate-50 text-sm outline-none transition dark:bg-white/[0.04] dark:text-white ${
            icon ? "pl-10 pr-4" : "px-4"
          } ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10"
          }`}
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}