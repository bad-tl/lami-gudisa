import { getAbout } from "./actions";
import { AboutForm } from "@/components/dashboard/about/about-form";

export default async function AboutPage() {
  const about = await getAbout();

  const isPublished = about?.status === "PUBLISHED";

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f7f9f8] transition-colors duration-500 dark:bg-[#050b0a]">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-500/10" />

        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:32px_32px] dark:[background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                  isPublished
                    ? "bg-emerald-400/70"
                    : "bg-amber-400/70"
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isPublished ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>

            About
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Shape the story behind the professional.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            Manage the information visitors will see in the About section
            of the portfolio.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPublished
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
            />

            {isPublished ? "Published" : "Draft"}
          </div>
        </div>

        <AboutForm about={about} />
      </div>
    </div>
  );
}