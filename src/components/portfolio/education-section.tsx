"use client";

import * as React from "react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type EducationRecord = {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  description: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
};

type EducationSectionProps = {
  educations: EducationRecord[];
};

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateRange(education: EducationRecord) {
  const start = formatDate(education.startDate);

  if (education.isCurrent) {
    return `${start} — Present`;
  }

  const end = formatDate(education.endDate);

  return end ? `${start} — ${end}` : start;
}

export function EducationSection({
  educations,
}: EducationSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (educations.length === 0) {
    return null;
  }

  return (
    <section
      id="education"
      className="
        relative overflow-hidden
        bg-[#F3F5F1]
        py-24
        sm:py-28
        lg:py-36
      "
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-40 top-20
          size-[420px]
          rounded-full
          bg-emerald-200/25
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -left-40 bottom-10
          size-[360px]
          rounded-full
          bg-amber-200/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          right-[8%] top-[18%]
          hidden
          size-32
          rounded-full
          border border-emerald-900/[0.06]
          lg:block
        "
      />

      <div
        className="
          relative mx-auto
          w-full max-w-7xl
          px-5
          sm:px-8
          lg:px-10
        "
      >
        {/* Header */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 30,
                }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-emerald-700/60" />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.24em]
                text-emerald-800
                sm:text-xs
              "
            >
              Education & Development
            </span>
          </div>

          <h2
            className="
              mt-5
              text-[clamp(2.3rem,6vw,5.2rem)]
              font-semibold
              leading-[0.95]
              tracking-[-0.05em]
              text-[#102A2A]
            "
          >
            Building knowledge.
            <span className="block text-emerald-700">
              Expanding capability.
            </span>
          </h2>

          <p
            className="
              mt-6
              max-w-2xl
              text-sm
              leading-7
              text-slate-600
              sm:text-base
              sm:leading-8
            "
          >
            An academic journey combining accounting, business, and
            technical foundations — continuously expanding the knowledge
            behind professional growth.
          </p>
        </motion.div>

        {/* Education grid */}
        <div
          className="
            mt-14
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            lg:mt-20
            lg:gap-7
          "
        >
          {educations.map((education, index) => {
            const isFeatured = index === 0;
            const isThird = index === 2;

            return (
              <motion.article
                key={education.id}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 35,
                      }
                }
                whileInView={
                  shouldReduceMotion
                    ? undefined
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
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.1, 0.25),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[1.75rem]
                  border
                  border-[#DCE5E2]
                  bg-white
                  p-6
                  shadow-[0_12px_40px_rgba(16,42,42,0.06)]
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:border-emerald-700/30
                  hover:shadow-[0_20px_55px_rgba(15,118,110,0.10)]
                  sm:p-8
                  ${isThird ? "md:col-span-2" : ""}
                `}
              >
                {/* Accent line */}
                <div
                  className={`
                    absolute
                    inset-y-0
                    left-0
                    w-1
                    transition-all
                    duration-500
                    group-hover:w-1.5
                    ${
                      isFeatured
                        ? "bg-emerald-700"
                        : isThird
                          ? "bg-amber-500"
                          : "bg-teal-600"
                    }
                  `}
                />

                {/* Soft card glow */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -right-24
                    size-56
                    rounded-full
                    bg-emerald-100/40
                    blur-3xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                <div className="relative">
                  {/* Top row */}
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        size-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-emerald-50
                        text-emerald-700
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    >
                      <GraduationCap className="size-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      {education.isCurrent && (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-emerald-700
                            px-3
                            py-1.5
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-white
                          "
                        >
                          <Sparkles className="size-3" />
                          Current
                        </span>
                      )}

                      <span
                        className="
                          hidden
                          text-[11px]
                          font-bold
                          tabular-nums
                          tracking-[0.15em]
                          text-slate-400
                          sm:block
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Main content */}
                  <div
                    className={`
                      mt-7
                      ${
                        isThird
                          ? "md:max-w-4xl"
                          : "max-w-2xl"
                      }
                    `}
                  >
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-emerald-700
                      "
                    >
                      {education.field || "Academic qualification"}
                    </p>

                    <h3
                      className="
                        mt-2
                        break-words
                        text-[clamp(1.35rem,2.5vw,2rem)]
                        font-semibold
                        leading-tight
                        tracking-[-0.03em]
                        text-[#102A2A]
                      "
                    >
                      {education.degree}
                    </h3>

                    <p
                      className="
                        mt-2
                        break-words
                        text-sm
                        font-medium
                        text-slate-600
                        sm:text-base
                      "
                    >
                      {education.institution}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div
                    className="
                      mt-6
                      flex
                      min-w-0
                      flex-wrap
                      gap-x-5
                      gap-y-3
                      border-t
                      border-slate-200/80
                      pt-5
                    "
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <CalendarDays className="size-4 shrink-0 text-emerald-700" />

                      <span
                        className="
                          break-words
                          text-xs
                          font-medium
                          text-slate-600
                          sm:text-sm
                        "
                      >
                        {formatDateRange(education)}
                      </span>
                    </div>

                    {education.location && (
                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-emerald-700" />

                        <span
                          className="
                            break-words
                            text-xs
                            font-medium
                            text-slate-600
                            sm:text-sm
                          "
                        >
                          {education.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {education.description && (
                    <div
                      className="
                        mt-6
                        flex
                        min-w-0
                        items-start
                        gap-3
                      "
                    >
                      <BookOpen
                        className="
                          mt-1
                          size-4
                          shrink-0
                          text-amber-600
                        "
                      />

                      <p
                        className="
                          min-w-0
                          max-w-2xl
                          break-words
                          text-sm
                          leading-7
                          text-slate-600
                        "
                      >
                        {education.description}
                      </p>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 25,
                }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
          }}
          className="
            mt-8
            overflow-hidden
            rounded-[1.75rem]
            border
            border-emerald-900/10
            bg-emerald-900
            px-6
            py-8
            sm:px-10
            sm:py-10
            lg:px-12
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="max-w-2xl">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-emerald-200/80
                "
              >
                Continuous development
              </p>

              <p
                className="
                  mt-3
                  text-xl
                  font-medium
                  leading-tight
                  tracking-[-0.02em]
                  text-white
                  sm:text-2xl
                "
              >
                Knowledge creates the foundation for better decisions.
              </p>
            </div>

            <div
              className="
                shrink-0
                text-left
                sm:text-right
              "
            >
              <p
                className="
                  font-serif
                  text-2xl
                  italic
                  text-amber-200
                  sm:text-3xl
                "
              >
                Learn.
              </p>

              <p
                className="
                  font-serif
                  text-2xl
                  italic
                  text-emerald-100
                  sm:text-3xl
                "
              >
                Grow. Lead.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}