"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

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

type CertificatesPageClientProps = {
  certificates: CertificateItem[];
};

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function CertificatesPageClient({
  certificates,
}: CertificatesPageClientProps) {
  const shouldReduceMotion = useReducedMotion();

  const [selectedIndex, setSelectedIndex] =
    React.useState<number | null>(null);

  const selectedCertificate =
    selectedIndex !== null
      ? certificates[selectedIndex]
      : null;

  const closeViewer = React.useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPrevious = React.useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || certificates.length === 0) {
        return current;
      }

      return (
        (current - 1 + certificates.length) %
        certificates.length
      );
    });
  }, [certificates.length]);

  const showNext = React.useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || certificates.length === 0) {
        return current;
      }

      return (current + 1) % certificates.length;
    });
  }, [certificates.length]);

  React.useEffect(() => {
    if (selectedIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedIndex,
    closeViewer,
    showPrevious,
    showNext,
  ]);

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.10),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(6,78,59,0.14),transparent_34%)]" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-20 sm:px-8 sm:pb-16 sm:pt-24 lg:px-10 lg:pb-20 lg:pt-28">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 18 }
            }
            animate={
              shouldReduceMotion
                ? {}
                : { opacity: 1, y: 0 }
            }
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-emerald-500" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-400 sm:text-xs">
                Professional Credentials
              </span>
            </div>

            <h1 className="font-[var(--font-cormorant)] text-5xl font-medium leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Certificates &
              <span className="block text-emerald-400">
                Qualifications
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              A collection of professional certifications,
              qualifications, and credentials reflecting
              continuous learning and professional growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Certificates */}
      <section className="relative">
        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          {certificates.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <Award className="size-7 text-emerald-400" />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                Certificates coming soon
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                Professional certificates and qualifications
                will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {certificates.map((certificate, index) => {
                const date = formatDate(
                  certificate.issueDate,
                );

                return (
                  <motion.article
                    key={certificate.id}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 20,
                          }
                    }
                    whileInView={
                      shouldReduceMotion
                        ? {}
                        : {
                            opacity: 1,
                            y: 0,
                          }
                    }
                    viewport={{
                      once: true,
                      amount: 0.12,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(index * 0.04, 0.2),
                    }}
                    className="group"
                  >
                    {/* Image */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedIndex(index)
                      }
                      className="relative block w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] text-left outline-none transition duration-300 hover:border-emerald-400/30 hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-emerald-400/70 sm:rounded-2xl"
                      aria-label={`View ${certificate.title}`}
                    >
                      <div className="relative aspect-[4/3] w-full">
                        {certificate.imageUrl ? (
                          <Image
                            src={certificate.imageUrl}
                            alt={certificate.title}
                            fill
                            sizes="(max-width: 639px) 33vw, (max-width: 1023px) 50vw, 25vw"
                            className="object-contain p-1.5 transition duration-500 group-hover:scale-[1.025] sm:p-2.5"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Award className="size-8 text-slate-600" />
                          </div>
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />

                        <div className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100 sm:right-3 sm:top-3 sm:size-8">
                          <ExternalLink className="size-3.5 sm:size-4" />
                        </div>
                      </div>
                    </button>

                    {/* Information */}
                    <div className="px-0.5 pt-3 sm:px-1 sm:pt-4">
                      <h2 className="line-clamp-2 text-xs font-semibold leading-5 text-white sm:text-sm sm:leading-6">
                        {certificate.title}
                      </h2>

                      {(certificate.issuer || date) && (
                        <p className="mt-1 line-clamp-1 text-[10px] leading-4 text-slate-400 sm:text-xs">
                          {[certificate.issuer, date]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Back */}
      <div className="mx-auto flex w-full max-w-7xl px-5 pb-12 sm:px-8 lg:px-10">
<Link
  href="/"
  className="group inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white sm:text-sm"
>
  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
  Back to portfolio
</Link>
      </div>

      {/* Fullscreen viewer */}
      {selectedCertificate && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 backdrop-blur-md sm:p-6"
          onClick={closeViewer}
        >
          <button
            type="button"
            onClick={closeViewer}
            className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 sm:right-6 sm:top-6"
            aria-label="Close certificate viewer"
          >
            <X className="size-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/10 sm:left-6 sm:size-12"
            aria-label="Previous certificate"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>

          <motion.div
            key={selectedCertificate.id}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, scale: 0.98 }
            }
            animate={
              shouldReduceMotion
                ? {}
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.25 }}
            className="relative flex h-[82vh] w-full max-w-6xl items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {selectedCertificate.imageUrl ? (
              <Image
                src={selectedCertificate.imageUrl}
                alt={selectedCertificate.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            ) : (
              <Award className="size-16 text-slate-600" />
            )}

            <div className="absolute bottom-0 left-0 right-0 rounded-xl bg-black/55 p-4 backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white sm:text-base">
                    {selectedCertificate.title}
                  </h2>

                  {(selectedCertificate.issuer ||
                    selectedCertificate.issueDate) && (
                    <p className="mt-1 text-xs text-slate-300">
                      {[
                        selectedCertificate.issuer,
                        formatDate(
                          selectedCertificate.issueDate,
                        ),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>

                {selectedCertificate.credentialUrl && (
                  <a
                    href={
                      selectedCertificate.credentialUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/20"
                  >
                    Verify credential
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/10 sm:right-6 sm:size-12"
            aria-label="Next certificate"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-wider text-slate-500 sm:bottom-5">
            {selectedIndex + 1} / {certificates.length}
          </div>
        </div>
      )}
    </main>
  );
}