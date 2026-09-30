"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Check,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteCertificate,
  publishCertificate,
  reorderCertificate,
  unpublishCertificate,
} from "@/app/dashboard/certificates/actions";

type CertificateItem = {
  id: string;
  title: string;
  issuer: string | null;
  issueDate: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type CertificateListProps = {
  items: CertificateItem[];
  onEdit: (certificate: CertificateItem) => void;
  onItemsChange: (
    items: CertificateItem[],
  ) => void;
};

export function CertificateList({
  items,
  onEdit,
  onItemsChange,
}: CertificateListProps) {
  const [loadingId, setLoadingId] =
    React.useState<string | null>(null);

  const [menuId, setMenuId] =
    React.useState<string | null>(null);

  async function handlePublishToggle(
    certificate: CertificateItem,
  ) {
    setLoadingId(certificate.id);

    try {
      const updated =
        certificate.status === "PUBLISHED"
          ? await unpublishCertificate(
              certificate.id,
            )
          : await publishCertificate(
              certificate.id,
            );

      onItemsChange(
        items.map((item) =>
          item.id === certificate.id
            ? {
                ...item,
                status: updated.status,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update certificate status.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(
    certificate: CertificateItem,
  ) {
    const confirmed = window.confirm(
      `Delete "${certificate.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setLoadingId(certificate.id);

    try {
      await deleteCertificate(
        certificate.id,
      );

      onItemsChange(
        items.filter(
          (item) =>
            item.id !== certificate.id,
        ),
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete certificate.",
      );
    } finally {
      setLoadingId(null);
      setMenuId(null);
    }
  }

  async function handleReorder(
    certificate: CertificateItem,
    direction: "up" | "down",
  ) {
    setLoadingId(certificate.id);

    try {
      await reorderCertificate(
        certificate.id,
        direction,
      );

      const currentIndex =
        items.findIndex(
          (item) =>
            item.id === certificate.id,
        );

      if (currentIndex === -1) return;

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

      const nextItems = [...items];

      [
        nextItems[currentIndex],
        nextItems[targetIndex],
      ] = [
        nextItems[targetIndex],
        nextItems[currentIndex],
      ];

      onItemsChange(nextItems);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to reorder certificate.",
      );
    } finally {
      setLoadingId(null);
      setMenuId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-emerald-500/10">
          <Check className="size-5 text-emerald-600" />
        </div>

        <h3 className="mt-4 text-sm font-semibold">
          No certificates yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Add professional certificates,
          qualifications, and credentials to
          display them on the portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(
        (certificate, index) => {
          const isLoading =
            loadingId === certificate.id;

          return (
            <div
              key={certificate.id}
              className="group relative rounded-2xl border bg-card p-3 transition-colors hover:bg-muted/20 sm:p-4"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Image */}
                <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/30 sm:size-24">
                  {certificate.imageUrl ? (
                    <Image
                      src={
                        certificate.imageUrl
                      }
                      alt={
                        certificate.title
                      }
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      No image
                    </span>
                  )}
                </div>

                {/* Main information */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold sm:text-base">
                      {certificate.title}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        certificate.status ===
                        "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {certificate.status ===
                      "PUBLISHED"
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                    {certificate.issuer ||
                      "No issuing organization"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    {certificate.issueDate && (
                      <span>
                        {new Intl.DateTimeFormat(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          },
                        ).format(
                          new Date(
                            certificate.issueDate,
                          ),
                        )}
                      </span>
                    )}

                    {certificate.credentialId && (
                      <span className="truncate">
                        ID:{" "}
                        {
                          certificate.credentialId
                        }
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop actions */}
                <div className="hidden shrink-0 items-center gap-1 sm:flex">
                  <button
                    type="button"
                    onClick={() =>
                      handleReorder(
                        certificate,
                        "up",
                      )
                    }
                    disabled={
                      isLoading ||
                      index === 0
                    }
                    className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                    aria-label="Move certificate up"
                  >
                    <ArrowUp className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleReorder(
                        certificate,
                        "down",
                      )
                    }
                    disabled={
                      isLoading ||
                      index ===
                        items.length - 1
                    }
                    className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                    aria-label="Move certificate down"
                  >
                    <ArrowDown className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handlePublishToggle(
                        certificate,
                      )
                    }
                    disabled={isLoading}
                    className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
                    aria-label={
                      certificate.status ===
                      "PUBLISHED"
                        ? "Unpublish certificate"
                        : "Publish certificate"
                    }
                  >
                    {certificate.status ===
                    "PUBLISHED" ? (
                      <X className="size-4" />
                    ) : (
                      <Check className="size-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onEdit(certificate)
                    }
                    disabled={isLoading}
                    className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
                    aria-label="Edit certificate"
                  >
                    <Pencil className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        certificate,
                      )
                    }
                    disabled={isLoading}
                    className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"
                    aria-label="Delete certificate"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {/* Mobile menu */}
                <div className="relative sm:hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setMenuId(
                        menuId ===
                          certificate.id
                          ? null
                          : certificate.id,
                      )
                    }
                    className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Certificate actions"
                  >
                    <MoreHorizontal className="size-5" />
                  </button>

                  {menuId ===
                    certificate.id && (
                    <div className="absolute right-0 top-11 z-30 w-44 overflow-hidden rounded-xl border bg-popover p-1 shadow-xl">
                      <button
                        type="button"
                        onClick={() =>
                          handleReorder(
                            certificate,
                            "up",
                          )
                        }
                        disabled={
                          isLoading ||
                          index === 0
                        }
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition hover:bg-muted disabled:opacity-40"
                      >
                        <ArrowUp className="size-4" />
                        Move up
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleReorder(
                            certificate,
                            "down",
                          )
                        }
                        disabled={
                          isLoading ||
                          index ===
                            items.length - 1
                        }
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition hover:bg-muted disabled:opacity-40"
                      >
                        <ArrowDown className="size-4" />
                        Move down
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handlePublishToggle(
                            certificate,
                          )
                        }
                        disabled={isLoading}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition hover:bg-muted disabled:opacity-40"
                      >
                        {certificate.status ===
                        "PUBLISHED" ? (
                          <X className="size-4" />
                        ) : (
                          <Check className="size-4" />
                        )}

                        {certificate.status ===
                        "PUBLISHED"
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onEdit(
                            certificate,
                          );
                          setMenuId(null);
                        }}
                        disabled={isLoading}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition hover:bg-muted disabled:opacity-40"
                      >
                        <Pencil className="size-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            certificate,
                          )
                        }
                        disabled={isLoading}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 transition hover:bg-red-500/10 disabled:opacity-40"
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}