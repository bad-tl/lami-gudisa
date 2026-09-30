import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  ImageIcon,
  Mail,
  Pencil,
  Plus,
  Sparkles,
  Wrench,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Activity = {
  title: string;
  description: string;
  date: Date;
  href: string;
  icon: typeof BriefcaseBusiness;
};

function formatRelativeTime(date: Date) {
  const difference = Math.max(0, Date.now() - date.getTime());

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function StatusBadge({
  status,
}: {
  status: "published" | "draft";
}) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      Draft
    </span>
  );
}

export default async function DashboardPage() {
  const [
    experienceCount,
    experiencePublished,
    educationCount,
    educationPublished,
    skillCount,
    skillPublished,
    galleryCount,
    galleryPublished,
    certificateCount,
    certificatePublished,
    contact,
    socialCount,
  ] = await Promise.all([
    prisma.experience.count(),
    prisma.experience.count({
      where: { status: "PUBLISHED" },
    }),

    prisma.education.count(),
    prisma.education.count({
      where: { status: "PUBLISHED" },
    }),

    prisma.skill.count(),
    prisma.skill.count({
      where: { status: "PUBLISHED" },
    }),

    prisma.gallery.count(),
    prisma.gallery.count({
      where: { status: "PUBLISHED" },
    }),

    prisma.certificate.count(),
    prisma.certificate.count({
      where: { status: "PUBLISHED" },
    }),

    prisma.contact.findFirst({
      orderBy: { createdAt: "asc" },
    }),

    prisma.socialLink.count({
      where: { status: "PUBLISHED" },
    }),
  ]);

  const activityResults = await Promise.all([
    prisma.experience.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        position: true,
        company: true,
        updatedAt: true,
      },
    }),

    prisma.education.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        degree: true,
        institution: true,
        updatedAt: true,
      },
    }),

    prisma.skill.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    }),

    prisma.gallery.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    }),

    prisma.certificate.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    }),

    prisma.contact.findMany({
      orderBy: { updatedAt: "desc" },
      take: 1,
      select: {
        id: true,
        updatedAt: true,
      },
    }),
  ]);

  const activities: Activity[] = [
    ...activityResults[0].map((item) => ({
      title: "Experience updated",
      description: `${item.position} at ${item.company}`,
      date: item.updatedAt,
      href: "/dashboard/experience",
      icon: BriefcaseBusiness,
    })),

    ...activityResults[1].map((item) => ({
      title: "Education updated",
      description: `${item.degree} — ${item.institution}`,
      date: item.updatedAt,
      href: "/dashboard/education",
      icon: BookOpen,
    })),

    ...activityResults[2].map((item) => ({
      title: "Skill updated",
      description: item.name,
      date: item.updatedAt,
      href: "/dashboard/skills",
      icon: Wrench,
    })),

    ...activityResults[3].map((item) => ({
      title: "Gallery updated",
      description: item.title,
      date: item.updatedAt,
      href: "/dashboard/gallery",
      icon: ImageIcon,
    })),

    ...activityResults[4].map((item) => ({
      title: "Certificate updated",
      description: item.title,
      date: item.updatedAt,
      href: "/dashboard/certificates",
      icon: Award,
    })),

    ...activityResults[5].map((item) => ({
      title: "Contact settings updated",
      description: "Contact information and social links",
      date: item.updatedAt,
      href: "/dashboard/contact",
      icon: Mail,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const portfolioItems = [
    {
      title: "Experience",
      description: "Professional career history",
      total: experienceCount,
      published: experiencePublished,
      href: "/dashboard/experience",
      icon: BriefcaseBusiness,
    },
    {
      title: "Education",
      description: "Academic background",
      total: educationCount,
      published: educationPublished,
      href: "/dashboard/education",
      icon: BookOpen,
    },
    {
      title: "Skills",
      description: "Professional capabilities",
      total: skillCount,
      published: skillPublished,
      href: "/dashboard/skills",
      icon: Wrench,
    },
    {
      title: "Gallery",
      description: "Professional photos",
      total: galleryCount,
      published: galleryPublished,
      href: "/dashboard/gallery",
      icon: ImageIcon,
    },
    {
      title: "Certificates",
      description: "Professional credentials",
      total: certificateCount,
      published: certificatePublished,
      href: "/dashboard/certificates",
      icon: Award,
    },
  ];

  const quickActions = [
    {
      label: "Edit Hero",
      description: "Update the first impression",
      href: "/dashboard/hero",
      icon: Sparkles,
    },
    {
      label: "Add Experience",
      description: "Add a new position",
      href: "/dashboard/experience",
      icon: Plus,
    },
    {
      label: "Add Education",
      description: "Add academic history",
      href: "/dashboard/education",
      icon: BookOpen,
    },
    {
      label: "Upload Gallery",
      description: "Add a professional image",
      href: "/dashboard/gallery",
      icon: ImageIcon,
    },
    {
      label: "Add Certificate",
      description: "Add a new credential",
      href: "/dashboard/certificates",
      icon: Award,
    },
    {
      label: "Edit Contact",
      description: "Manage contact details",
      href: "/dashboard/contact",
      icon: Mail,
    },
  ];

  const contactActive = contact?.status === "PUBLISHED";

  return (
    <main className="relative min-h-full overflow-hidden bg-[#F7F8F7] text-zinc-950 transition-colors dark:bg-[#071411] dark:text-[#F5F3ED]">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/[0.04] blur-[130px] dark:bg-emerald-500/[0.08]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-72 h-80 w-80 rounded-full bg-teal-400/[0.03] blur-[120px] dark:bg-teal-400/[0.05]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.7) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Header */}
        <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-400/15 dark:bg-emerald-400/[0.06] dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Portfolio Control Center
            </div>

            <h1 className="font-serif text-4xl font-medium tracking-tight text-zinc-950 dark:text-[#F5F3ED] sm:text-5xl">
              Welcome back, Lami.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-white/45">
              Manage your professional portfolio, keep your information
              current, and control what visitors see on the public website.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:shadow-none dark:hover:border-emerald-400/30 dark:hover:bg-emerald-400/[0.06] dark:hover:text-emerald-300"
          >
            View Website
            <ExternalLink className="h-4 w-4" />
          </Link>
        </section>

        {/* Portfolio status */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                Portfolio
              </p>

              <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                Content status
              </h2>
            </div>

            <span className="text-xs text-zinc-400 dark:text-white/30">
              Live database data
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {portfolioItems.map((item) => {
              const Icon = item.icon;
              const isPublished = item.published > 0;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_15px_40px_rgba(15,23,42,0.07)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:hover:border-emerald-400/25 dark:hover:bg-emerald-400/[0.045]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/10 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-400/10 dark:text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-white/20 dark:group-hover:text-emerald-400" />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-zinc-950 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-1 min-h-10 text-xs leading-5 text-zinc-400 dark:text-white/35">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-white/[0.07]">
                    <span className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                      {item.total}
                    </span>

                    <StatusBadge
                      status={isPublished ? "published" : "draft"}
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-zinc-400 dark:text-white/30">
                    {item.published} published
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick actions + website */}
        <section className="mt-10 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                  Shortcuts
                </p>

                <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                  Quick actions
                </h2>
              </div>

              <Pencil className="h-5 w-5 text-zinc-300 dark:text-white/20" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-white/[0.07] dark:bg-black/10 dark:hover:border-emerald-400/20 dark:hover:bg-emerald-400/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 shadow-sm transition group-hover:text-emerald-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/60 dark:shadow-none dark:group-hover:text-emerald-300">
                        <Icon className="h-4 w-4" />
                      </div>

                      <ArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-white/20 dark:group-hover:text-emerald-400" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
                      {action.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-400 dark:text-white/35">
                      {action.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
              Public website
            </p>

            <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
              Website status
            </h2>

            <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/[0.07] dark:bg-black/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/10 bg-emerald-500/[0.08] dark:border-emerald-400/10 dark:bg-emerald-400/[0.08]">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {contactActive
                      ? "Portfolio is active"
                      : "Needs attention"}
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-400 dark:text-white/35">
                    Contact status:{" "}
                    {contactActive ? "Published" : "Not published"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-zinc-200 pt-4 dark:border-white/[0.07]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 dark:text-white/40">
                    Social links
                  </span>

                  <span className="font-semibold text-zinc-900 dark:text-white/80">
                    {socialCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 dark:text-white/40">
                    Public sections
                  </span>

                  <span className="font-semibold text-zinc-900 dark:text-white/80">
                    {
                      portfolioItems.filter(
                        (item) => item.published > 0,
                      ).length
                    }
                    /{portfolioItems.length}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-[#04100C] transition hover:bg-emerald-400"
            >
              Open Public Portfolio
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Recent activity */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                Activity
              </p>

              <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                Recent updates
              </h2>
            </div>

            <Link
              href="/dashboard/activity"
              className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-emerald-700 dark:text-white/40 dark:hover:text-emerald-300"
            >
              View all activity
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.03)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
            {activities.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-white/[0.06]">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <Link
                      key={`${activity.href}-${activity.date.toISOString()}-${activity.description}`}
                      href={activity.href}
                      className="group flex items-center gap-4 px-5 py-4 transition hover:bg-emerald-50/30 dark:hover:bg-emerald-400/[0.025] sm:px-6"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 transition group-hover:border-emerald-300 group-hover:bg-emerald-50 group-hover:text-emerald-700 dark:border-white/[0.07] dark:bg-white/[0.04] dark:text-white/45 dark:group-hover:border-emerald-400/15 dark:group-hover:bg-emerald-400/[0.07] dark:group-hover:text-emerald-300">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          {activity.title}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-zinc-400 dark:text-white/35">
                          {activity.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="hidden text-xs text-zinc-400 dark:text-white/30 sm:block">
                          {formatRelativeTime(activity.date)}
                        </span>

                        <ArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-white/15 dark:group-hover:text-emerald-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 dark:border-white/[0.07] dark:bg-white/[0.04]">
                  <Pencil className="h-5 w-5 text-zinc-400 dark:text-white/30" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
                  No recent activity
                </h3>

                <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-400 dark:text-white/35">
                  Updates to your portfolio content will appear here
                  automatically.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-6">
          <Link
            href="/dashboard/contact"
            className="group flex items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:border-emerald-300 dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:hover:border-emerald-400/20 dark:hover:bg-emerald-400/[0.03]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/10 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-400/10 dark:bg-emerald-400/[0.08] dark:text-emerald-300">
              <Mail className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Contact information
              </p>

              <p className="mt-1 truncate text-xs text-zinc-400 dark:text-white/35">
                {contact?.email || "No contact email configured"}
              </p>
            </div>

            <ArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-white/20 dark:group-hover:text-emerald-400" />
          </Link>
        </section>
      </div>
    </main>
  );
}