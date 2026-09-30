"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDownRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

type Experience = {
  id: string;
  position: string;
  company: string;
  employmentType: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
  achievements: string | null;
  sortOrder: number;
};

type ExperienceSectionProps = {
  experiences: Experience[];
};

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateRange(experience: Experience) {
  const start = formatMonthYear(experience.startDate);

  if (experience.isCurrent) {
    return `${start} — Present`;
  }

  if (experience.endDate) {
    return `${start} — ${formatMonthYear(
      experience.endDate,
    )}`;
  }

  return start;
}

function getAchievements(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const accentStyles = [
  {
    line: "from-emerald-400 to-teal-400",
    glow: "rgba(16,185,129,0.24)",
    border:
      "hover:border-emerald-400/30 dark:hover:border-emerald-400/30",
    badge:
      "bg-emerald-400/10 text-emerald-300 border-emerald-400/15",
    number: "text-emerald-300",
  },
  {
    line: "from-amber-300 to-orange-400",
    glow: "rgba(245,158,11,0.20)",
    border:
      "hover:border-amber-300/30 dark:hover:border-amber-300/30",
    badge:
      "bg-amber-300/10 text-amber-200 border-amber-300/15",
    number: "text-amber-200",
  },
  {
    line: "from-teal-300 to-cyan-400",
    glow: "rgba(20,184,166,0.20)",
    border:
      "hover:border-teal-300/30 dark:hover:border-teal-300/30",
    badge:
      "bg-teal-300/10 text-teal-200 border-teal-300/15",
    number: "text-teal-200",
  },
  {
    line: "from-violet-300 to-indigo-400",
    glow: "rgba(139,92,246,0.18)",
    border:
      "hover:border-violet-300/30 dark:hover:border-violet-300/30",
    badge:
      "bg-violet-300/10 text-violet-200 border-violet-300/15",
    number: "text-violet-200",
  },
];

export function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!experiences.length) {
    return null;
  }

  const totalYears =
    experiences.length > 0
      ? Math.max(
          1,
          Math.round(
            (Date.now() -
              new Date(
                Math.min(
                  ...experiences.map((item) =>
                    new Date(item.startDate).getTime(),
                  ),
                ),
              ).getTime()) /
              (1000 * 60 * 60 * 24 * 365.25),
          ),
        )
      : 0;

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-[#020817] py-24 sm:py-28 lg:py-36"
    >
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[-15%] top-[8%] h-[420px] w-[420px] rounded-full bg-emerald-500/[0.07] blur-[130px]" />

        <div className="absolute right-[-12%] top-[35%] h-[500px] w-[500px] rounded-full bg-teal-500/[0.045] blur-[150px]" />

        <div className="absolute bottom-[-15%] left-[25%] h-[420px] w-[420px] rounded-full bg-amber-400/[0.035] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 24 }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5">
            <Sparkles className="size-3.5 text-emerald-300" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
              Professional Journey
            </span>
          </div>

<h2
  className="
    mt-6
    whitespace-nowrap
    text-[1.15rem]
    font-semibold
    leading-[0.98]
    tracking-[-0.045em]
    text-white
    min-[380px]:text-[1.3rem]
    sm:text-[2.4rem]
    md:text-[3.4rem]
    lg:text-[3.4rem]
    xl:text-[3.4rem]
  "
>
  Experience that{" "}
  <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
    shapes expertise.
  </span>
</h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            A record of professional roles, responsibilities,
            and achievements built through years of experience
            in accounting and financial management.
          </p>
        </motion.div>

        {/* Experience summary */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 16 }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mx-auto mt-10 flex w-fit items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-3 backdrop-blur-sm"
        >
          <BriefcaseBusiness className="size-4 text-emerald-300" />

          <span className="text-sm font-medium text-slate-300">
            {experiences.length}{" "}
            {experiences.length === 1
              ? "professional role"
              : "professional roles"}
          </span>

          <span className="h-1 w-1 rounded-full bg-slate-600" />

          <span className="text-sm font-semibold text-emerald-300">
            {totalYears}+ years
          </span>
        </motion.div>

        {/* Timeline */}
        <div className="relative mx-auto mt-20 max-w-5xl sm:mt-24">
          {/* Desktop timeline line */}
          <motion.div
            aria-hidden="true"
            initial={
              shouldReduceMotion
                ? false
                : { scaleY: 0 }
            }
            whileInView={
              shouldReduceMotion
                ? undefined
                : { scaleY: 1 }
            }
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 1.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              transformOrigin: "top",
            }}
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-emerald-400/60 via-white/10 to-transparent lg:block"
          />

          {/* Mobile timeline line */}
          <motion.div
            aria-hidden="true"
            initial={
              shouldReduceMotion
                ? false
                : { scaleY: 0 }
            }
            whileInView={
              shouldReduceMotion
                ? undefined
                : { scaleY: 1 }
            }
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 1.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              transformOrigin: "top",
            }}
            className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-emerald-400/60 via-white/10 to-transparent lg:hidden"
          />

          <div className="space-y-12 lg:space-y-24">
            {experiences.map((experience, index) => {
              const accent =
                accentStyles[index % accentStyles.length];

              const achievements = getAchievements(
                experience.achievements,
              );

              const isEven = index % 2 === 0;

              return (
                <motion.article
                  key={experience.id}
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: isEven ? -35 : 35,
                        }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? undefined
                      : {
                          opacity: 1,
                          x: 0,
                        }
                  }
                  viewport={{
                    once: true,
                    amount: 0.18,
                  }}
                  transition={{
                    duration: 0.75,
                    delay: 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative lg:grid lg:grid-cols-2 lg:gap-16"
                >
                  {/* Timeline node */}
                  <div
                    className="absolute left-0 top-8 z-20 hidden -translate-x-1/2 lg:block"
                    aria-hidden="true"
                  >
                    <motion.div
                      whileInView={
                        shouldReduceMotion
                          ? undefined
                          : {
                              scale: [0.8, 1.12, 1],
                            }
                      }
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.7,
                        delay: 0.25,
                      }}
                      className="relative flex size-5 items-center justify-center rounded-full border border-[#020817] bg-emerald-300 shadow-[0_0_0_5px_rgba(16,185,129,0.08),0_0_28px_rgba(16,185,129,0.3)]"
                    >
                      <span className="size-1.5 rounded-full bg-[#020817]" />
                    </motion.div>
                  </div>

                  {/* Mobile node */}
                  <div
                    className="absolute left-3 top-8 z-20 flex size-4 -translate-x-1/2 items-center justify-center rounded-full border border-[#020817] bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] lg:hidden"
                    aria-hidden="true"
                  >
                    <span className="size-1 rounded-full bg-[#020817]" />
                  </div>

                  {/* Empty desktop half */}
                  <div
                    className={`hidden lg:block ${
                      isEven ? "order-2" : "order-1"
                    }`}
                  />

                  {/* Card */}
                  <div
                    className={`relative pl-10 lg:pl-0 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <motion.div
                      whileHover={
                        shouldReduceMotion
                          ? undefined
                          : {
                              y: -7,
                              scale: 1.012,
                            }
                      }
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition-colors duration-500 sm:p-7 lg:p-8 ${accent.border}`}
                      style={{
                        boxShadow: undefined,
                      }}
                    >
                      {/* Hover glow */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-24 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(circle, ${accent.glow} 0%, transparent 65%)`,
                        }}
                      />

                      {/* Accent edge */}
                      <div
                        aria-hidden="true"
                        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${accent.line}`}
                      />

                      <div className="relative">
                        {/* Top metadata */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold tabular-nums ${accent.number}`}
                            >
                              {String(index + 1).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <span className="h-3 w-px bg-white/10" />

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${accent.badge}`}
                            >
                              {experience.isCurrent
                                ? "Current role"
                                : "Professional experience"}
                            </span>
                          </div>

                          {experience.isCurrent && (
                            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                              <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                              </span>
                              Present
                            </span>
                          )}
                        </div>

                        {/* Main content */}
                        <div className="mt-6">
<h3 className="min-w-0 break-words text-[clamp(1.05rem,4vw,1.6rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
  {experience.position}
</h3>

                          <p className="mt-2 text-base font-medium text-emerald-200/90">
                            {experience.company}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="size-3.5 text-slate-500" />
                              {formatDateRange(
                                experience,
                              )}
                            </span>

                            {experience.location && (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="size-3.5 text-slate-500" />
                                {experience.location}
                              </span>
                            )}

                            {experience.employmentType && (
                              <span className="inline-flex items-center gap-1.5">
                                <BriefcaseBusiness className="size-3.5 text-slate-500" />
                                {experience.employmentType}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {experience.description && (
                          <div className="mt-6 border-t border-white/[0.07] pt-6">
                           <p className="max-w-full break-words text-[clamp(0.82rem,3vw,0.98rem)] leading-7 text-slate-300">
  {experience.description}
</p>
                          </div>
                        )}

                        {/* Achievements */}
{achievements.length > 0 && (
  <div className="mt-6 min-w-0 border-t border-white/[0.07] pt-6">
    <div className="mb-4 flex min-w-0 items-center gap-2">
      <CheckCircle2 className="size-4 shrink-0 text-emerald-300" />

      <span className="min-w-0 break-words text-[clamp(0.6rem,2.5vw,0.625rem)] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Key achievements
      </span>
    </div>

    <div className="min-w-0 space-y-3">
      {achievements.map(
        (achievement, achievementIndex) => (
          <div
            key={`${experience.id}-${achievementIndex}`}
            className="flex min-w-0 items-start gap-2.5 sm:gap-3"
          >
            <span className="mt-0.5 shrink-0 text-[clamp(0.6rem,2.4vw,0.625rem)] font-bold tabular-nums text-slate-600">
              {String(
                achievementIndex + 1,
              ).padStart(2, "0")}
            </span>

            <p className="min-w-0 max-w-full break-words text-[clamp(0.78rem,3vw,0.875rem)] leading-6 text-slate-300">
              {achievement}
            </p>
          </div>
        ),
      )}
    </div>
  </div>
)}

                        {/* Bottom accent */}
                        <div className="mt-7 flex items-center justify-between border-t border-white/[0.07] pt-5">
                          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
                            Professional journey
                          </span>

                          <ArrowDownRight className="size-4 text-slate-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-emerald-300" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Ending */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 20 }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-20 flex max-w-xl flex-col items-center text-center sm:mt-28"
        >
          <div className="relative flex size-10 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.05]">
            <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.7)]" />

            <span className="absolute inset-[-7px] rounded-full border border-emerald-400/10" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
            Continuing forward
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Every role adds another layer of experience,
            perspective, and professional growth.
          </p>
        </motion.div>
      </div>
    </section>
  );
}