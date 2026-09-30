"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowRight,
  Download,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type HeroVisualProps = {
  eyebrow?: string | null;
  name: string;
  title: string;
  headline: string;
  description?: string | null;
  imageUrl?: string | null;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  primaryButtonText?: string | null;
  primaryButtonUrl?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  showScrollIndicator?: boolean;
  showExperienceBadge?: boolean;
};

const reveal = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function HeroVisual({
  eyebrow,
  name,
  title,
  headline,
  description,
  imageUrl,
  imageFit = "cover",
  imagePosition = "center",
  primaryButtonText,
  primaryButtonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
  showScrollIndicator = true,
  showExperienceBadge = true,
}: HeroVisualProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: "hidden",
        animate: "visible",
      };

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#020817] text-white"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-[-10%] h-[clamp(260px,42vw,620px)] w-[clamp(260px,42vw,620px)] rounded-full bg-emerald-400/[0.09] blur-[clamp(80px,12vw,180px)]" />

        <div className="absolute -right-24 top-[8%] h-[clamp(280px,45vw,680px)] w-[clamp(280px,45vw,680px)] rounded-full bg-cyan-400/[0.08] blur-[clamp(90px,14vw,210px)]" />

        <div className="absolute bottom-[-18%] left-[28%] h-[clamp(250px,40vw,580px)] w-[clamp(250px,40vw,580px)] rounded-full bg-emerald-500/[0.06] blur-[clamp(90px,13vw,190px)]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "clamp(28px, 4vw, 58px) clamp(28px, 4vw, 58px)",
            maskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.2) 65%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.2) 65%, transparent 100%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
      </div>

      {/* Decorative data points */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[3%] top-[22%] hidden md:block"
      >
        <div className="grid grid-cols-6 gap-2 opacity-40">
          {Array.from({ length: 36 }).map((_, index) => (
            <motion.span
              key={index}
              className="size-1 rounded-full bg-emerald-300"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: [0.15, 0.8, 0.15],
                      scale: [0.8, 1.2, 0.8],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 2.5,
                      delay: index * 0.04,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />
          ))}
        </div>
      </div>

      {/* Decorative curve */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[clamp(100px,18vw,250px)] w-full opacity-40"
        viewBox="0 0 1440 260"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 220C140 150 190 255 350 190C510 125 550 195 690 150C830 105 900 205 1040 145C1180 85 1250 145 1480 60"
          stroke="url(#heroCurve)"
          strokeWidth="1.5"
        />
        <path
          d="M-40 238C150 170 220 270 370 208C510 150 590 220 730 174C880 125 930 220 1080 165C1210 115 1300 160 1480 90"
          stroke="url(#heroCurve)"
          strokeWidth="1"
          opacity="0.45"
        />
        <defs>
          <linearGradient
            id="heroCurve"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="35%" stopColor="#10b981" />
            <stop offset="70%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1480px] items-center px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.03fr_0.97fr] lg:gap-8 xl:gap-16">
          {/* Content */}
          <div className="relative z-20 max-w-3xl">
            <motion.div
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.65 }}
              className="mb-6"
            >
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/20 bg-white/[0.045] px-3 py-2 backdrop-blur-xl sm:px-4">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex size-full rounded-full bg-emerald-400" />
                </span>

                <span className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/85 sm:text-xs sm:tracking-[0.24em]">
                  {eyebrow || "Available for new opportunities"}
                </span>
              </div>
            </motion.div>

            <motion.h1
              id="hero-title"
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.75, delay: 0.08, ease: "easeOut" }}
              className="max-w-4xl break-words font-[var(--font-hero-serif)] text-[clamp(3.2rem,9vw,8.4rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-white"
            >
              {name}
            </motion.h1>

            <motion.div
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-7 flex items-center gap-3 sm:mt-9"
            >
              <span className="h-px w-10 shrink-0 bg-emerald-400 sm:w-16" />

              <p className="truncate text-xs font-medium tracking-[0.12em] text-emerald-200 sm:text-sm md:text-base">
                {title}
              </p>
            </motion.div>

            <motion.h2
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.7, delay: 0.27 }}
              className="mt-6 max-w-2xl font-[var(--font-hero-serif)] text-[clamp(1.8rem,4.4vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white/95 sm:mt-8"
            >
              {headline}
            </motion.h2>

            {description && (
              <motion.p
                {...animationProps}
                variants={reveal}
                transition={{ duration: 0.65, delay: 0.38 }}
                className="mt-6 max-w-xl text-sm leading-7 text-slate-300/80 sm:text-base sm:leading-8"
              >
                {description}
              </motion.p>
            )}

            {/* Highlights */}
            <motion.div
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.65, delay: 0.46 }}
              className="mt-8 grid max-w-2xl grid-cols-1 gap-4 border-y border-white/10 py-5 sm:grid-cols-3 sm:gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.06]">
                  <ShieldCheck className="size-5 text-emerald-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">4+ Years</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Professional experience
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">Strategic</p>
                <p className="mt-1 text-xs text-slate-400">
                  Business insight
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">Data-driven</p>
                <p className="mt-1 text-xs text-slate-400">
                  Analysis and reporting
                </p>
              </div>
            </motion.div>

            {/* Buttons */}
            {(primaryButtonText || secondaryButtonText) && (
              <motion.div
                {...animationProps}
                variants={reveal}
                transition={{ duration: 0.65, delay: 0.55 }}
                className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
              >
                {primaryButtonText && (
                  <a
                    href={primaryButtonUrl || "#experience"}
                    className="group inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-full border border-emerald-300/50 bg-emerald-400 px-6 py-3 text-sm font-semibold text-[#02110c] shadow-[0_0_35px_rgba(16,185,129,0.16)] transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817]"
                  >
                    <span>{primaryButtonText}</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                )}

                {secondaryButtonText && (
                  <a
                    href={secondaryButtonUrl || "#"}
                    className="group inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817]"
                  >
                    <span>{secondaryButtonText}</span>
                    <Download className="size-4 text-emerald-300 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </a>
                )}
              </motion.div>
            )}
          </div>

          {/* Portrait area */}
          <div className="relative flex min-h-[430px] items-center justify-center sm:min-h-[560px] lg:min-h-[680px]">
            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.06, 1],
                      opacity: [0.25, 0.45, 0.25],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              className="absolute left-1/2 top-1/2 size-[clamp(260px,55vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[clamp(60px,9vw,130px)]"
            />

            {/* Orbit rings */}
            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: 360,
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 28,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
              className="absolute left-1/2 top-1/2 aspect-square w-[clamp(280px,65vw,700px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/20"
            >
              <span className="absolute left-[12%] top-[-4px] size-2 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.95)] sm:size-3" />
              <span className="absolute bottom-[14%] right-[-4px] size-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.85)]" />
            </motion.div>

            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: -360,
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 36,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
              className="absolute left-1/2 top-1/2 aspect-[1.08/1] w-[clamp(240px,56vw,600px)] -translate-x-1/2 -translate-y-1/2 rotate-[22deg] rounded-full border border-emerald-200/15"
            >
              <span className="absolute right-[8%] top-[7%] size-2 rounded-full bg-emerald-200 shadow-[0_0_18px_rgba(167,243,208,0.8)]" />
            </motion.div>

            {/* Photo frame */}
            <div className="relative z-10 h-[clamp(360px,68vw,650px)] w-[clamp(245px,62vw,470px)]">
              <div className="absolute inset-0 rounded-[48%] border border-emerald-300/45 shadow-[0_0_60px_rgba(16,185,129,0.12)]" />

              <div className="absolute inset-2 rounded-[48%] border border-white/10 sm:inset-3" />

              <div className="absolute inset-4 overflow-hidden rounded-[45%] bg-gradient-to-br from-slate-800 via-slate-950 to-emerald-950 sm:inset-5">
                {imageUrl ? (
                  <motion.img
                    src={imageUrl}
                    alt={name}
                    loading="eager"
                    fetchPriority="high"
                    initial={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 1.08,
                            opacity: 0,
                          }
                    }
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 1,
                            opacity: 1,
                          }
                    }
                    transition={{
                      duration: 1,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                    className={`size-full transition-transform duration-700 hover:scale-[1.025] ${
                      imageFit === "contain"
                        ? "object-contain p-4 sm:p-7"
                        : "object-cover"
                    }`}
                    style={{
                      objectPosition: imagePosition,
                    }}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950">
                    <div className="text-center">
                      <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/[0.06] sm:size-24">
                        <Sparkles className="size-8 text-emerald-200 sm:size-10" />
                      </div>

                      <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                        Add your photo
                      </p>
                    </div>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020817]/60 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-300/[0.08] via-transparent to-transparent" />
              </div>

              {/* Dashed photo orbit */}
              <motion.div
                aria-hidden="true"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: 360,
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
                      }
                }
                className="pointer-events-none absolute -inset-3 rounded-[50%] border border-dashed border-emerald-300/25 sm:-inset-5"
              >
                <span className="absolute left-[9%] top-[13%] size-2 rounded-full bg-emerald-400 shadow-[0_0_22px_rgba(52,211,153,1)] sm:size-3" />
              </motion.div>
            </div>

            {/* Experience badge */}
            {showExperienceBadge && (
              <motion.div
                initial={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        scale: 0.8,
                        y: 16,
                      }
                }
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }
                }
                transition={{
                  duration: 0.65,
                  delay: 0.7,
                }}
                className="absolute bottom-[7%] right-[4%] z-20 flex size-[clamp(82px,18vw,132px)] flex-col items-center justify-center rounded-full border border-emerald-300/30 bg-[#06131a]/90 shadow-[0_0_40px_rgba(16,185,129,0.18)] backdrop-blur-xl sm:right-[8%]"
              >
                <span className="font-[var(--font-hero-serif)] text-[clamp(1.7rem,4vw,2.8rem)] leading-none text-emerald-200">
                  4+
                </span>

                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-300 sm:text-[10px]">
                  Years
                </span>

                <span className="text-[7px] uppercase tracking-[0.1em] text-slate-500 sm:text-[8px]">
                  Experience
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        {showScrollIndicator && (
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
                Scroll
              </span>

              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, 5, 0],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
                className="flex size-8 items-center justify-center rounded-full border border-emerald-400/25"
              >
                <ArrowDown className="size-3.5 text-emerald-300" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}