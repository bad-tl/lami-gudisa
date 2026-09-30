import {
  BarChart3,
  CheckCircle2,
  FileImage,
  FolderOpen,
  Sparkles,
} from "lucide-react";

import { getGalleryItems } from "./actions";
import { GalleryManager } from "@/components/dashboard/gallery/gallery-manager";

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  const totalItems = galleryItems.length;

  const publishedItems = galleryItems.filter(
    (item) => item.status === "PUBLISHED",
  ).length;

  const draftItems = galleryItems.filter(
    (item) => item.status === "DRAFT",
  ).length;

  const categories = new Set(
    galleryItems
      .map((item) => item.category?.trim())
      .filter(Boolean),
  ).size;

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-4" />
              <span>Visual Portfolio</span>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Gallery
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Manage the images and visual experiences displayed
                on the public portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-muted p-2.5 text-muted-foreground">
                <FileImage className="size-5" />
              </div>

              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total
              </span>
            </div>

            <p className="text-3xl font-semibold text-foreground">
              {totalItems}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Gallery items
            </p>
          </div>

          {/* Published */}
          <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                <CheckCircle2 className="size-5" />
              </div>

              <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Published
              </span>
            </div>

            <p className="text-3xl font-semibold text-foreground">
              {publishedItems}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Visible publicly
            </p>
          </div>

          {/* Drafts */}
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                <FolderOpen className="size-5" />
              </div>

              <span className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Drafts
              </span>
            </div>

            <p className="text-3xl font-semibold text-foreground">
              {draftItems}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Not published
            </p>
          </div>

          {/* Categories */}
          <div className="rounded-2xl border border-sky-200/70 bg-sky-50/70 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300">
                <BarChart3 className="size-5" />
              </div>

              <span className="text-xs font-medium uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Categories
              </span>
            </div>

            <p className="text-3xl font-semibold text-foreground">
              {categories}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Visual groups
            </p>
          </div>
        </div>

        {/* Gallery manager */}
        <GalleryManager initialItems={galleryItems} />
      </div>
    </div>
  );
}