"use client";

import * as React from "react";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit3,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  deleteGalleryItem,
  publishGalleryItem,
  reorderGalleryItem,
  unpublishGalleryItem,
} from "@/app/dashboard/gallery/actions";

type GalleryRecord = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  imageUrl: string;
  imagePublicId: string;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type GalleryListProps = {
  items: GalleryRecord[];
  onEdit: (item: GalleryRecord) => void;
  onChange: (items: GalleryRecord[]) => void;
};

export function GalleryList({
  items,
  onEdit,
  onChange,
}: GalleryListProps) {
  const [loadingId, setLoadingId] =
    React.useState<string | null>(null);

  const [openMenuId, setOpenMenuId] =
    React.useState<string | null>(null);

  const [error, setError] =
    React.useState("");

  async function handlePublishToggle(
    item: GalleryRecord,
  ) {
    setLoadingId(item.id);
    setError("");

    try {
      const updated =
        item.status === "PUBLISHED"
          ? await unpublishGalleryItem(item.id)
          : await publishGalleryItem(item.id);

      onChange(
        items.map((current) =>
          current.id === item.id
            ? {
                ...current,
                status: updated.status,
              }
            : current,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update gallery status.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(
    item: GalleryRecord,
  ) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This will also remove the image from Cloudinary.`,
    );

    if (!confirmed) {
      return;
    }

    setLoadingId(item.id);
    setError("");

    try {
      await deleteGalleryItem(item.id);

      onChange(
        items.filter(
          (current) => current.id !== item.id,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete gallery item.",
      );
    } finally {
      setLoadingId(null);
      setOpenMenuId(null);
    }
  }

  async function handleReorder(
    item: GalleryRecord,
    direction: "up" | "down",
  ) {
    const currentIndex = items.findIndex(
      (current) => current.id === item.id,
    );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      return;
    }

    setLoadingId(item.id);
    setError("");

    try {
      await reorderGalleryItem(
        item.id,
        direction,
      );

      const nextItems = [...items];

      [
        nextItems[currentIndex],
        nextItems[targetIndex],
      ] = [
        nextItems[targetIndex],
        nextItems[currentIndex],
      ];

      onChange(nextItems);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to reorder gallery item.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <MoreHorizontal className="size-6" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-foreground">
          No gallery items yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Add your first gallery item to start building
          the visual portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Desktop header */}
        <div className="hidden border-b border-border bg-muted/30 px-5 py-3 md:grid md:grid-cols-[minmax(0,1fr)_140px_170px] md:items-center md:gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Gallery Item
          </span>

          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </span>

          <span className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Actions
          </span>
        </div>

        <div className="divide-y divide-border">
          {items.map((item, index) => {
            const isLoading =
              loadingId === item.id;

            const isPublished =
              item.status === "PUBLISHED";

            return (
              <div
                key={item.id}
                className="group relative p-4 transition-colors hover:bg-muted/30 sm:p-5"
              >
                <div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_140px_170px] md:items-center md:gap-4">
                  {/* Gallery item */}
                  <div className="flex min-w-0 items-start gap-4">
                    {/* Image */}
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:size-24">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-foreground">
                            {item.title}
                          </h3>

                          {item.category && (
                            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              {item.category}
                            </p>
                          )}
                        </div>

                        {/* Mobile menu */}
                        <div className="relative md:hidden">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === item.id
                                  ? null
                                  : item.id,
                              )
                            }
                            disabled={isLoading}
                            aria-label="Open actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>

                          {openMenuId === item.id && (
                            <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg">
                              <button
                                type="button"
                                onClick={() => {
                                  onEdit(item);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                              >
                                <Edit3 className="size-4" />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handlePublishToggle(
                                    item,
                                  );
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                              >
                                <Check className="size-4" />
                                {isPublished
                                  ? "Unpublish"
                                  : "Publish"}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleDelete(item);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
                          {item.description}
                        </p>
                      )}

                      {/* Mobile status */}
                      <div className="mt-3 flex items-center gap-2 md:hidden">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
                            isPublished
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                          ].join(" ")}
                        >
                          {isPublished
                            ? "Published"
                            : "Draft"}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop status */}
                  <div className="hidden md:block">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
                        isPublished
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      ].join(" ")}
                    >
                      {isPublished
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  {/* Desktop actions */}
                  <div className="hidden items-center justify-end gap-1 md:flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleReorder(
                          item,
                          "up",
                        )
                      }
                      disabled={
                        isLoading ||
                        index === 0
                      }
                      title="Move up"
                    >
                      <ArrowUp className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleReorder(
                          item,
                          "down",
                        )
                      }
                      disabled={
                        isLoading ||
                        index ===
                          items.length - 1
                      }
                      title="Move down"
                    >
                      <ArrowDown className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        onEdit(item)
                      }
                      disabled={isLoading}
                      title="Edit"
                    >
                      <Edit3 className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handlePublishToggle(
                          item,
                        )
                      }
                      disabled={isLoading}
                      title={
                        isPublished
                          ? "Unpublish"
                          : "Publish"
                      }
                    >
                      <Check className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDelete(item)
                      }
                      disabled={isLoading}
                      title="Delete"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Loading overlay */}
                {isLoading && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                    <div className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                      Updating...
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}