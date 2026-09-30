"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  Calculator,
  ChartNoAxesCombined,
  CircleDollarSign,
  FileSpreadsheet,
  Landmark,
  Percent,
  WalletCards,
} from "lucide-react";

type SkillRecord = {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  level: number | null;
  sortOrder: number;
};

type SkillsSectionProps = {
  skills: SkillRecord[];
};

const accentStyles = [
  {
    name: "blue",
    border: "border-cyan-400/80",
    text: "text-cyan-300",
    glow: "shadow-[0_0_35px_rgba(34,211,238,0.18)]",
    iconBg: "bg-cyan-500/10",
    iconBorder: "border-cyan-400/60",
    ring: "stroke-cyan-400",
    glowColor: "rgba(34,211,238,0.35)",
  },
  {
    name: "green",
    border: "border-emerald-400/80",
    text: "text-emerald-300",
    glow: "shadow-[0_0_35px_rgba(52,211,153,0.18)]",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-400/60",
    ring: "stroke-emerald-400",
    glowColor: "rgba(52,211,153,0.35)",
  },
  {
    name: "orange",
    border: "border-orange-400/80",
    text: "text-orange-300",
    glow: "shadow-[0_0_35px_rgba(251,146,60,0.18)]",
    iconBg: "bg-orange-500/10",
    iconBorder: "border-orange-400/60",
    ring: "stroke-orange-400",
    glowColor: "rgba(251,146,60,0.35)",
  },
  {
    name: "purple",
    border: "border-violet-400/80",
    text: "text-violet-300",
    glow: "shadow-[0_0_35px_rgba(167,139,250,0.18)]",
    iconBg: "bg-violet-500/10",
    iconBorder: "border-violet-400/60",
    ring: "stroke-violet-400",
    glowColor: "rgba(167,139,250,0.35)",
  },
  {
    name: "red",
    border: "border-rose-400/80",
    text: "text-rose-300",
    glow: "shadow-[0_0_35px_rgba(251,113,133,0.18)]",
    iconBg: "bg-rose-500/10",
    iconBorder: "border-rose-400/60",
    ring: "stroke-rose-400",
    glowColor: "rgba(251,113,133,0.35)",
  },
];

const iconMap = {
  BarChart3,
  Calculator,
  ChartNoAxesCombined,
  CircleDollarSign,
  FileSpreadsheet,
  Landmark,
  Percent,
  WalletCards,
} as const;

function getSkillIcon(icon: string | null) {
  if (!icon) {
    return BarChart3;
  }

  return (
    iconMap[icon as keyof typeof iconMap] ??
    BarChart3
  );
}

function getAccent(index: number) {
  return accentStyles[index % accentStyles.length];
}

function SkillCard({
  skill,
  index,
}: {
  skill: SkillRecord;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  const accent = getAccent(index);
  const Icon = getSkillIcon(skill.icon);

  const level =
    typeof skill.level === "number"
      ? Math.min(100, Math.max(0, skill.level))
      : null;

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 40, scale: 0.96 }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
  group
  relative
  h-[300px]
  w-full
  max-w-full
  min-[380px]:h-[320px]
  sm:h-[390px]
  sm:max-w-[230px]
"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-8
          rounded-full
          blur-[55px]
          opacity-20
          transition-opacity
          duration-500
          group-hover:opacity-50
        "
        style={{
          backgroundColor: accent.glowColor,
        }}
      />

      {/* Hexagon */}
      <div
        className={`
          absolute
          inset-0
          transition-all
          duration-500
          group-hover:-translate-y-2
          ${accent.glow}
        `}
        style={{
          clipPath:
            "polygon(50% 0%, 94% 16%, 94% 84%, 50% 100%, 6% 84%, 6% 16%)",
        }}
      >
        {/* Outer border */}
        <div
          className={`absolute inset-0 ${accent.border}`}
          style={{
            clipPath:
              "polygon(50% 0%, 94% 16%, 94% 84%, 50% 100%, 6% 84%, 6% 16%)",
            borderWidth: "1px",
          }}
        />

        {/* Inner surface */}
        <div
          className="
            absolute
            inset-[2px]
            bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,8,23,0.98))]
          "
          style={{
            clipPath:
              "polygon(50% 0%, 94% 16%, 94% 84%, 50% 100%, 6% 84%, 6% 16%)",
          }}
        />

        {/* Subtle inner glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 25%, ${accent.glowColor}, transparent 42%)`,
            clipPath:
              "polygon(50% 0%, 94% 16%, 94% 84%, 50% 100%, 6% 84%, 6% 16%)",
          }}
        />

        {/* Content */}
       <div
  className="
    absolute
    inset-0
    flex
    flex-col
    items-center
    px-2
    pb-5
    pt-7
    min-[380px]:px-2.5
    min-[380px]:pb-6
    min-[380px]:pt-8
    sm:px-5
    sm:pb-8
    sm:pt-9
    text-center
  "
