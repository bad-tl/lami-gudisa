import { GraduationCap, Plus, BookOpen, CheckCircle2, FileText } from "lucide-react";
import { EducationManager } from "@/components/dashboard/education/education-manager";
import { Button } from "@/components/ui/button";
import { getEducations } from "./actions";

export default async function EducationPage() {
  const educations = await getEducations();

  const total = educations.length;
  const published = educations.filter(
    (education) => education.status === "PUBLISHED",
  ).length;
  const drafts = educations.filter(
    (education) => education.status === "DRAFT",
  ).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Portfolio
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Education
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage academic qualifications, professional studies, and
              educational achievements displayed on your portfolio.
            </p>
          </div>

          <Button className="shrink-0 gap-2">
            <Plus className="size-4" />
            Add Education
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Education
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {total}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Published
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {published}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Drafts
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {drafts}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <FileText className="size-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Education content */}
        <section className="rounded-3xl border bg-card shadow-sm">
          <div className="border-b px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </div>

              <div>
                <h2 className="font-semibold tracking-tight">
                  Academic Journey
                </h2>

                <p className="text-sm text-muted-foreground">
                  Organize the education shown on your public portfolio.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <EducationManager initialEducations={educations} />
          </div>
        </section>
      </div>
    </div>
  );
}