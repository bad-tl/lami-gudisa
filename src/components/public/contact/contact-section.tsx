"use client";

import { sendContactMessage } from "@/app/contact/actions";
import * as React from "react";
import {
  ArrowUpRight,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import {
  SiFacebook,
  SiTelegram,
  SiInstagram,
} from "react-icons/si";

import { FaLinkedinIn } from "react-icons/fa";
import { motion, useReducedMotion } from "motion/react";

type ContactSectionProps = {
  data: {
    contact: {
      email: string;
      phone: string;
      location: string;
      availability: string;
      description: string;
    } | null;
    social: {
      facebook: string;
      telegram: string;
      instagram: string;
      linkedin: string;
    };
  };
};

export default function ContactSection({
  data,
}: ContactSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const contact = data.contact;
  const [isSending, setIsSending] = React.useState(false);
const [sendStatus, setSendStatus] = React.useState<
  "idle" | "success" | "error"
>("idle");
const [errorMessage, setErrorMessage] = React.useState("");

  const socials = [
  {
    name: "Facebook",
    url: data.social.facebook,
    icon: SiFacebook,
  },
  {
    name: "Telegram",
    url: data.social.telegram,
    icon: SiTelegram,
  },
  {
    name: "Instagram",
    url: data.social.instagram,
    icon: SiInstagram,
  },
  {
    name: "LinkedIn",
    url: data.social.linkedin,
    icon: FaLinkedinIn,
  },
].filter((item) => item.url);


async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  setIsSending(true);
  setSendStatus("idle");
  setErrorMessage("");

  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    const result = await sendContactMessage(formData);

if (!result.success) {
  setSendStatus("error");

  const firstFieldError = result.fieldErrors
    ? Object.values(result.fieldErrors)
        .flat()
        .find(Boolean)
    : undefined;

  setErrorMessage(
    firstFieldError ??
      result.error ??
      "Unable to send your message.",
  );

  return;
}

    setSendStatus("success");
    form.reset();
  } catch (error) {
    console.error("Contact form error:", error);

    setSendStatus("error");
    setErrorMessage(
      "Something went wrong. Please try again.",
    );
  } finally {
    setIsSending(false);
  }
}

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#020817] py-24 sm:py-28 lg:py-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[15%] h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-5%] h-96 w-96 rounded-full bg-teal-500/10 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={
            shouldReduceMotion
              ? undefined
              : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-14 max-w-2xl"
        >
  <div className="text-center">
  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
    Get in touch
  </p>

  <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight text-emerald-400 sm:text-5xl lg:text-6xl">
    Lets start a conversation.
  </h2>
</div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Have an opportunity, professional question, or business
            inquiry? Reach out and let&apos;s connect.
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Contact details */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
            whileInView={
              shouldReduceMotion
                ? undefined
                : { opacity: 1, x: 0 }
            }
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col"
          >
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Contact information
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Connect directly
                </h3>

                {contact?.description && (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {contact.description}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {contact?.email && (
                  <ContactLink
                    href={`mailto:${contact.email}`}
                    icon={<Mail className="size-5" />}
                    label="Email"
                    value={contact.email}
                  />
                )}

                {contact?.phone && (
                  <ContactLink
                    href={`tel:${contact.phone}`}
                    icon={<Phone className="size-5" />}
                    label="Phone"
                    value={contact.phone}
                  />
                )}

                {contact?.location && (
                  <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                      <MapPin className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Location
                      </p>
                      <p className="mt-1 text-sm text-slate-200">
                        {contact.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {contact?.availability && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
                  </span>

                  <p className="text-sm text-emerald-200">
                    {contact.availability}
                  </p>
                </div>
              )}

              {socials.length > 0 && (
                <div className="mt-8 border-t border-white/10 pt-7">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Follow / connect
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {socials.map((social) => {
                      const Icon = social.icon;

                      return (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={
                            shouldReduceMotion
                              ? undefined
                              : { y: -3 }
                          }
                          whileTap={
                            shouldReduceMotion
                              ? undefined
                              : { scale: 0.96 }
                          }
                          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm text-slate-300 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-white"
                          aria-label={`Open ${social.name}`}
                        >
                          <Icon className="size-4 text-emerald-400" />
                          <span>{social.name}</span>
                          <ExternalLink className="size-3.5 opacity-40 transition-opacity group-hover:opacity-80" />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 30 }}
            whileInView={
              shouldReduceMotion
                ? undefined
                : { opacity: 1, x: 0 }
            }
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10"
          >
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Send a message
              </p>

              <h3 className="mt-3 text-2xl font-semibold text-white">
                Tell me what&apos;s on your mind.
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Fill out the form and your message will be sent
                directly to the inbox.
              </p>
            </div>

           <form
  onSubmit={handleSubmit}
  className="space-y-5"
>

  <div
  aria-hidden="true"
  className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
>
  <label htmlFor="website">
    Website
  </label>

  <input
    id="website"
    name="website"
    type="text"
    tabIndex={-1}
    autoComplete="off"
  />
</div>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

<button
  type="submit"
  disabled={isSending}
  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 text-sm font-semibold text-[#02120d] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSending ? (
    <>
      <span className="size-4 animate-spin rounded-full border-2 border-[#02120d]/30 border-t-[#02120d]" />
      Sending...
    </>
  ) : (
    <>
      Send Message
      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  )}
</button>

{sendStatus === "success" && (
  <div
    role="status"
    className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-300"
  >
    Your message has been sent successfully. Thank you for
    reaching out.
  </div>
)}

{sendStatus === "error" && (
  <div
    role="alert"
    className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300"
  >
    {errorMessage}
  </div>
)}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.025] p-4 transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.04]"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 transition group-hover:bg-emerald-400/15">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <p className="mt-1 truncate text-sm text-slate-200 transition group-hover:text-white">
          {value}
        </p>
      </div>
    </a>
  );
}

function FormField({
  label,
  name,
  type,
  placeholder,
  
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
      />
    </div>
  );
}