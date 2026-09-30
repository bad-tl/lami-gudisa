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
  deleteSkill,
  publishSkill,
  reorderSkill,
  unpublishSkill,
} from "@/app/dashboard/skills/actions";

type SkillRecord = {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  level: number | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type SkillsListProps = {
  skills: SkillRecord[];
  onEdit: (skill: SkillRecord) => void;
  onChange: React.Dispatch<React.SetStateAction<SkillRecord[]>>;
};

export function SkillsList({
  skills,
  onEdit,
  onChange,
}: SkillsListProps) {
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function handlePublish(skill: SkillRecord) {
    try {
      setBusyId(skill.id);

      const result =
        skill.status === "PUBLISHED"
          ? await unpublishSkill(skill.id)
          : await publishSkill(skill.id);

      if (result.success) {
        onChange((current) =>
          current.map((item) =>
            item.id === skill.id
              ? {
                  ...item,
                  status:
                    skill.status === "PUBLISHED"
                      ? "DRAFT"
                      : "PUBLISHED",
                  updatedAt: new Date(),
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to change skill status:", error);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(skill: SkillRecord) {
    const confirmed = window.confirm(
      `Delete "${skill.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setBusyId(skill.id);

      const result = await deleteSkill(skill.id);

      if (result.success) {
        onChange((current) =>
          current.filter((item) => item.id !== skill.id),
        );
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);
    } finally {
      setBusyId(null);
    }
  }

  async function handleReorder(
    skill: SkillRecord,
    direction: "up" | "down",
  ) {
    try {
      setBusyId(skill.id);

      const currentIndex = skills.findIndex(
        (item) => item.id === skill.id,
      );

      const adjacentIndex =
        direction === "up"
          ? currentIndex - 1
          : currentIndex + 1;

      if (
        currentIndex < 0 ||
        adjacentIndex < 0 ||
        adjacentIndex >= skills.length
      ) {
        return;
      }

      const adjacentSkill = skills[adjacentIndex];

      const result = await reorderSkill(
        skill.id,
        direction,
      );

      if (result.success) {
        onChange((current) => {
          const next = [...current];

          const first = next.findIndex(
            (item) => item.id === skill.id,
          );

          const second = next.findIndex(
            (item) => item.id === adjacentSkill.id,
          );

          if (first === -1 || second === -1) {
            return current;
          }

          [next[first], next[second]] = [
            next[second],
            next[first],
          ];

          return next.map((item, index) => ({
            ...item,
            sortOrder: index,
          }));
        });
      }
    } catch (error) {
      console.error("Failed to reorder skill:", error);
    } finally {
      setBusyId(null);
    }
  }

  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {skills.map((skill, index) => {
        const isBusy = busyId === skill.id;
        const isPublished = skill.status === "PUBLISHED";

        return (
          <div
            key={skill.id}
            className="
              group
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-emerald-200
              hover:shadow-md
              sm:p-5
            "
          >
            <div className="flex min-w-0 items-start gap-4">
              {/* Number */}
              <div className="hidden shrink-0 pt-1 text-xs font-semibold tabular-nums text-slate-300 sm:block">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Icon */}
              <div
                className="
                  flex
                  size-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-100
                  bg-emerald-50
                  text-emerald-700
                "
              >
                {skill.icon ? (
                  <span className="text-xs font-bold">
                    {skill.icon.slice(0, 2).toUpperCase()}
                  </span>
                ) : (
                  <span className="text-sm font-semibold">
                    {skill.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Main content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold text-slate-950 sm:text-base">
                      {skill.name}
                    </h3>

                    {skill.category && (
                      <p className="mt-1 break-words text-xs text-slate-500">
                        {skill.category}
                      </p>
                    )}
                  </div>

                  <span
                    className={[
                      "w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                      isPublished
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Level */}
                {skill.level !== null && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        Proficiency
                      </span>

                      <span className="text-xs font-semibold tabular-nums text-slate-600">
                        {skill.level}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{
                          width: `${skill.level}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isBusy || index === 0}
                    onClick={() =>
                      handleReorder(skill, "up")
                    }
                    className="h-8 gap-1.5 text-xs text-slate-500"
                  >
                    <ArrowUp className="size-3.5" />
                    Up
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={
                      isBusy || index === skills.length - 1
                    }
                    onClick={() =>
                      handleReorder(skill, "down")
                    }
                    className="h-8 gap-1.5 text-xs text-slate-500"
                  >
                    <ArrowDown className="size-3.5" />
                    Down
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isBusy}
                    onClick={() => onEdit(skill)}
                    className="h-8 gap-1.5 text-xs text-slate-500"
                  >
                    <Edit3 className="size-3.5" />
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isBusy}
                    onClick={() =>
                      handlePublish(skill)
                    }
                    className="h-8 gap-1.5 text-xs text-emerald-700"
                  >
                    <Check className="size-3.5" />
                    {isPublished ? "Unpublish" : "Publish"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isBusy}
                    onClick={() =>
                      handleDelete(skill)
                    }
                    className="h-8 gap-1.5 text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>

                  <MoreHorizontal className="ml-auto hidden size-4 text-slate-300 sm:block" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}