>
  {/* Icon */}
  <motion.div
    whileHover={
      shouldReduceMotion
        ? undefined
        : { scale: 1.05 }
    }
    className={`
      relative
      flex
      size-[42px]
      min-[380px]:size-[48px]
      sm:size-[82px]
      shrink-0
      items-center
      justify-center
      rounded-[0.7rem]
      min-[380px]:rounded-[0.85rem]
      sm:rounded-[1.15rem]
      border
      ${accent.iconBorder}
      ${accent.iconBg}
      transition-all
      duration-500
      group-hover:shadow-[0_0_25px_var(--skill-glow)]
    `}
    style={
      {
        "--skill-glow": accent.glowColor,
      } as React.CSSProperties
    }
  >
    <div
      aria-hidden="true"
      className="
        absolute
        inset-1
        min-[380px]:inset-1.5
        sm:inset-2
        rounded-lg
        sm:rounded-xl
        blur-md
        opacity-40
      "
      style={{
        backgroundColor: accent.glowColor,
      }}
    />

    <Icon
      className={`
        relative
        size-5
        min-[380px]:size-6
        sm:size-10
        ${accent.text}
      `}
      strokeWidth={1.7}
    />
  </motion.div>

  {/* Name */}
  <h3
    className="
      mt-3
      min-[380px]:mt-3.5
      sm:mt-6
      w-full
      max-w-[85px]
      min-[380px]:max-w-[100px]
      sm:max-w-[185px]
      break-words
      text-[0.58rem]
      min-[380px]:text-[0.64rem]
      sm:text-[clamp(0.95rem,2vw,1.15rem)]
      font-bold
      uppercase
      leading-[1.08]
      tracking-[-0.02em]
      sm:tracking-[-0.025em]
      text-white
    "
  >
    {skill.name}
  </h3>

  {/* Category */}
  {skill.category && (
    <p
      className="
        mt-1.5
        min-[380px]:mt-2
        sm:mt-3
        w-full
        max-w-[82px]
        min-[380px]:max-w-[95px]
        sm:max-w-[185px]
        break-words
        text-[0.42rem]
        min-[380px]:text-[0.48rem]
        sm:text-[0.68rem]
        font-medium
        uppercase
        leading-[1.35]
        sm:leading-5
        tracking-[0.08em]
        sm:tracking-[0.12em]
        text-slate-400
      "
    >
      {skill.category}
    </p>
  )}

  {/* Proficiency */}
  {level !== null && (
    <div className="relative mt-auto">
      <div
        className="
          relative
          size-[46px]
          min-[380px]:size-[52px]
          sm:size-[82px]
        "
      >
        {/* Background ring */}
        <svg
          viewBox="0 0 100 100"
          className="size-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            className="stroke-white/10"
            strokeWidth="7"
          />

          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            className={accent.ring}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 40}
            initial={{
              strokeDashoffset:
                2 * Math.PI * 40,
            }}
            whileInView={{
              strokeDashoffset:
                2 *
                Math.PI *
                40 *
                (1 - level / 100),
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1.1,
              delay: shouldReduceMotion
                ? 0
                : 0.35 + index * 0.08,
              ease: "easeOut",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="
              text-[0.55rem]
              min-[380px]:text-[0.62rem]
              sm:text-lg
              font-bold
              tabular-nums
              text-white
            "
          >
            {level}%
          </span>
        </div>
      </div>
    </div>
  )}
</div>
      </div>
    </motion.article>
  );
}

export function SkillsSection({
  skills,
}: SkillsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!skills.length) {
    return null;
  }

  return (
    <section
      id="skills"
      className="
        relative
        overflow-hidden
        bg-[#020817]
        py-24
        sm:py-28
        lg:py-36
      "
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          top-20
          size-[420px]
          rounded-full
          bg-cyan-500/[0.07]
          blur-[130px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-10
          size-[480px]
          rounded-full
          bg-violet-500/[0.07]
          blur-[140px]
        "
      />

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)]
          [background-size:70px_70px]
        "
      />

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 20 }
          }
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0 }
          }
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mb-16 max-w-3xl text-center sm:mb-20"
        >
          {/* Top line */}
          <div
            aria-hidden="true"
            className="
              mx-auto
              mb-7
              h-[2px]
              w-12
              bg-white
              shadow-[0_0_18px_rgba(255,255,255,0.55)]
            "
          />

          <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-slate-400">
            Expertise & Proficiencies
          </p>

          <h2
            className="
              mt-3
              text-[clamp(2.2rem,6vw,4.5rem)]
              font-bold
              uppercase
              leading-[0.95]
              tracking-[-0.045em]
              text-white
            "
          >
            My Skillset
          </h2>
        </motion.div>

        {/* Skills */}
<div
  className="
    grid
    grid-cols-3
    justify-items-center
    gap-x-1
    gap-y-6
    min-[380px]:gap-x-2
    min-[380px]:gap-y-7
    sm:grid-cols-2
    sm:gap-x-4
    sm:gap-y-10
    lg:grid-cols-3
    xl:grid-cols-5
    xl:gap-x-2
  "
>
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}