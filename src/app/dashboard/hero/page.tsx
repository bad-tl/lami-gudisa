import { getHero } from "./actions";
import { HeroForm } from "@/components/dashboard/hero/hero-form";

export default async function HeroPage() {
  const hero = await getHero();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/40">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Hero Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Shape the first impression.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage the content, messaging, profile image, and calls to
              action visitors see when they arrive at Lami&apos;s portfolio.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm">
              <span
                className={`size-2 rounded-full ${
                  hero?.status === "PUBLISHED"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />

              {hero?.status === "PUBLISHED" ? "Published" : "Draft"}
            </div>
          </div>
        </div>

        <HeroForm hero={hero} />
      </div>
    </div>
  );
}