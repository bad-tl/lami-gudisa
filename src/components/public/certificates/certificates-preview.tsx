"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  ExternalLink,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

type CertificatePreviewItem = {
  id: string;
  title: string;
  issuer: string | null;
  issueDate: Date | null;
  credentialUrl: string | null;
  imageUrl: string | null;
};

type CertificatesPreviewProps = {
  certificate: CertificatePreviewItem | null;
};

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function CertificatesPreview({
  certificate,
}: CertificatesPreviewProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!certificate) {
    return null;
  }

  const issueDate = formatDate(
    certificate.issueDate,
  );

  return (
    <section className="relative overflow-hidden bg-[#020817] py-24 text-white sm:py-28 lg:py-32">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, 25, 0],
                  y: [0, -15, 0],
                  scale: [1, 1.08, 1],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[-10%] top-[15%] h-80 w-80 rounded-full bg-emerald-500/[0.07] blur-3xl"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, -20, 0],
                  y: [0, 20, 0],
                  scale: [1, 1.1, 1],
                }
          }
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-20%] right-[-5%] h-96 w-96 rounded-full bg-teal-500/[0.05] blur-3xl"
        />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* TEXT SIDE */}
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -35,
                  }
            }
            whileInView={
              shouldReduceMotion
                ? {}
                : {
                    opacity: 1,
                    x: 0,
                  }
            }
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.75,
              ease: "easeOut",
            }}
            className="max-w-xl"
          >
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, y: 12 }
              }
              whileInView={
                shouldReduceMotion
                  ? {}
                  : { opacity: 1, y: 0 }
              }
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-emerald-400" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400 sm:text-xs">
                Professional Credentials
              </span>
            </motion.div>

            <motion.h2
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
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="font-[var(--font-cormorant)] text-5xl font-medium leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Credentials that
              <span className="block text-emerald-400">
                speak for themselves.
              </span>
            </motion.h2>

            <motion.p
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 15,
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
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.3,
              }}
              className="mt-6 max-w-lg text-sm leading-7 text-slate-300 sm:text-base sm:leading-8"
            >
              Professional certificates and
              qualifications representing continuous
              learning, expertise, and commitment to
              professional growth.
            </motion.p>

            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 15,
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
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.4,
              }}
            >
              <Link
                href="/certificates"
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-sm font-medium text-emerald-300 transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-400/15 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]"
              >
                Explore certificates

                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* CERTIFICATE SIDE */}
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 40,
                    scale: 0.96,
                  }
            }
            whileInView={
              shouldReduceMotion
                ? {}
                : {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }
            }
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-8 rounded-[3rem] bg-emerald-500/[0.06] opacity-70 blur-3xl transition duration-700 group-hover:opacity-100" />

            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -7, 0],
                    }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -10,
                      rotateX: 1,
                      rotateY: -1,
                      scale: 1.015,
                    }
              }
              className="group relative"
            >
              {/* Animated border */}
              <div className="absolute -inset-px rounded-[1.6rem] bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />

              <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#07111f] p-2 shadow-2xl shadow-black/40 transition-all duration-500 group-hover:border-emerald-400/30 group-hover:shadow-[0_25px_70px_rgba(0,0,0,0.45)] sm:p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-black/30">
                  {certificate.imageUrl ? (
                    <Image
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      fill
                      sizes="(max-width: 1023px) 100vw, 60vw"
                      className="object-contain p-3 transition duration-700 group-hover:scale-[1.025] sm:p-5"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Award className="size-14 text-slate-600" />
                    </div>
                  )}

                  {/* Hover shine */}
                  <motion.div
                    initial={{
                      x: "-120%",
                    }}
                    whileHover={{
                      x: "120%",
                    }}
                    transition={{
                      duration: 0.9,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
                  />

                  {/* Bottom information */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                    <div className="rounded-xl border border-white/10 bg-black/65 px-4 py-3 backdrop-blur-xl transition-all duration-500 group-hover:border-emerald-400/20 group-hover:bg-black/70 sm:px-5 sm:py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {/* Single-line title */}
                          <h3
                            title={certificate.title}
                            className="truncate whitespace-nowrap text-sm font-semibold tracking-tight text-white sm:text-base"
                          >
                            {certificate.title}
                          </h3>

                          {(certificate.issuer ||
                            issueDate) && (
                            <p className="mt-1 truncate whitespace-nowrap text-[10px] text-slate-300 sm:text-xs">
                              {[
                                certificate.issuer,
                                issueDate,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>

                        {certificate.credentialUrl && (
                          <a
                            href={
                              certificate.credentialUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
                            aria-label="Verify credential"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="mt-2 flex items-center justify-between px-2 pb-1 sm:px-3 sm:pb-1">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                    <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-500">
                      Verified credential
                    </span>
                  </div>

                  <ArrowRight className="size-3.5 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-400" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}