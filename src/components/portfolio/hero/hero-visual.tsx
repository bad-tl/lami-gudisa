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
    y: 20,
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
      className="
        relative isolate min-h-[100svh] overflow-hidden
        bg-[#020817] text-white
      "
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="
            absolute -left-28 -top-20
            size-[clamp(220px,42vw,620px)]
            rounded-full
            bg-emerald-400/[0.10]
            blur-[clamp(70px,12vw,180px)]
          "
        />

        <div
          className="
            absolute -right-28 top-[8%]
            size-[clamp(240px,44vw,680px)]
            rounded-full
            bg-cyan-400/[0.08]
            blur-[clamp(80px,13vw,190px)]
          "
        />

        <div
          className="
            absolute bottom-[-20%] left-[25%]
            size-[clamp(230px,40vw,580px)]
            rounded-full
            bg-emerald-500/[0.06]
            blur-[clamp(80px,12vw,180px)]
          "
        />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize:
              "clamp(25px, 4vw, 58px) clamp(25px, 4vw, 58px)",
            maskImage:
              "linear-gradient(to bottom, black, rgba(0,0,0,0.2), transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, rgba(0,0,0,0.2), transparent)",
          }}
        />
      </div>

      {/* Decorative dots */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute left-[2%] top-[20%]
          hidden sm:block
        "
      >
        <div className="grid grid-cols-6 gap-1.5 opacity-40">
          {Array.from({ length: 36 }).map((_, index) => (
            <motion.span
              key={index}
              className="size-1 rounded-full bg-emerald-300"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: [0.15, 0.8, 0.15],
                      scale: [0.8, 1.15, 0.8],
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

      {/* Bottom curve */}
      <svg
        aria-hidden="true"
        className="
          pointer-events-none absolute bottom-0 left-0
          h-[clamp(80px,18vw,240px)] w-full opacity-40
        "
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

      {/* Main layout */}
      <div
        className="
          relative z-10 mx-auto flex min-h-[100svh] w-full
          max-w-[1480px] items-center
          px-3 py-16
          min-[380px]:px-4
          sm:px-8 sm:py-20
          lg:px-12
        "
      >
        {/*
          The important mobile layout is here.

          It stays two columns at every screen size.
          The first column contains the text.
          The second column contains the image.
        */}
        <div
          className="
            grid w-full items-center
            grid-cols-[minmax(0,1.08fr)_minmax(105px,0.72fr)]
            gap-3
            min-[380px]:grid-cols-[minmax(0,1.05fr)_minmax(125px,0.78fr)]
            min-[380px]:gap-4
            sm:grid-cols-[minmax(0,1.03fr)_minmax(230px,0.82fr)]
            sm:gap-8
            md:gap-12
            lg:grid-cols-[1.03fr_0.97fr]
            lg:gap-16
          "
        >
          {/* Left content */}
          <div className="relative z-20 min-w-0">
            <motion.div
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.6 }}
              className="mb-3 sm:mb-6"
            >
              <div
                className="
                  inline-flex max-w-full items-center gap-1.5
                  rounded-full border border-emerald-300/20
                  bg-white/[0.045] px-2 py-1.5
                  backdrop-blur-xl
                  min-[380px]:gap-2 min-[380px]:px-2.5
                  sm:px-4 sm:py-2
                "
              >
                <span className="relative flex size-1.5 shrink-0 sm:size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex size-full rounded-full bg-emerald-400" />
                </span>

<span
  className="
    text-[5px] font-semibold uppercase
    tracking-[0.08em] text-emerald-100/85
    min-[380px]:text-[6px]
    sm:text-[10px] sm:tracking-[0.2em]
  "
>
  {eyebrow || "Available for new opportunities"}
</span>
              </div>
            </motion.div>

            <motion.h1
              id="hero-title"
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.7, delay: 0.08 }}
             className="
  max-w-full break-words
  font-[var(--font-hero-serif)]
  text-[clamp(1.7rem,8vw,6.5rem)]
  font-semibold leading-[0.86]
  tracking-[-0.065em]
  text-white
  sm:text-[clamp(2.7rem,6.5vw,6.8rem)]
