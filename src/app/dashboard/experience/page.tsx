import {
  BriefcaseBusiness,
  FileCheck2,
  FilePenLine,
} from "lucide-react";

import { ExperienceManager } from "@/components/dashboard/experience/experience-manager";
import { getExperiences } from "./actions";

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  const total = experiences.length;

  const published = experiences.filter(
    (experience) => experience.status === "PUBLISHED",
  ).length;

  const drafts = experiences.filter(
    (experience) => experience.status === "DRAFT",
  ).length;

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#020817]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Portfolio Management
          </p>

          <div className="mt-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Professional Journey
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage the professional experiences displayed on
              the public portfolio.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/[0.07] dark:bg-white/[0.025]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Experiences
                </p>

                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                  {total}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                <BriefcaseBusiness className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-400/10 dark:bg-emerald-400/[0.04]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-700/80 dark:text-emerald-300/70">
                  Published
                </p>

                <p className="mt-2 text-2xl font-semibold text-emerald-800 dark:text-emerald-300">
                  {published}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                <FileCheck2 className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 shadow-sm dark:border-amber-400/10 dark:bg-amber-400/[0.04]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-700/80 dark:text-amber-300/70">
                  Drafts
                </p>

                <p className="mt-2 text-2xl font-semibold text-amber-800 dark:text-amber-300">
                  {drafts}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                <FilePenLine className="size-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Experience manager */}
        <ExperienceManager experiences={experiences} />
      </div>
    </div>
  );
}