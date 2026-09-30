"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  Building2,
  CalendarDays,
  ArrowDownRight,
} from "lucide-react";

type AboutSectionProps = {
  about: {
    title: string;
    shortDescription: string | null;
    fullDescription: string | null;
    yearsOfExperience: string | null;
    location: string | null;
    position: string | null;
    organization: string | null;
    educationSummary: string | null;
    imageUrl: string | null;
  } | null;
};

export function AboutSection({
  about,
}: AboutSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!about) {
    return null;
  }

  const fadeUp = {
    initial: shouldReduceMotion
      ? false
      : {
          opacity: 0,
          y: 28,
        },
    whileInView: {
      opacity: 1,
      y: 0,
    },
    viewport: {
      once: true,
      amount: 0.15,
    },
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-[#06100f] py-24 text-white sm:py-28 lg:py-36"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-emerald-500/[0.07] blur-[120px]" />

        <div className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-teal-400/[0.05] blur-[130px]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* Decorative vertical line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent lg:block"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <motion.div
          {...fadeUp}
          className="mx-auto mb-16 max-w-3xl text-center lg:mb-24"
        >
          <div className="mb-5 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-300/80 sm:text-[11px]">
            <span className="h-px w-8 bg-emerald-400/60" />
            About Me
            <span className="h-px w-8 bg-emerald-400/60" />
          </div>

          <h2 className="text-balance font-serif text-[clamp(2.3rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.035em] text-white">
            {about.title}
          </h2>

          {about.shortDescription && (
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-[clamp(0.95rem,1.5vw,1.15rem)] leading-7 text-slate-400 sm:leading-8">
              {about.shortDescription}
            </p>
          )}
        </motion.div>

        {/* Main content */}
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.18fr)] lg:gap-20 xl:gap-28">
          {/* Image */}
<motion.div
  whileHover={
    shouldReduceMotion
      ? undefined
      : {
          y: -8,
          scale: 1.015,
          rotate: 0.5,
        }
  }
  transition={{
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1] as const,
  }}
  className="
    relative
    overflow-hidden
    rounded-[3rem]
    rounded-tl-[5rem]
    rounded-br-[5rem]
    rounded-tr-[1.5rem]
    rounded-bl-[1.5rem]
    border border-white/[0.09]
    bg-gradient-to-br
    from-emerald-400/[0.08]
    via-white/[0.035]
    to-transparent
    shadow-[0_35px_90px_rgba(0,0,0,0.4)]
  "
>
  <motion.div
    animate={
      shouldReduceMotion
        ? undefined
        : {
            y: [0, -6, 0, 5, 0],
            rotate: [0, 0.4, 0, -0.4, 0],
          }
    }
    transition={{
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="
      relative
      aspect-[4/5]
      overflow-hidden
      rounded-[3rem]
      rounded-tl-[5rem]
      rounded-br-[5rem]
      rounded-tr-[1.5rem]
      rounded-bl-[1.5rem]
    "
  >
    {about.imageUrl ? (
      <motion.img
        src={about.imageUrl}
        alt={`${about.title} professional portrait`}
        className="
          h-full
          w-full
          object-contain
          object-center
        "
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                scale: 1.025,
              }
        }
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-950 to-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-3 h-16 w-16 rounded-full border border-emerald-400/20 bg-emerald-400/10" />

          <p className="text-sm text-slate-500">
            Professional portrait
          </p>
        </div>
      </div>
    )}

    {/* Image overlay */}
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute inset-0
        bg-gradient-to-t
        from-[#020817]/40
        via-transparent
        to-emerald-300/[0.04]
      "
    />

    {/* Subtle moving glow */}
    {!shouldReduceMotion && (
      <motion.div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -inset-20
          rounded-full
          bg-emerald-400/[0.08]
          blur-3xl
        "
        animate={{
          x: ["-20%", "20%", "-20%"],
          y: ["-10%", "15%", "-10%"],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    )}
  </motion.div>

  {/* Experience badge */}
  {about.yearsOfExperience && (
    <div className="absolute bottom-5 left-5 right-5">
      <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-[#020817]/75 px-4 py-3.5 shadow-xl backdrop-blur-xl sm:px-5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
            Experience
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            Professional experience
          </p>
        </div>

        <span className="text-xl font-semibold tracking-tight text-emerald-300">
          {about.yearsOfExperience}
        </span>
      </div>
    </div>
  )}
</motion.div>


          {/* Story/content */}
          <div>
            <motion.div
              {...fadeUp}
              className="mb-10"
            >
              {about.position && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
                  {about.position}
                </p>
              )}

              <h3 className="max-w-2xl text-[clamp(1.8rem,3.5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-white">
                Precision in numbers.
                <br />
                Confidence in decisions.
              </h3>
            </motion.div>

            {about.fullDescription && (
              <motion.div
                {...fadeUp}
                transition={{
                  duration: 0.7,
                  delay: 0.08,
                  ease: "easeOut",
                }}
                className="max-w-2xl"
              >
                <p className="whitespace-pre-line text-[clamp(0.98rem,1.3vw,1.08rem)] leading-8 text-slate-400">
                  {about.fullDescription}
                </p>
              </motion.div>
            )}

            {/* Professional facts */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 25,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="mt-10 border-t border-white/[0.08] pt-8"
            >
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {about.position && (
                  <InfoItem
                    icon={BriefcaseBusiness}
                    label="Current Role"
                    value={about.position}
                  />
                )}

                {about.organization && (
                  <InfoItem
                    icon={Building2}
                    label="Organization"
                    value={about.organization}
                  />
                )}

                {about.location && (
                  <InfoItem
                    icon={MapPin}
                    label="Location"
                    value={about.location}
                  />
                )}

                {about.yearsOfExperience && (
                  <InfoItem
                    icon={CalendarDays}
                    label="Experience"
                    value={about.yearsOfExperience}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Education */}
        {about.educationSummary && (
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 30,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.75,
              delay: 0.05,
              ease: "easeOut",
            }}
            className="mt-20 border-t border-white/[0.08] pt-12 lg:mt-28 lg:pt-16"
          >
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-20">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300">
                    <GraduationCap className="h-5 w-5" />
                  </span>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
                    Education
                  </p>
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Building knowledge
                  <br className="hidden sm:block" />
                  alongside experience.
                </h3>
              </div>

              <div className="relative border-l border-emerald-400/20 pl-6 sm:pl-8">
                <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.55)]" />

                <p className="whitespace-pre-line text-[clamp(1rem,1.4vw,1.1rem)] leading-8 text-slate-400">
                  {about.educationSummary}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom scroll cue */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                }
          }
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.3,
          }}
          className="mt-20 flex justify-center lg:mt-24"
        >
          <a
            href="#experience"
            aria-label="Continue to experience section"
            className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-emerald-300"
          >
            <span>Continue</span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/10">
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-emerald-300/80 transition-colors duration-300 group-hover:border-emerald-400/20 group-hover:bg-emerald-400/[0.06]">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600 sm:text-[10px]">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium leading-6 text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}