"
            >
              {name}
            </motion.h1>

            <motion.div
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="
                mt-3 flex min-w-0 items-center gap-1.5
                min-[380px]:mt-4 min-[380px]:gap-2
                sm:mt-8 sm:gap-3
              "
            >
              <span
                className="
                  h-px w-4 shrink-0 bg-emerald-400
                  min-[380px]:w-6
                  sm:w-16
                "
              />

              <p
                className="
                  min-w-0 truncate
                  text-[4px] font-medium
                  tracking-[0.04em] text-emerald-200
                  min-[380px]:text-[8px]
                  sm:text-sm sm:tracking-[0.1em]
                  md:text-base
                "
              >
                {title}
              </p>
            </motion.div>

            <motion.h2
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.65, delay: 0.26 }}
              className="
                mt-3 max-w-2xl
                font-[var(--font-hero-serif)]
                text-[clamp(1rem,4.8vw,4.3rem)]
                font-medium leading-[1.03]
                tracking-[-0.035em]
                text-white/95
                min-[380px]:mt-4
                sm:mt-7
              "   
            >
              {headline}
            </motion.h2>

            {description && (
              <motion.p
                {...animationProps}
                variants={reveal}
                transition={{ duration: 0.6, delay: 0.36 }}
                className="
                  mt-3 max-w-xl
                  text-[8px] leading-[1.45]
                  text-slate-300/80
                  min-[380px]:text-[9px]
                  sm:mt-6 sm:text-sm sm:leading-7
                  md:text-base
                "
              >
                {description}
              </motion.p>
            )}

            {/* Compact highlights */}
            <motion.div
              {...animationProps}
              variants={reveal}
              transition={{ duration: 0.6, delay: 0.44 }}
              className="
                mt-4 grid max-w-2xl
                grid-cols-1 gap-2
                border-y border-white/10 py-3
                min-[380px]:mt-5
                sm:mt-8 sm:grid-cols-3 sm:gap-5 sm:py-5
              "
            >
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
                <div
                  className="
                    flex size-6 shrink-0 items-center justify-center
                    rounded-full border border-emerald-400/20
                    bg-emerald-400/[0.06]
                    min-[380px]:size-7
                    sm:size-10
                  "
                >
                  <ShieldCheck className="size-3 text-emerald-300 sm:size-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[8px] font-semibold text-white sm:text-sm">
                    4+ Years
                  </p>

                  <p className="mt-0.5 text-[6px] leading-tight text-slate-400 sm:text-xs">
                    Professional experience
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <p className="truncate text-[8px] font-semibold text-white sm:text-sm">
                  Strategic
                </p>

                <p className="mt-0.5 text-[6px] leading-tight text-slate-400 sm:text-xs">
                  Business insight
                </p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-[8px] font-semibold text-white sm:text-sm">
                  Data-driven
                </p>

                <p className="mt-0.5 text-[6px] leading-tight text-slate-400 sm:text-xs">
                  Analysis and reporting
                </p>
              </div>
            </motion.div>

            {/* Buttons */}
            {(primaryButtonText || secondaryButtonText) && (
              <motion.div
                {...animationProps}
                variants={reveal}
                transition={{ duration: 0.6, delay: 0.52 }}
                className="
                  mt-4 flex w-full max-w-xl
                  flex-col gap-2
                  min-[480px]:flex-row
                  sm:mt-8 sm:gap-3
                "
              >
                {primaryButtonText && (
                  <a
                    href={primaryButtonUrl || "#experience"}
                    className="
                      group inline-flex min-h-8 flex-1
                      items-center justify-center gap-1.5
                      rounded-full border border-emerald-300/50
                      bg-emerald-400 px-2 py-1.5
                      text-[8px] font-semibold
                      text-[#02110c]
                      shadow-[0_0_25px_rgba(16,185,129,0.16)]
                      transition-all duration-300
                      hover:-translate-y-1 hover:bg-emerald-300
                      min-[380px]:text-[9px]
                      sm:min-h-12 sm:gap-3 sm:px-6 sm:py-3 sm:text-sm
                    "
                  >
                    <span className="truncate">{primaryButtonText}</span>
                    <ArrowRight className="size-3 shrink-0 sm:size-4" />
                  </a>
                )}

                {secondaryButtonText && (
                  <a
                    href={secondaryButtonUrl || "#"}
                    className="
                      group inline-flex min-h-8 flex-1
                      items-center justify-center gap-1.5
                      rounded-full border border-white/15
                      bg-white/[0.04] px-2 py-1.5
                      text-[8px] font-medium text-white
                      backdrop-blur-md
                      transition-all duration-300
                      hover:-translate-y-1 hover:border-emerald-300/50
                      hover:bg-white/[0.08]
                      min-[380px]:text-[9px]
                      sm:min-h-12 sm:gap-3 sm:px-6 sm:py-3 sm:text-sm
                    "
                  >
                    <span className="truncate">{secondaryButtonText}</span>
                    <Download className="size-3 shrink-0 text-emerald-300 sm:size-4" />
                  </a>
                )}
              </motion.div>
            )}
          </div>

          {/* Right image */}
          <div
            className="
              relative flex min-w-0
              min-h-[300px]
              items-center justify-center
              min-[380px]:min-h-[350px]
              sm:min-h-[530px]
              md:min-h-[620px]
              lg:min-h-[680px]
            "
          >
            {/* Glow */}
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
              className="
                absolute left-1/2 top-1/2
                size-[clamp(150px,42vw,650px)]
                -translate-x-1/2 -translate-y-1/2
                rounded-full bg-emerald-400/10
                blur-[clamp(45px,8vw,120px)]
              "
            />

            {/* Outer orbit */}
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
              className="
                absolute left-1/2 top-1/2 aspect-square
                w-[clamp(150px,47vw,690px)]
                -translate-x-1/2 -translate-y-1/2
                rounded-full border border-emerald-300/20
              "
            >
              <span className="absolute left-[12%] top-[-3px] size-1.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.95)] sm:size-3" />
              <span className="absolute bottom-[14%] right-[-3px] size-1.5 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.85)] sm:size-2" />
            </motion.div>

            {/* Secondary orbit */}
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
              className="
                absolute left-1/2 top-1/2
                aspect-[1.08/1]
                w-[clamp(135px,40vw,590px)]
                -translate-x-1/2 -translate-y-1/2
                rotate-[22deg]
                rounded-full border border-emerald-200/15
              "
            >
              <span className="absolute right-[8%] top-[7%] size-1.5 rounded-full bg-emerald-200 shadow-[0_0_15px_rgba(167,243,208,0.8)] sm:size-2" />
            </motion.div>

            {/* Image frame */}
            <div
              className="
                relative z-10
                h-[clamp(260px,70vw,650px)]
                w-[clamp(145px,39vw,470px)]
                min-[380px]:h-[clamp(300px,72vw,650px)]
                min-[380px]:w-[clamp(165px,40vw,470px)]
                sm:h-[clamp(420px,62vw,650px)]
                sm:w-[clamp(250px,42vw,470px)]
              "
            >
              <div
                className="
                  absolute inset-0 rounded-[48%]
                  border border-emerald-300/45
                  shadow-[0_0_45px_rgba(16,185,129,0.12)]
                  sm:shadow-[0_0_60px_rgba(16,185,129,0.12)]
                "
              />

              <div className="absolute inset-1.5 rounded-[48%] border border-white/10 sm:inset-3" />

              <div
                className="
                  absolute inset-3 overflow-hidden
                  rounded-[45%]
                  bg-gradient-to-br from-slate-800
                  via-slate-950 to-emerald-950
                  min-[380px]:inset-3.5
                  sm:inset-5
                "
              >
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
                        ? "object-contain p-2 sm:p-7"
                        : "object-cover"
                    }`}
                    style={{
                      objectPosition: imagePosition,
                    }}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950">
                    <div className="text-center">
                      <div
                        className="
                          mx-auto flex size-10 items-center justify-center
                          rounded-full border border-emerald-400/25
                          bg-emerald-400/[0.06]
                          sm:size-24
                        "
                      >
                        <Sparkles className="size-4 text-emerald-200 sm:size-10" />
                      </div>

                      <p
                        className="
                          mt-2 text-[6px] font-medium uppercase
                          tracking-[0.16em] text-slate-400
                          sm:mt-4 sm:text-xs sm:tracking-[0.2em]
                        "
                      >
                        Add your photo
                      </p>
                    </div>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020817]/60 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-300/[0.08] via-transparent to-transparent" />
              </div>

              {/* Dashed orbit around photo */}
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
                className="
                  pointer-events-none absolute
                  -inset-2 rounded-[50%]
                  border border-dashed border-emerald-300/25
                  sm:-inset-5
                "
              >
                <span className="absolute left-[9%] top-[13%] size-1.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,1)] sm:size-3" />
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
                        y: 15,
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
                className="
                  absolute bottom-[8%] right-[-3%] z-20
                  flex size-[clamp(52px,15vw,132px)]
                  flex-col items-center justify-center
                  rounded-full border border-emerald-300/30
                  bg-[#06131a]/90
                  shadow-[0_0_30px_rgba(16,185,129,0.18)]
                  backdrop-blur-xl
                  min-[380px]:right-[0%]
                  sm:right-[6%]
                "
              >
                <span
                  className="
                    font-[var(--font-hero-serif)]
                    text-[clamp(1.2rem,5vw,2.8rem)]
                    leading-none text-emerald-200
                  "
                >
                  4+
                </span>

                <span className="mt-0.5 text-[6px] font-semibold uppercase tracking-[0.1em] text-slate-300 sm:mt-1 sm:text-[10px]">
                  Years
                </span>

                <span className="text-[5px] uppercase tracking-[0.06em] text-slate-500 sm:text-[8px]">
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
            transition={{ duration: 0.8, delay: 1.05 }}
            className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 sm:bottom-5"
          >
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              <span className="text-[7px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-[10px] sm:tracking-[0.25em]">
                Scroll
              </span>

              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, 4, 0],
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
                className="flex size-6 items-center justify-center rounded-full border border-emerald-400/25 sm:size-8"
              >
                <ArrowDown className="size-2.5 text-emerald-300 sm:size-3.5" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}